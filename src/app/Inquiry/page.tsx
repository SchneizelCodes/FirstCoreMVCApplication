"use client";

import React from "react";
import MasterLayout from "@/components/MasterLayout";

export default function InquiryPage() {
  return (
    <MasterLayout pageTitle="Inquiry">
      <div>
        <h1 className="page-heading">Inquiry</h1>
        <p style={{ fontSize: "16px", lineHeight: "1.7", maxWidth: "620px" }}>
          Get in touch for project inquiries and collaborations.
        </p>
      </div>
    </MasterLayout>
  );
}
