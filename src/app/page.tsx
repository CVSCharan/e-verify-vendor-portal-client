"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Footer from "@/sections/Footer";
import VendorVerifyComp from "@/components/VendorVerifyComp";
import Head from "next/head";
import { Vendors } from "@/utils/types";
import VendorNav from "@/sections/VendorNav";

const VendorPortalPage = () => {
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [vendors, setVendors] = useState<Vendors[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false); // Add state for the modal

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOrganization(event.target.value);
  };

  useEffect(() => {
    setSelectedOrganization("");
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/vendors`);
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }
        const data: Vendors[] = await response.json();
        setVendors(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Vendors | E-Verify Portal</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <main id="E-Verify Vendor Page">
          <VendorNav />
          <section className={styles.mainBody}>
            <div className={styles.landingSection}>
              <span className={styles.loader}></span>
            </div>
          </section>
          <Footer />
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error | E-Verify Portal</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <main id="E-Verify Vendor Page">
          <VendorNav />
          <section className={styles.mainBody}>
            <div className={styles.landingSection}>
              <p className={styles.error}>Server Error: {error}</p>
            </div>
          </section>
          <Footer />
        </main>
      </>
    );
  }

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Vendor E-Verify Portal",
    applicationCategory: "BusinessApplication",
    description:
      "Platform for verifying the authenticity of certificates issued by educational institutions",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: "Technotran Solutions",
    },
  };

  return (
    <>
      <Head>
        <title>Vendor E-Verify Portal | Certificate Verification System</title>
        <meta
          name="description"
          content="Verify the authenticity of certificates issued by educational institutions through Technotran Solutions' E-Verify Portal."
        />
        <meta
          name="keywords"
          content="certificate verification, e-verify, educational certificates, document verification, Technotran Solutions"
        />
        <meta
          property="og:title"
          content="Vendor E-Verify Portal | Certificate Verification System"
        />
        <meta
          property="og:description"
          content="Verify the authenticity of certificates issued by educational institutions through Technotran Solutions' E-Verify Portal."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Technotran E-Verify" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Vendor E-Verify Portal | Certificate Verification System"
        />
        <meta
          name="twitter:description"
          content="Verify the authenticity of certificates issued by educational institutions through Technotran Solutions' E-Verify Portal."
        />
        <link
          rel="canonical"
          href="https://e-verify.technotran.com/vendor-portal"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main
        id="E-Verify Vendor Portal"
        aria-label="Vendor E-Verify Portal"
        className={styles.responsiveMain}
      >
        <VendorNav />
        <section className={styles.mainBody}>
          <div className={styles.landingSection}>
            <div className={styles.welcomeSection}>
              <h1 className={styles.heading}>Vendor E-Verify Portal</h1>
              <p className={styles.welcomeText}>
                This platform is dedicated to verifying the authenticity of
                certificates issued by our organization.
              </p>
            </div>
            {/* Add Select Component */}
            <div className={styles.selectContainer}>
              <label htmlFor="vendor-options" className={styles.selectLabel}>
                Vendor Organization
              </label>
              <div className={styles.customSelectWrapper}>
                <select
                  id="vendor-options"
                  className={styles.customSelect}
                  value={selectedOrganization}
                  onChange={handleSelectChange}
                  aria-label="Select vendor organization"
                >
                  <option value="">Select an organization</option>
                  {vendors.map((vendor) => (
                    <option key={vendor._id} value={vendor.org}>
                      {vendor.org}
                    </option>
                  ))}
                </select>
                <div className={styles.selectIcon}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 10L12 15L17 10"
                      stroke="#4b0406"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {selectedOrganization && (
              <div className={styles.formContainer}>
                {/* Pass openModal and setOpenModal to VendorVerifyComp */}
                <VendorVerifyComp
                  org={selectedOrganization}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                />
              </div>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default VendorPortalPage;
