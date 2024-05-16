import { Model } from 'mongoose';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './users.service';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/create-user.dto';
import { Role, UserProps } from './interfaces/user.interfaces';
import HttpStatusCodes from '../../configurations/HttpStatusCodes';
import { Roles } from '@/middleware/authorization/roles.decorator';
import { RolesGuard } from '@/middleware/authorization/guards/roles.guard';
import { VerifyLogin } from '@/middleware/authorization/verifylogin.strategy';
import {
  Controller,
  Get,
  Post,
  Res,
  Req,
  Body,
  Param,
  Query,
  UseGuards,
  Put,
  HttpException,
  HttpStatus,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
} from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private mailService: MailService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  // @UseGuards(VerifyLogin)
  async user(@Res() res: any, @Req() req: any) {
    return res.status(200).send({ user: req.user });
  }

  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth(@Req() req) {}

  // @Get('google/redirect')
  // @UseGuards(AuthGuard('google'))
  // googleAuthRedirect(@Req() req) {
  //   return this.userService.googleLogin(req)
  // }

  @Put()
  // @UseGuards(VerifyLogin)
  async updateUser(
    @Res() res: any,
    @Req() req: any,
    @Body() body: UpdateUserDto,
  ) {
    await this.userService.updateUserProflie(body, req.user);
    return res.status(200).send({ updated: true });
  }

  @Post('register')
  async userRegister(
    @Body() body: CreateUserDto,
    @Res() res: any,
  ): Promise<UserProps> {
    try {
      const userData = await this.userService.findOneByEmail(body.email);

      if (userData)
        throw new HttpException(
          'This email is already associated with an account',
          HttpStatusCodes.BAD_REQUEST,
        );

      const userObject = await this.userService.create(body, [Role.User]);
      const { password, createdAt, updatedAt, ...user } = userObject.toObject();

      const newUserData = await this.userService.findOneByEmail(body.email);
      if (!user.isVerified) this.userService.createUserEmailToken(newUserData);

      return res.status(200).json({ isRegistered: true, user });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Post('login')
  async loginUser(
    @Body() body: LoginUserDto,
    @Res() res: any,
  ): Promise<UserProps> {
    try {
      const userData = await this.userService.findOneByEmail(body.email);

      if (!userData)
        throw new HttpException(
          'Invalid credentials',
          HttpStatusCodes.BAD_REQUEST,
        );

      const loggedUser = await this.userService.login(body, userData);

      if (!loggedUser.status)
        throw new HttpException(loggedUser.msg, HttpStatusCodes.BAD_REQUEST);

      const { password, createdAt, updatedAt, ...user } = userData.toObject();

      if (!userData.isVerified) this.userService.createUserEmailToken(userData);

      return res.status(200).send({
        ...loggedUser,
        user,
        isAuthenticated: true,
        token: loggedUser.token,
      });
    } catch (error) {
      console.log(error)
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
  
  @Post('login-with-google')
  async loginWithGoogle(@Body() body: { accessToken: string }, @Res() res: any): Promise<any> {
    try {
      const result = await this.userService.loginWithGoogle(body.accessToken);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }


  @Post('request-password')
  async requestPassword(
    @Body() body: ResetPasswordDto,
    @Res() res: any,
  ): Promise<Response<any>> {
    try {
      const userData = await this.userService.findOneByEmail(body.email);

      if (!userData)
        throw new HttpException('User not found', HttpStatusCodes.FORBIDDEN);

      const { msg, status, email } =
        await this.userService.createForgotPasswordCode(userData);

      return res.status(status).send({ msg, passwordRequested: true, email });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('verify-account/:token')
  async verifyAccount(@Param('token') token: string, @Res() res: any) {
    try {
      if (!token)
        return res
          .status(302)
          .redirect(
            `${this.configService.get(
              'CLIENT_URL',
            )}/login?msg=Invalid token provided`,
          );

      const { isVerified, msg } =
        await this.userService.verifyEmailToken(token);

      if (isVerified)
        return res
          .status(302)
          .redirect(`${this.configService.get('CLIENT_URL')}/login?msg=${msg}`);

      if (!isVerified)
        return res
          .status(302)
          .redirect(`${this.configService.get('CLIENT_URL')}/login?msg=${msg}`);
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get('reset-password')
  async resetPassword(@Query('code') code: string, @Res() res: any) {
    try {
      const {
        redirect,
        statusCode,
        userId,
        msg,
        code: token,
      } = await this.userService.verifyResetPasswordCode(code);

      if (userId)
        return res
          .status(statusCode)
          .redirect(
            `${this.configService.get(
              'CLIENT_URL',
            )}/reset-password?id=${userId}&code=${token}`,
          );

      if (redirect)
        return res
          .status(statusCode)
          .redirect(
            `${this.configService.get('CLIENT_URL')}/recover-password?msg=${msg}`,
          );

      return res
        .status(statusCode)
        .redirect(
          `${this.configService.get('CLIENT_URL')}/recover-password?msg=${msg}`,
        );
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Post('change-password')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Res() res: any,
  ): Promise<void> {
    try {
      const user = await this.userService.findOneByid(body.id);
      if (!user)
        throw new HttpException('User not found', HttpStatusCodes.FORBIDDEN);

      const { msg, statusCode } = await this.userService.updateUserPassword({
        email: user.email,
        ...body,
      });

      return res.status(statusCode).send({ msg, changed: true });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }
}
