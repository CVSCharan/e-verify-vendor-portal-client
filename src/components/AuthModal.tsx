"use client";
import React, { useEffect } from "react";
import { Modal, Backdrop, Fade } from "@mui/material";
import { useRouter } from "next/navigation";
import styles from "../styles/AdminAuthModal.module.css";
import { LoginModalProps } from "@/utils/types";
import { useVendor } from "@/context/VendorContext";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginModal: React.FC<LoginModalProps> = ({ authParams }) => {
  const vendorContext = useVendor();
  const router = useRouter();

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleGoToLogin();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const handleGoToLogin = () => {
    vendorContext.setShowModal(false); // Close modal on redirection
    router.push("/");
  };

  return (
    <Modal
      open={true}
      className={styles.modalMainContainer}
      aria-labelledby="login-auth-modal-title"
      aria-describedby="login-auth-modal-description"
      role="dialog"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={true}>
        <div
          className={styles.modalContainer}
          role="alertdialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div className={styles.iconContainer}>
            <LockOutlinedIcon className={styles.lockIcon} />
          </div>
          <h2 id="login-auth-modal-title" className={styles.heading}>
            Authentication Required
          </h2>
          <p id="login-auth-modal-description" className={styles.subHeading}>
            Please log in to access this page.
          </p>
          <button
            onClick={handleGoToLogin}
            className={styles.routeButton}
            aria-label={`Log in to ${authParams} portal`}
          >
            Log In
          </button>
        </div>
      </Fade>
    </Modal>
  );
};

export default LoginModal;
