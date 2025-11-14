import React from "react";
import { Routes, Route } from "react-router-dom";
import App, { AppContent } from "../App";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<AppContent />} />
        <Route path="categories/:categoryId" element={<AppContent />} />
        <Route path="tags/:tagId" element={<AppContent />} />
        <Route path="products/:productId" element={<AppContent />} />
        <Route path="*" element={<AppContent />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
