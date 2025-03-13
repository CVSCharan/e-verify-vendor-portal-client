import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { VendorLoginModalProps } from "@/utils/types";
import styles from "../styles/VendorLoginModal.module.css";
import Image from "next/image";
import { useVendor } from "@/context/VendorContext";
import { useRouter } from "next/navigation";
import ForgotPasswordModal from "./ForgotPasswordModal";
import Head from "next/head";

export default function VendorLoginModal({
  open,
  setOpen,
  orgData,
}: VendorLoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleClose = () => setOpen(false);
  const { login } = useVendor();

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Vendor Login",
    description: "Login portal for vendors in the E-Verify system",
  };

  const handleForgotPasswordClick = () => {
    setOpen(false);
    setForgotPasswordOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Example validation
    if (!username || !password) {
      setError("Please enter username & password to Log In");
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/vendors/login/${orgData?.name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data);
        setMessage(data.message);
        setError(null);
        router.push(`/dashboard`);
      } else {
        setMessage(null);
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="vendor-login-title"
        aria-describedby="vendor-login-description"
        className={styles.modalMainContainer}
      >
        <div className={styles.modalContainer}>
          <div className={styles.modalHeader}>
            {orgData && (
              <>
                <h2 id="vendor-login-title" className={styles.formHeading}>
                  {orgData.name}
                </h2>
                <div className={styles.imageContainer}>
                  <Image
                    src={orgData.imgSrc}
                    alt={orgData.name}
                    height={150}
                    width={150}
                    className={styles.formImg}
                    priority
                  />
                </div>
              </>
            )}
          </div>

          <div className={styles.modalBody}>
            <form
              className={styles.formContainer}
              onSubmit={handleSubmit}
              id="vendor-login-description"
            >
              <div className={styles.inputGroup}>
                <input
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.formInput}
                  aria-label="Username"
                  name="username"
                  autoComplete="username"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.formInput}
                  aria-label="Password"
                  name="password"
                  autoComplete="current-password"
                />
              </div>

              <div className={styles.forgotPasswordContainer}>
                <button
                  type="button"
                  className={styles.forgotPassword}
                  onClick={handleForgotPasswordClick}
                  aria-label="Forgot Password"
                >
                  Forgot Password?
                </button>
              </div>

              <div className={styles.buttonContainer}>
                <button
                  className={styles.formButton}
                  type="submit"
                  aria-label="Log In"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className={styles.loadingSpinner}></span>
                  ) : (
                    "Log In"
                  )}
                </button>
              </div>

              {error && (
                <div className={styles.errorContainer}>
                  <p className={styles.formMsg} role="alert">
                    {error}
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </Modal>
      
      <ForgotPasswordModal
        target="Vendor"
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </>
  );
}
