"use client";

import { useState, useEffect } from "react";
import styles from "../styles/VendorVerifyComp.module.css";
import { vendorsData } from "@/utils/helper";
import Image from "next/image";
import { Vendor, VendorVerifyCompProps } from "@/utils/types";
import VendorLoginModal from "./VendorLoginModal"; // Import the modal component
import Head from "next/head";

const VendorVerifyComp: React.FC<VendorVerifyCompProps> = ({ org }) => {
  const [orgData, setOrgData] = useState<Vendor | null>(null); // Use Vendor type
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const [isLoading, setIsLoading] = useState(true);

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": orgData?.name || "Vendor Organization",
    "description": "Vendor login portal for certificate verification system",
    "image": orgData?.imgSrc || "",
    "url": typeof window !== "undefined" ? window.location.href : "",
    "potentialAction": {
      "@type": "LoginAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": typeof window !== "undefined" ? window.location.href : ""
      }
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const selectedOrg = vendorsData.find(
      (client) => client.name.trim().toLowerCase() === org.trim().toLowerCase()
    );
    setOrgData(selectedOrg ? selectedOrg : null); // Handle undefined case
    
    // Add a small delay to show loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [org]); // Re-run the effect whenever org changes

  const handleLoginClick = () => {
    setOpenModal(true); // Open the modal when the login button is clicked
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading...</p>
        </div>
      ) : orgData ? (
        <div 
          className={styles.vendorCard}
          itemScope
          itemType="https://schema.org/Organization"
        >
          <div className={styles.cardContent}>
            <div className={styles.imageWrapper}>
              <Image
                height={80}
                width={80}
                src={orgData.imgSrc}
                alt={orgData.name}
                className={styles.vendorLogo}
                priority
                itemProp="image"
              />
            </div>
            
            <div className={styles.vendorInfo}>
              <h2 
                className={styles.vendorName}
                itemProp="name"
                id="vendor-organization-heading"
              >
                {orgData.name}
              </h2>
              
              <button 
                className={styles.loginButton} 
                onClick={handleLoginClick}
                aria-label={`Login to ${orgData.name}`}
                aria-describedby="vendor-organization-heading"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.errorContainer}>
          <p>Organization not found.</p>
        </div>
      )}

      {/* Vendor Login modal */}
      <VendorLoginModal
        open={openModal}
        setOpen={setOpenModal}
        orgData={orgData}
      />
    </>
  );
};

export default VendorVerifyComp;
