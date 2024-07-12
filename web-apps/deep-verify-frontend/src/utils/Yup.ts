import * as Yup from "yup";

export const UserSignupSchema = Yup.object().shape({
  email: Yup.string().required("Insert your email"),
  firstname: Yup.string().required("Insert your firstname"),
  lastname: Yup.string().required("Insert your lastname"),
  password: Yup.string()
    .required("Please insert your password")
    .min(5, "Password should be at least 5 characters long"),
  cpassword: Yup.string()
    .required("Please confirm your password")
    .min(5, "Password should be at least 5 characters long")
    // @ts-ignore
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const LoginSchema = Yup.object().shape({
  email: Yup.string().required("Insert your email"),
  password: Yup.string()
    .required("Please insert your password")
    .min(5, "Password should be at least 5 characters long"),
  loginAlways: Yup.boolean(),
});


export const ChangePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one digit"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
}).required();

export const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one digit"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});


export const ContactUsSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    message: Yup.string().required("Message is required"),
  });
