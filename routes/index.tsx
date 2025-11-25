/**
 * @file routes/index.tsx defines the application's route map.
 */
import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App";

/** Router component that renders the storefront shell. */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/orders" element={<App />} />
      <Route path="/*" element={<App />} />
    </Routes>
  );
};

export default AppRoutes;
