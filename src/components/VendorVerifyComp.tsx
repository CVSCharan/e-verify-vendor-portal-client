"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import styles from "../styles/VendorVerifyComp.module.css";
import Image from "next/image";
import { Vendors, VendorVerifyCompProps } from "@/utils/types";
import VendorLoginModal from "./VendorLoginModal"; // Import the modal component
import Head from "next/head";

const VendorVerifyComp: React.FC<VendorVerifyCompProps> = ({ org }) => {
  const [orgData, setOrgData] = useState<Vendors | null>(null); // Use Vendor type
  const [openModal, setOpenModal] = useState(false); // State to control modal visibility
  const [isLoading, setIsLoading] = useState(true);
  const [vendors, setVendors] = useState<Vendors[]>([]);
  const [dataFetched, setDataFetched] = useState(false);

  useLayoutEffect(() => {
    const fetchVendors = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/vendors`);
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }
        const data: Vendors[] = await response.json();
        console.log(data);
        setVendors(data);
        setDataFetched(true);
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log("An unknown error occurred");
        }
        setDataFetched(true); // Mark as fetched even on error to prevent loading indefinitely
      }
    };

    fetchVendors();
  }, []);

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: orgData?.name || "Vendor Organization",
    description: "Vendor login portal for certificate verification system",
    image: orgData?.orgPic || "",
    url: typeof window !== "undefined" ? window.location.href : "",
    potentialAction: {
      "@type": "LoginAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: typeof window !== "undefined" ? window.location.href : "",
      },
    },
  };

  useEffect(() => {
    // Only proceed if vendors data has been fetched
    if (!dataFetched || vendors.length === 0) {
      return;
    }

    setIsLoading(true);
    const selectedOrg = vendors.find(
      (client) => client.org.trim().toLowerCase() === org.trim().toLowerCase()
    );
    setOrgData(
      selectedOrg ? { ...selectedOrg, orgPic: selectedOrg.orgPic || "" } : null
    );

    // Add a small delay to show loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [org, vendors, dataFetched]); // Add vendors and dataFetched to dependencies

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
                src={orgData.orgPic}
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
                {orgData.org}
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
