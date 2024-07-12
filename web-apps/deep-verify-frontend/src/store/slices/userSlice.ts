import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AuthProps,
  ChangePasswordProps,
  LoginProps,
  ResetPasswordProps,
  UserSignupProps,
  UserStateProps,
} from "../interfaces/user.interface";
import axios from "axios";
import {
  proxyAddress,
} from "../../utils/constants";

const initialState: UserStateProps = {};

export const signupUser = createAsyncThunk<UserStateProps, UserSignupProps>(
  "user-signup",
  async (values) => {
    try {
      const { data }: any = await axios.post(
        `${proxyAddress}/user/register`,
        values
      );
      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  }
);

export const login = createAsyncThunk<UserStateProps, LoginProps>(
  "login-user",
  async (values) => {
    try {
      const { data }: any = await axios.post(
        `${proxyAddress}/user/login`,
        values
      );
      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk<UserStateProps, any>(
  "login-with-google",
  async (values) => {
    try {
      const { data }: any = await axios.post(
        `${proxyAddress}/user/login-with-google`,
        values
      );
      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  }
);

export const requestPassword = createAsyncThunk<
  { msg: string; passwordRequested: boolean; email: string },
  AuthProps
>("request-password", async (values) => {
  try {
    const { data }: any = await axios.post(
      `${proxyAddress}/backend/v1/auth/reset-password`,
      values
    );
    return data;
  } catch (e: any) {
    throw new Error(e.response.data.error.message);
  }
});

export const changePassword = createAsyncThunk<any, ChangePasswordProps>(
  "change-password",
  async ({token, ...values}, { rejectWithValue }) => {
    try {
      const { data }: any = await axios.post(
        `${proxyAddress}/backend/v1/auth/change-password`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        return rejectWithValue(e.response.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const confirmResetPassword = createAsyncThunk<any, ResetPasswordProps>(
  "confirm-reset-password",
  async ({token, ...values}, { rejectWithValue }) => {
    try {
      const { data }: any = await axios.post(
        `${proxyAddress}/backend/v1/auth/confirm-reset-password`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.message) {
        return rejectWithValue(e.response.data.message);
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const loadUser = createAsyncThunk<UserStateProps>(
  "load-user",
  async () => {
    const token = localStorage.getItem("token");

    try {
      const { data }: any = await axios.get<UserStateProps>(
        `${proxyAddress}/user`,
        {
          headers: { "x-access-token": token },
        }
      );
      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  }
);

export const profileUpdate = createAsyncThunk<UserStateProps, LoginProps>(
  "update-user-profile",
  async (values) => {
    const token = localStorage.getItem("token");
    const headers = { "x-access-token": token };

    try {
      const { data }: any = await axios.put(
        `${proxyAddress}/user`,
        values,
        {
          headers,
        }
      );
      return data;
    } catch (e: any) {
      throw new Error(e.response.data.error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetRegErrMsg: (state) => {
      state.errMsg = null;
    },
    resetRegistered: (state) => {
      state.isRegistered = false;
    },
    resetUser: (state) => {
      state.user = null;
    },
    resetPasswordRequested: (state) => ({
      ...state,
      passwordRequestedProps: null,
    }),
    resetChangedRequested: (state) => {
      state.changedPasswordProps = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("token");
    },
    resetReqdPass: (state) => ({ ...state, reqdResetPass: false }),
    resetCreatedUser: (state) => ({ ...state, createdUsers: null }),
    resetProfileUpdated: (state) => ({ ...state, updatedProfile: false }),
    setAuthToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    //signup user
    builder.addCase(signupUser.pending, (state) => {
      state.isRegistering = true;
    });

    builder.addCase(signupUser.fulfilled, (state, { payload }) => {
      state.isRegistering = false;
      state.isRegistered = payload.isRegistered;
      state.user = payload.user;
    });

    builder.addCase(signupUser.rejected, (state, action) => {
      state.isRegistering = false;
      state.errMsg = {
        msg: action.error.message,
        Id: "USER_REGISTER_ERROR",
      };
    });

    //login user
    builder.addCase(login.pending, (state) => {
      state.loggin = true;
    });

    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.loggin = false;
      state.isAuthenticated = payload.isAuthenticated;
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem("token", payload.token);
    });

    builder.addCase(login.rejected, (state, action) => {
      state.loggin = false;
      state.user = null;
      state.errMsg = {
        msg: action.error.message,
        Id: "LOGIN_ERROR",
      };
    });

    //login user
    builder.addCase(loginWithGoogle.pending, (state) => {
      state.loggin = true;
    });

    builder.addCase(loginWithGoogle.fulfilled, (state, { payload }) => {
      state.loggin = false;
      state.isAuthenticated = payload.isAuthenticated;
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem("token", payload.token);
    });

    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.loggin = false;
      state.user = null;
      state.errMsg = {
        msg: action.error.message,
        Id: "LOGIN_ERROR",
      };
    });


    // forgot password
    builder.addCase(requestPassword.pending, (state) => {
      state.reqResettingPass = true;
    });

    builder.addCase(requestPassword.fulfilled, (state, { payload }) => {
      state.reqResettingPass = false;
      state.passwordRequestedProps = payload;
    });

    builder.addCase(requestPassword.rejected, (state, action) => {
      state.reqResettingPass = false;
      state.errMsg = {
        msg: action.error.message,
        Id: "REQUEST_PASSWORD_ERROR",
      };
    });

    // change password
    builder.addCase(changePassword.pending, (state) => {
      state.reqResettingPass = true;
    });

    builder.addCase(changePassword.fulfilled, (state, { payload }) => {
      state.reqResettingPass = false;
      state.changedPasswordProps = payload;
    });

    builder.addCase(changePassword.rejected, (state, action) => {
      state.reqResettingPass = false;
      state.errMsg = {
        msg: action.payload as string, 
        Id: "CHANGE_PASSWORD_ERROR",
      };
    });

    // change password
    builder.addCase(confirmResetPassword.pending, (state) => {
      state.reqResettingPass = true;
    });

    builder.addCase(confirmResetPassword.fulfilled, (state, { payload }) => {
      state.reqResettingPass = false;
      state.changedPasswordProps = payload;
    });

    builder.addCase(confirmResetPassword.rejected, (state, action) => {
      state.reqResettingPass = false;
      state.errMsg = {
        msg: action.payload as string, 
        Id: "RESET_PASSWORD_ERROR",
      };
    });

    //load user
    builder.addCase(loadUser.pending, (state) => ({ ...state }));

    builder.addCase(loadUser.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.isAuthenticated = true;
    });

    builder.addCase(loadUser.rejected, (state, action) => {
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      state.errMsg = {
        msg: action.error.message,
        Id: "LOAD_USER_ERROR",
      };
    });
  }
});

export const {
  resetUser,
  logoutUser,
  resetReqdPass,
  resetRegErrMsg,
  resetRegistered,
  resetCreatedUser,
  resetProfileUpdated,
  resetChangedRequested,
  resetPasswordRequested,
} = userSlice.actions;
export default userSlice.reducer;

