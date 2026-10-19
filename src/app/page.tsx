"use client";

import React from "react";
import MasterLayout from "@/components/MasterLayout";
import { useLayoutLab } from "@/context/LayoutLabContext";

export default function HomePage() {
  const { theme } = useLayoutLab();

  return (
    <MasterLayout pageTitle="Home Page">
      <div>
        <h1 className="page-heading">Home Page</h1>

        {theme !== "classic" && (
          <div style={{ marginTop: "18px", userSelect: "none" }}>
            <div
              className="editorial-hero-title"
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              <span>Creative</span>
              <span
                className="editorial-serif-accent"
                style={{
                  fontSize: "clamp(2.5rem, 5.2vw, 4.8rem)",
                  paddingRight: "6%",
                }}
              >
                visual
              </span>
            </div>

            <div
              className="editorial-hero-title"
              style={{
                textAlign: "right",
                marginTop: "4px",
                paddingRight: "2%",
              }}
            >
              designer
            </div>
          </div>
        )}
      </div>

      {theme !== "classic" && (
        <div
          style={{
            display: "flex",
            gap: "56px",
            fontSize: "11.5px",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginTop: "32px",
            opacity: 0.85,
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>
              WEB &amp; MOBILE / UX&amp;UI / BRANDING
            </div>
            <div style={{ opacity: 0.72, marginTop: "6px" }}>
              CURRENTLY AVAILABLE FOR FREELANCE WORLDWIDE
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>QUEZON CITY UNIVERSITY</div>
            <div style={{ opacity: 0.72, marginTop: "6px" }}>
              SBIT-3F
            </div>
          </div>
        </div>
      )}
    </MasterLayout>
  );
}
