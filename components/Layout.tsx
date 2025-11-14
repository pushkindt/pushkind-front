/**
 * @file Layout.tsx defines the page frame used throughout the storefront.
 */
import React from "react";

/**
 * Props for the shell layout component.
 */
interface LayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  overlays?: React.ReactNode;
}

/**
 * Lightweight layout wrapper that composes the header, main slot, and
 * optional overlay portal content.
 */
const Layout: React.FC<LayoutProps> = ({ header, children, overlays }) => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {header}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">{children}</main>
      {overlays}
    </div>
  );
};

export default Layout;
