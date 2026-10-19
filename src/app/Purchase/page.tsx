"use client";

import React from "react";
import MasterLayout from "@/components/MasterLayout";

export default function PurchasePage() {
  return (
    <MasterLayout pageTitle="Purchase">
      <div>
        <h1 className="page-heading">Purchase</h1>
        <p style={{ fontSize: "16px", lineHeight: "1.7", maxWidth: "620px" }}>
          Browse available design packages and services.
        </p>
      </div>
    </MasterLayout>
  );
}
