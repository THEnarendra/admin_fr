import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import '../Styles/Layout.css';

const Sidebar = () => {
  const location = useLocation();


  return (
    <div className="sidebar">
  <div className="sidebar-logo">Your Logo</div>
  <ul className="sidebar-menu">
    <li>
      <NavLink to="/" exact activeClassName="active">Home</NavLink>
    </li>
    <li>
      <NavLink to="/dashboard" activeClassName="active">Dashboard</NavLink>
    </li>
    <li>
      <NavLink to="/inventory" activeClassName="active">Inventory</NavLink>
    </li>
    <li>
      <NavLink to="/collections" activeClassName="active">Collections</NavLink>
    </li>
    <li>
      <NavLink to="/orders" activeClassName="active">Orders</NavLink>
    </li>
    <li>
      <NavLink to="/customers" activeClassName="active">Customers</NavLink>
    </li>
    <li>
      <NavLink to="/offers" activeClassName="active">Offers</NavLink>
    </li>
  </ul>
</div>
  );
};

export default Sidebar;
