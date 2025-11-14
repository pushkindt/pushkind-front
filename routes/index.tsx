import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "../App";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/categories/:categoryId" element={<App />} />
      <Route path="/tags/:tagId" element={<App />} />
      <Route path="/products/:productId" element={<App />} />
      <Route path="*" element={<App />} />
    </Routes>
  );
};

export default AppRoutes;
