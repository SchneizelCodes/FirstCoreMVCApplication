"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutLab, SiteTheme } from "@/context/LayoutLabContext";
import ThreeBackground from "./ThreeBackground";
import GlassMagnifierCursor from "./GlassMagnifierCursor";

interface MasterLayoutProps {
  pageTitle: string;
  children: React.ReactNode;
}

const MENU_LINKS = [
  { href: "/Dashboard", label: "Dashboard" },
  { href: "/", label: "Home" },
  { href: "/Home/About", label: "About" },
  { href: "/Inquiry", label: "Inquiry" },
  { href: "/Purchase", label: "Purchase" },
];

export default function MasterLayout({
  pageTitle,
  children,
}: MasterLayoutProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useLayoutLab();

  // Set Browser Tab Title ("Home Page", etc.)
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <div className="site-wrapper" data-theme={theme}>
      {/* Three.js Grainy Spotlight Background */}
      <ThreeBackground
        variant={theme === "emerald" ? "emerald" : "creative"}
        visible={theme !== "classic"}
      />

      {/* Circular Glass Magnifying & Blurring Cursor */}
      <GlassMagnifierCursor
        enabled={true}
        size={134}
        zoomStrength={36}
        blurAmount={1.15}
      />

      {/* Reusable Master Layout Shell */}
      <div className="master-shell">
        {/* 1. Header (Top): Centered "Website Header" */}
        <header className="header-cell">
          <div style={{ width: "160px", textAlign: "left", fontSize: "12px", opacity: 0.75 }}>
            CAMACHO & SUDARIO
          </div>

          <h3 className="header-title">HEADER</h3>

          {/* CSS Theme Switcher (Demonstrating Separation of Content and Styling) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              width: "160px",
              justifyContent: "flex-end",
            }}
          >
            {(
              [
                { id: "creative", label: "Glass" },
                { id: "classic", label: "Cyan" },
                { id: "emerald", label: "Emerald" },
              ] as { id: SiteTheme; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                style={{
                  padding: "4px 8px",
                  fontSize: "11px",
                  borderRadius: "6px",
                  border:
                    theme === t.id
                      ? "1px solid currentColor"
                      : "1px solid transparent",
                  backgroundColor:
                    theme === t.id
                      ? "rgba(255, 255, 255, 0.16)"
                      : "rgba(128, 128, 128, 0.15)",
                  color: "inherit",
                  cursor: "pointer",
                  fontWeight: theme === t.id ? 700 : 400,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </header>

        {/* Middle Section: Left Navigation Sidebar + Main Content Area */}
        <div className="middle-row">
          {/* 2. Left Navigation Sidebar (Left Column) */}
          <nav className="nav-cell" aria-label="Left Navigation Menus">
            <div>
              <h3 className="nav-heading">Left Navigation Menus</h3>
              <div className="nav-links">
                {MENU_LINKS.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href === "/" && pathname === "/Home/Index");

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={isActive ? "active-link" : ""}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* 3. Main Content Area (Center Right) */}
          <main className="main-cell">{children}</main>
        </div>

        {/* 4. Footer (Bottom): Centered small text "Website Footer" */}
        <footer className="footer-cell">
          <h3 className="footer-title">FOOTER</h3>
        </footer>
      </div>
    </div>
  );
}
