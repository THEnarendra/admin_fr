import React from "react";
import "../Styles/Layout.css";

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="topbar-title">Frame Rang</div>
      <div className="topbar-right">
        <input type="text" placeholder="Search..." className="search-box" />
        <img src="https://images.unsplash.com/photo-1739582814657-10931286d7a5?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="User" className="user-avatar" />
      </div>
    </div>
  );
};

export default Topbar;
