"use client";

import React from "react";
import MasterLayout from "@/components/MasterLayout";

export default function DashboardPage() {
  return (
    <MasterLayout pageTitle="Dashboard">
      <div>
        <h1 className="page-heading">Dashboard</h1>
        <p style={{ fontSize: "16px", lineHeight: "1.7", maxWidth: "620px" }}>
          Welcome to the Dashboard section, loaded dynamically inside the main
          content area of the shared layout.
        </p>
      </div>
    </MasterLayout>
  );
}
