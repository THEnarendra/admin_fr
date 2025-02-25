import React from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Outlet } from "react-router-dom"; // Ensures child routes are rendered
import "./styles/Layout.css"; 

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Topbar />
        <div className="container">
          <Outlet /> {/* This ensures pages are rendered */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
