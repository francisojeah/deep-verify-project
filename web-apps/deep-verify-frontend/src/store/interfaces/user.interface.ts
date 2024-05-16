export enum Role {
  User = 'user',
  Admin = 'admin',
}

export interface UserSignupProps {
  email: string;
  password: string;
  cpassword: string;
}

export interface UserStateProps {
  _id?: any;
  account?: string | null;
  user?: UserProps | null;
  isRegistering?: boolean;
  isLoggin?: boolean;
  isLoading?: boolean;
  errMsg?: ErrorProps | null | any;
  isRegistered?: boolean;
  loggin?: boolean;
  updatingProfile?: boolean;
  updatedProfile?: boolean;
  isAuthenticated?: boolean;
  updated?: boolean;
  token?: string | any;
  reqResettingPass?: boolean;
  passwordRequestedProps?: {
    msg: string;
    passwordRequested: boolean;
    email: string;
  } | null;
  changedPasswordProps?: {
    msg: string;
    changed: boolean;
  } | null;
  loadingUsers?: boolean;
  createdUsers?: any[] | null;
}

export interface LoginProps {
    email: string;
    password: string;
  }

export interface AuthProps {
    email?: string;
    password?: string;
  }
  
  export interface ErrorProps {
    msg: string;
    Id: string;
  }

  export interface UserProps {
    _id?: any;
    firstname: string;
    lastname: string;
    password?: string;
    email: string;
    profileImage?: string;
    isVerified: boolean;
    roles: Role[];
  }