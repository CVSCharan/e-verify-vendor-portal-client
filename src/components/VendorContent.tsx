import { useVendor } from "@/context/VendorContext";
import Footer from "@/sections/Footer";
import { Certificate } from "@/utils/types";
import React, { useEffect, useState } from "react";
import styles from "../app/dashboard/page.module.css";
import Image from "next/image";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import VendorCertificatesTable from "./VendorCertificatesTable";
import Head from "next/head";

const VendorContent = () => {
  const { vendorUser } = useVendor();

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>("");

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Table",
    about: "Certificate Records",
    description: "List of certificates issued by the organization",
    isPartOf: {
      "@type": "WebApplication",
      name: "E-Verify Portal",
    },
  };

  const fetchCertificates = async () => {
    try {
      const encodedVendorOrg =
        vendorUser && encodeURIComponent(vendorUser.org.trim()); // 🔹 Encode the string

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/certificates/${encodedVendorOrg}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch certificates");
      }
      const data: Certificate[] = await response.json();
      setCertificates(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vendorUser && vendorUser.org) {
      fetchCertificates();
    }
  }, [vendorUser]); // ✅ Dependency ensures re-run when vendorUser changes

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Filter certificates based on search query and selected type
  const filteredCertificates = certificates.filter((certificate) =>
    certificate.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <main id="E-Verify Portal View Certificates" aria-busy="true">
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </Head>
        <section className={styles.mainBody}>
          <div className={styles.landingSection}>
            <span
              className={styles.loader}
              aria-label="Loading certificates"
            ></span>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  if (error) {
    return (
      <main id="E-Verify Portal View Certificates" aria-live="assertive">
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </Head>
        <section className={styles.mainBody}>
          <div className={styles.landingSection}>
            <p className={styles.error} role="alert">
              Server Error: {error}
            </p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <section
        className={styles.mainBody}
        aria-label="Certificate management section"
      >
        <div className={styles.landingSection}>
          <div className={styles.modernProfileCard}>
            <Image
              height={150}
              width={150}
              src={
                vendorUser?.orgPic ||
                "https://github.com/CVSCharan/Technotran_Assets/blob/main/Picture11.png?raw=true"
              }
              alt={vendorUser?.org || "Vendor Logo"}
              className={styles.modernLogoImg}
              priority
            />
            <h2 className={styles.modernUserName}>{vendorUser?.username}</h2>
          </div>
          <div className={styles.elegantSearchWrapper} role="search">
            <div className={styles.elegantSearchContainer}>
              <input
                type="text"
                placeholder="Search by Name"
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.elegantSearchInput}
                aria-label="Search certificates by name"
              />
              <div className={styles.searchControls}>
                {searchQuery ? (
                  <CancelOutlinedIcon
                    onClick={handleClearSearch}
                    className={styles.elegantClearIcon}
                    aria-label="clear search"
                    role="button"
                    tabIndex={0}
                  />
                ) : (
                  <div className={styles.searchIconContainer}>
                    <span className={styles.searchIconLine}></span>
                    <span className={styles.searchIconCircle}></span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <>
            {filteredCertificates.length === 0 ? (
              <div
                className={styles.noCertificatesContainer}
                aria-live="polite"
              >
                <div className={styles.noCertificatesIcon}>
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 5V19H5V5H19ZM21 3H3V21H21V3ZM17 17H7V16H17V17ZM17 15H7V14H17V15ZM17 12H7V7H17V12Z"
                      fill="#9e9e9e"
                    />
                  </svg>
                </div>
                <p className={styles.noCertificatesText}>
                  No certificates found
                </p>
                <p className={styles.noCertificatesSubtext}>
                  Try adjusting your search
                </p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <VendorCertificatesTable
                  certificates={filteredCertificates}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </div>
            )}
          </>
        </div>
      </section>
    </>
  );
};

export default VendorContent;
