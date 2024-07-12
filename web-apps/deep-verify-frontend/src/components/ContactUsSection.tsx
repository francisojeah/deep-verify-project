import React from "react";
import { useFormik } from "formik";
import HeaderIllustration from "./HeaderIllustration";
import { ContactUsSchema } from "../utils/Yup";
import ButtonComponent from "./ButtonComponent";

const ContactUsSection: React.FC = () => {
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
    <section className="py-16 overflow-hidden">
      <HeaderIllustration text={"Reach"} />
      <div className="flex flex-col text-center items-center justify-center mb-12">
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </p>
            <p className="mt-4 max-w-4xl text-center flex w-full text-lg leading-relaxed text-black dark:text-white opacity-70">
              We'd love to hear from you! Whether you have a question about
              features or anything else, our team is ready to
              answer all your questions.
            </p>
          </div>
      <div className="bg-white dark:bg-black text-black dark:text-white w-full grid md:grid-cols-8 gap-8">
        <div className="order-2 md:order-none w-full mx-auto px-4 sm:px-6 lg:px-8 md:col-span-5">
          
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-base font-medium mb-2">
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
                <div className="text-red-500 text-sm mt-2">{formik.errors.name}</div>
              ) : null}
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-base font-medium mb-2">
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
                <div className="text-red-500 text-sm mt-2">{formik.errors.email}</div>
              ) : null}
            </div>
            </div>
            <div className="flex flex-col md:col-span-2">
              <label htmlFor="message" className="text-base font-medium mb-2">
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
                <div className="text-red-500 text-sm mt-2">{formik.errors.message}</div>
              ) : null}
            </div>
            <div className="w-full text-center">
            <ButtonComponent>
                Send Message
                </ButtonComponent>
            </div>
          </form>
        </div>
        <div className="order-1 md:order-none flex md:col-span-3 justify-center items-center w-full">
          <img
            src={"/assets/images/contactUs.svg"}
            alt="Logo"
            className="w-auto md:h-[28rem] h-[20rem]"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;
