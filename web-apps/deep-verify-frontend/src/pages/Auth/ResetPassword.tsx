import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import {
  confirmResetPassword,
  resetChangedRequested,
  resetRegErrMsg,
} from "../../store/slices/userSlice";
import { RootState } from "../../store/store";
import {
  ResetPasswordProps,
  UserStateProps,
} from "../../store/interfaces/user.interface";
import ConditionalRoute from "../../routes/ConditionalRoute";
import MetaTags from "../../components/MetaTags";
import { ResetPasswordSchema } from "../../utils/Yup";
import { LiaEyeSlashSolid, LiaEyeSolid } from "react-icons/lia";
import ButtonSpinner from "../../components/ButtonSpinner";

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const navigate = useNavigate();

  const dispatch = useDispatch<Dispatch<any>>();
  const userSlice = useSelector<RootState, UserStateProps>(
    (state) => state.user
  );

  const onChange = useCallback((values: ResetPasswordProps) => {
    dispatch(confirmResetPassword({ ...values, token } as ResetPasswordProps));
  }, []);

  const handleClose = useCallback(() => {
    dispatch(resetChangedRequested());
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (userSlice.errMsg && userSlice.errMsg.Id === "RESET_PASSWORD_ERROR") {
      setTimeout(() => {
        dispatch(resetRegErrMsg());
      }, 5000);
    }
  }, [userSlice.errMsg]);

  useEffect(() => {
    if (userSlice.changedPasswordProps) {
      setIsOpen(true);
      setTimeout(() => {
        dispatch(resetChangedRequested());
        navigate("/login");
      }, 5000);
    }
  }, [userSlice.changedPasswordProps]);

  return (
    <ConditionalRoute redirectTo="/404" condition={(token && true) || false}>
      {/* <ConditionalRoute
        redirectTo="/login"
        condition={userSlice.changedPasswordProps ? false : true}
      > */}
      <>
        <MetaTags />
        <div className="flex flex-col w-full md:w-[38rem] mt-36 px-4 mx-auto">
          <div className="mx-auto flex flex-col justify-center gap-8 p-8 w-full rounded-2xl border border-neutral-300 dark:border-neutral-500">
            <div className="text-center flex flex-col gap-4 mt-4 mb-4">
              <h1 className="text-lg text-black dark:text-white font-bold">
                Update your password
              </h1>
              <p className="text-sm text-black dark:text-white opacity-70">
                Kindly update your password
              </p>
            </div>

            <Formik
              initialValues={{ password: "", confirmPassword: "" }}
              validationSchema={ResetPasswordSchema}
              onSubmit={(values) => onChange(values)}
            >
              {({ errors, values, setFieldValue }) => (
                <Form>
                  {userSlice.errMsg &&
                    userSlice.errMsg.Id === "RESET_PASSWORD_ERROR" &&
                    userSlice.errMsg.msg
                      .split(",")
                      .map((message: any, index: any) => (
                        <div
                          key={index}
                          className="mb-2 p-2 text-red-700 bg-red-100 rounded"
                        >
                          {message}
                        </div>
                      ))}

                  <div className="flex flex-col mb-4">
                    <label className="text-black dark:text-white opacity-70 text-sm font-medium">
                      New password
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={(e) =>
                          setFieldValue("password", e.target.value)
                        }
                        placeholder={
                          showPassword ? "Enter new password" : "********"
                        }
                        className="w-full px-4 py-3 text-black dark:text-white bg-transparent border border-neutral-300 dark:border-neutral-500 rounded-lg mt-1 focus:border-custom-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showPassword ? <LiaEyeSlashSolid /> : <LiaEyeSolid />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="text-xs text-red-600 mt-1">
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col mb-8">
                    <label className="text-black dark:text-white opacity-70 text-sm font-medium">
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={values.confirmPassword}
                        onChange={(e) =>
                          setFieldValue("confirmPassword", e.target.value)
                        }
                        placeholder={
                          showConfirmPassword
                            ? "Confirm your password"
                            : "********"
                        }
                        className="w-full px-4 py-3 text-black dark:text-white bg-transparent border border-neutral-300 dark:border-neutral-500 rounded-lg mt-1 focus:border-custom-primary"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                      >
                        {showConfirmPassword ? (
                          <LiaEyeSlashSolid />
                        ) : (
                          <LiaEyeSolid />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="text-xs text-red-600 mt-1">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center my-4">
                    <button
                      type="submit"
                      className={`
                          ${
                            userSlice?.reqResettingPass
                              ? "bg-white border-custom-primary"
                              : "bg-custom-primary border-white"
                          }  font-bold rounded-lg shadow-md text-white w-full h-[2.5rem] justify-center items-center hover:bg-white hover:border hover:border-custom-primary hover:text-custom-primary`}
                      disabled={userSlice?.reqResettingPass}
                    >
                      {userSlice?.reqResettingPass ? (
                        <ButtonSpinner />
                      ) : (
                        "Update password"
                      )}
                    </button>
                  </div>

                  <div className="flex justify-center text-black dark:text-white my-8">
                    <button
                      type="button"
                      onClick={() => (window.location.href = "/login")}
                      className="flex items-center text-sm"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        ></path>
                      </svg>
                      Back to login
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {userSlice?.changedPasswordProps && (
          <div
            className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? "block" : "hidden"}`}
          >
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                aria-hidden="true"
              ></div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white dark:bg-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white dark:bg-black p-6 sm:p-6">
                  <div className="flex justify-end">
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <h3 className="text-lg leading-6 font-medium text-black dark:text-white">
                        Password Reset Successful
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-black dark:text-white opacity-70">
                          We have successfully reset password. Please log in
                          with your new password.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </ConditionalRoute>
    // </ConditionalRoute>
  );
}

export default ResetPassword;
