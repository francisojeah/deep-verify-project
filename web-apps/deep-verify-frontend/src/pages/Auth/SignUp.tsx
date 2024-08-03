import {
  Role,
  UserSignupProps,
  UserStateProps,
} from "../../store/interfaces/user.interface";
import { UserSignupSchema } from "../../utils/Yup";
import { Alert } from "flowbite-react";
import { Form, Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LiaEyeSlashSolid, LiaEyeSolid } from "react-icons/lia";
import ButtonSpinner from "../../components/ButtonSpinner";
import ConditionalRoute from "../../routes/ConditionalRoute";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { FcGoogle } from "react-icons/fc";
import UserRegisterSuccessModal from "../../components/UserRegisterSuccessModal";
import {
  resetRegErrMsg,
  resetRegistered,
  resetUser,
  signupUser,
} from "../../store/slices/userSlice";
import MetaTags from "../../components/MetaTags";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [openSignupModal, setOpenSignupModal] = useState<boolean>(false);

  const dispatch = useDispatch<any>();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user
  );

  const onRegister = useCallback(
    (props: UserSignupProps) => {
      return dispatch(signupUser(props));
    },
    [dispatch, signupUser]
  );

  // const onLoginWithGoogle = useCallback((props: any) => {
  //   return dispatch(loginWithGoogle(props));
  // }, []);

  // const googleLogin = useGoogleLogin({
  //   onSuccess: async (codeResponse) => {
  //     onLoginWithGoogle({
  //       accessToken: codeResponse.access_token,
  //     });
  //   },
  //   onError: (error) => console.log("Login Failed:", error),
  // });

  const handleClose = useCallback(() => {
    setOpenSignupModal(false);
    dispatch(resetUser());
    dispatch(resetRegistered());
  }, []);

  useEffect(() => {
    dispatch(resetRegistered());
  }, []);

  useEffect(() => {
    if (userSlice.errMsg && userSlice.errMsg.Id === "USER_REGISTER_ERROR") {
      setTimeout(() => {
        dispatch(resetRegErrMsg());
      }, 5000);
    }

    if (
      userSlice.isRegistered &&
      userSlice.user &&
      !userSlice.user?.isVerified
    ) {
      setOpenSignupModal(true);
      setTimeout(() => {
        dispatch(resetUser());
        dispatch(resetRegistered());
      }, 10000);
    }
  }, [userSlice, userSlice.user]);

  return (
    <ConditionalRoute
      redirectTo="/home"
      condition={
        userSlice.user &&
        userSlice.user.isVerified &&
        userSlice.isAuthenticated &&
        (userSlice.user.roles.includes(Role.User) ||
          userSlice.user.roles.includes(Role.Admin))
          ? false
          : true
      }
    >
      <>
        <MetaTags
          title={"Sign Up | Deep Verify"}
          description={"Signup"}
          pageUrl={window.location.href}
        />
        <div className="flex justify-center items-center h-screen w-full px-4">
          
            <div className="max-w-xl w-full flex justify-center items-center rounded-2xl border border-neutral-300 dark:border-neutral-500">
            <div className="flex w-full  justify-center">
              <div className="flex flex-col justify-center w-full gap-8 p-8 text-black dark:text-white">
                <div className="flex w-full justify-between items-center">
                  <p className=" text-[2rem] font-bold">Sign Up</p>
                  <Link to={"/home"}>
                    <img
                      className="flex w-[2.5rem] h-[2.5rem]"
                      src="/assets/icons/logo.svg"
                      alt="Deep Verify Logo"
                    />
                  </Link>
                </div>
                <Formik
                  initialValues={{
                    firstname: "",
                    lastname: "",
                    email: "",
                    password: "",
                    cpassword: "",
                  }}
                  validationSchema={UserSignupSchema}
                  onSubmit={(values) => {
                    onRegister(values);
                  }}
                >
                  {({ errors, values, setFieldValue }) => (
                    <Form>
                      <div className="flex flex-col gap-4">
                        {userSlice.errMsg &&
                          userSlice.errMsg.Id === "USER_REGISTER_ERROR" && (
                            <Alert color="failure" className="py-3">
                              <span className="font-medium">
                                {userSlice.errMsg.msg}
                              </span>
                            </Alert>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <p className="text-black dark:text-white opacity-70 text-sm">Firstname</p>
                          <input
                            className=" flex shadow-none px-4 py-3 bg-transparent rounded-lg border border-neutral-300 dark:border-neutral-500 self-stretch gap-2 items-center focus:border-custom-primary"
                            type="text"
                            onChange={(e) =>
                              setFieldValue("firstname", e.target.value)
                            }
                            placeholder="Your firstname"
                          />
                          {errors && errors.firstname && (
                            <p className="text-[12px] mt-1 text-custom-danger">
                              {errors.firstname}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-black dark:text-white opacity-70 text-sm">Lastname</p>
                          <input
                            className=" flex shadow-none px-4 py-3 bg-transparent rounded-lg border border-neutral-300 dark:border-neutral-500 self-stretch gap-2 items-center focus:border-custom-primary"
                            type="text"
                            onChange={(e) =>
                              setFieldValue("lastname", e.target.value)
                            }
                            placeholder="Your lastname"
                          />
                          {errors && errors.lastname && (
                            <p className="text-[12px] mt-1 text-custom-danger">
                              {errors.lastname}
                            </p>
                          )}
                        </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-black dark:text-white opacity-70 text-sm">Email</p>
                          <input
                            className=" flex shadow-none px-4 py-3 bg-transparent rounded-lg border border-neutral-300 dark:border-neutral-500 self-stretch gap-2 items-center focus:border-custom-primary"
                            type="email"
                            onChange={(e) =>
                              setFieldValue("email", e.target.value)
                            }
                            placeholder="Your email address"
                          />
                          {errors && errors.email && (
                            <p className="text-[12px] mt-1 text-custom-danger">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-black dark:text-white opacity-70 text-sm">Password</p>
                          <div className="relative">
                            <input
                              className=" flex shadow-none px-4 py-3 bg-transparent rounded-lg border border-neutral-300 dark:border-neutral-500 self-stretch w-full gap-2 items-center focus:border-custom-primary"
                              type={showPassword ? "text" : "password"}
                              value={values["password"]}
                              placeholder={
                                showPassword
                                  ? "Enter your password"
                                  : "********"
                              }
                              onChange={(e) =>
                                setFieldValue("password", e.target.value)
                              }
                            />
                            <div className="absolute inset-y-0 right-0 p-4 flex items-center">
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                  showPassword
                                    ? "Hide Password"
                                    : "Show Password"
                                }
                              >
                                {showPassword ? (
                                  <LiaEyeSlashSolid />
                                ) : (
                                  <LiaEyeSolid />
                                )}
                              </button>
                            </div>
                          </div>
                          {errors && errors.password && (
                            <p className="text-[12px] mt-1 text-custom-danger">
                              {errors.password}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <p className="text-black dark:text-white opacity-70 text-sm">
                            Confirm Password
                          </p>
                          <div className="relative">
                            <input
                              className=" flex shadow-none px-4 py-3 bg-transparent rounded-lg border border-neutral-300 dark:border-neutral-500 self-stretch w-full gap-2 items-center focus:border-custom-primary"
                              type={showConfirmPassword ? "text" : "password"}
                              value={values["cpassword"]}
                              placeholder={
                                showConfirmPassword
                                  ? "Confirm your password"
                                  : "********"
                              }
                              onChange={(e) =>
                                setFieldValue("cpassword", e.target.value)
                              }
                            />
                            <div className="absolute inset-y-0 right-0 p-4 flex items-center">
                              <button
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                                aria-label={
                                  showConfirmPassword
                                    ? "Hide Password"
                                    : "Show Password"
                                }
                              >
                                {showConfirmPassword ? (
                                  <LiaEyeSlashSolid />
                                ) : (
                                  <LiaEyeSolid />
                                )}
                              </button>
                            </div>
                          </div>
                          {errors && errors.cpassword && (
                            <p className="text-[12px] mt-1 text-custom-danger">
                              {errors.cpassword}
                            </p>
                          )}
                        </div>

                        <button
                          className={`${
                            userSlice?.isRegistering
                              ? "bg-white border-custom-primary"
                              : "bg-custom-primary border-white"
                          }  font-bold rounded-xl shadow-md text-white w-full h-[2.5rem] justify-center items-center hover:bg-white hover:border hover:border-custom-primary hover:text-custom-primary`}
                          type="submit"
                          disabled={userSlice?.isRegistering}
                        >
                          {userSlice?.isRegistering ? (
                            <ButtonSpinner />
                          ) : (
                            "Sign up"
                          )}
                        </button>
                        <div className="w-full flex flex-col gap-3">
                          <Link to={"/login"}>
                            <p className="font-medium text-sm flex text-center w-full hover:text-custom-primary curor-pointer hover:underline">
                              Already have an account? Login
                            </p>
                          </Link>
                          <p className="font-medium text-sm flex text-center w-full justify-center">
                            Or
                          </p>
                          <button
                            // onClick={() => googleLogin()}
                            className="flex items-center bg-white border border-gray-300 shadow-md justify-center gap-4 rounded-lg px-6 py-3 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 "
                          >
                            <FcGoogle size={20} />
                            <span>Continue with Google</span>
                          </button>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
              </div>
            </div>
        </div>
        {userSlice.user && !userSlice.user.isVerified && (
          <UserRegisterSuccessModal
            openModal={openSignupModal}
            setOpenModal={handleClose}
            email={userSlice.user?.email}
          />
        )}
      </>
    </ConditionalRoute>
  );
};

export default SignUp;
