"use client";

import React from "react";
import MasterLayout from "@/components/MasterLayout";

export default function AboutPage() {
  return (
    <MasterLayout pageTitle="About Page">
      <div>
        <h1 className="page-heading">About Page</h1>
        <p style={{ fontSize: "16px", lineHeight: "1.7", maxWidth: "620px" }}>
          This page uses the same master layout as the Home Page. The Website
          Header, Left Navigation Menus, and Website Footer stay constant while
          only this main content area changes.
        </p>
      </div>
    </MasterLayout>
  );
}
