import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Home from "./Pages/Home"; 
import Dashboard from "./Pages/Dashboard";
import Orders from "./Pages/Orders";
import Customers from "./Pages/Customers";
import Offers from "./Pages/Offers";
import Inventory from "./Pages/Inventory";
import Collections from "./Pages/Collections";
import ContextProvider from "./Context/ContextProvider"; // Import the single provider
import "./Styles/Layout.css"; 
import CreateListing from "./Pages/CreateListing";

const LayoutWrapper = ({ children }) => (
  <div className="layout">
    <Sidebar />
    <div className="content">
      <Topbar />
      <div className="container">{children}</div> 
    </div>
  </div>
);

const App = () => {
  return (
    <ContextProvider> {/* Wrap everything with ContextProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutWrapper><Home /></LayoutWrapper>} />
          <Route path="/dashboard" element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
          <Route path="/orders" element={<LayoutWrapper><Orders /></LayoutWrapper>} />
          <Route path="/collections" element={<LayoutWrapper><Collections /></LayoutWrapper>} />
          <Route path="/inventory" element={<LayoutWrapper><Inventory /></LayoutWrapper>} />
          <Route path="/createListing" element={<LayoutWrapper><CreateListing /></LayoutWrapper>} />
          <Route path="/createListing/:id" element={<LayoutWrapper><CreateListing /></LayoutWrapper>} />
          <Route path="/customers" element={<LayoutWrapper><Customers /></LayoutWrapper>} />
          <Route path="/offers" element={<LayoutWrapper><Offers /></LayoutWrapper>} />
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  );
};

export default App;
