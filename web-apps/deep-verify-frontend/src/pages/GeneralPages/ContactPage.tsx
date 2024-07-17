import React from "react";
import { useFormik } from "formik";
import { ContactUsSchema } from "../../utils/Yup";
import ButtonComponent from "../../components/ButtonComponent";
import MetaTags from "../../components/MetaTags";
import PageLayout from "../../components/PageLayout";

const ContactPage: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema: ContactUsSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <PageLayout>
      <>
        <MetaTags />
        <div className="flex w-full justify-center">
        <div className="flex flex-col overflow-hidden max-w-3xl gap-12 justify-center">
          <div className="flex flex-col text-center items-center justify-center">
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </p>
            <p className="mt-4 max-w-4xl text-center flex w-full text-lg leading-relaxed text-black dark:text-white opacity-70">
              We'd love to hear from you! Whether you have a question about
              features or anything else, our team is ready to answer all your
              questions.
            </p>
          </div>
          <div className="bg-white dark:bg-black text-black dark:text-white w-fullgap-8">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="name"
                      className="text-base font-medium mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...formik.getFieldProps("name")}
                      className={`p-4 border border-neutral-300 dark:border-neutral-500 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white ${
                        formik.touched.name && formik.errors.name
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Your Name"
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <div className="text-red-500 text-sm mt-2">
                        {formik.errors.name}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-base font-medium mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...formik.getFieldProps("email")}
                      className={`p-4 border border-neutral-300 dark:border-neutral-500 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Your Email"
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-red-500 text-sm mt-2">
                        {formik.errors.email}
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label
                    htmlFor="message"
                    className="text-base font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    {...formik.getFieldProps("message")}
                    className={`p-4 border border-neutral-300 dark:border-neutral-500 rounded-lg bg-white dark:bg-neutral-900 text-black dark:text-white ${
                      formik.touched.message && formik.errors.message
                        ? "border-red-500"
                        : ""
                    }`}
                    rows={5}
                    placeholder="Your Message"
                  ></textarea>
                  {formik.touched.message && formik.errors.message ? (
                    <div className="text-red-500 text-sm mt-2">
                      {formik.errors.message}
                    </div>
                  ) : null}
                </div>
                <div className="w-full text-center">
                  <ButtonComponent>Send Message</ButtonComponent>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>
      </>
    </PageLayout>
  );
};

export default ContactPage;
