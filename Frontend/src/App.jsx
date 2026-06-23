// import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProductPortal from "./pages/ProductPortal";
import Reports from "./pages/Reports";
import AllProducts from "./pages/AllProducts";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/productPortal" element={<ProductPortal />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/allProducts" element={<AllProducts />} />
    </Routes>
  );
};

export default App;