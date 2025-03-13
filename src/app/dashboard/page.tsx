"use client";

import React, { useEffect, useState } from "react";
import { useVendor } from "@/context/VendorContext";
import VendorNav from "@/sections/VendorNav";
import Footer from "@/sections/Footer";
import LoginModal from "@/components/AuthModal";
import VendorContent from "@/components/VendorContent";
import Head from "next/head";
import styles from "./page.module.css";

const VendorDashboardPage = () => {
  const { vendorUser, showModal } = useVendor();
  const [isLoading, setIsLoading] = useState(true);

  // Set page title dynamically and handle loading state
  useEffect(() => {
    document.title = "Vendor Dashboard | E-Verify Portal";
    
    // Simulate loading for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Vendor Dashboard | E-Verify Portal | Technotran Solutions</title>
        <meta
          name="description"
          content="Vendor dashboard for managing certificates and verification requests in the E-Verify Portal system."
        />
        <meta
          name="keywords"
          content="vendor dashboard, certificate management, e-verify portal, document verification, technotran solutions"
        />
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="canonical"
          href="https://e-verify-portal.com/vendor-dashboard"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main id="E-Verify Portal Vendor Dashboard" className={styles.dashboardMain}>
        {/* Show the LoginModal if user is not authenticated */}
        {!vendorUser && showModal && <LoginModal authParams="Vendor" />}

        <VendorNav />

        <div className={styles.contentWrapper}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading dashboard...</p>
            </div>
          ) : (
            <VendorContent />
          )}
        </div>

        <Footer />
      </main>
    </>
  );
};

export default VendorDashboardPage;
