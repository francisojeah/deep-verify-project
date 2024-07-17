import { Modal } from "flowbite-react";

interface UserRegisterSuccessModalProps {
  openModal: boolean;
  setOpenModal: any;
  email: string;
}

const UserRegisterSuccessModal = ({
  openModal,
  setOpenModal,
  email,
}: UserRegisterSuccessModalProps) => {
  return (
    <>
      <Modal size={"lg"} dismissible show={openModal} onClose={setOpenModal}>
        <Modal.Header className="border-none pb-0"></Modal.Header>
        <Modal.Body className="pt-0">
          <div className="flex gap-2 items-center">
            <img src="/assets/icons/user-register-success-icon.svg" />
            <div className="flex flex-col gap-4">
              <p className="font-bold text-xl text-custom-primary">
                Verify Your Account
              </p>
              <p className="text-base text-black dark:text-white">
                We’ve sent an email to{" "}
                <span className="font-bold text-base">{email}</span>. Follow the
                steps provided in the email to verify your account.
              </p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserRegisterSuccessModal;
