import React, { useState } from "react";
import { Link, useLocation  } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaMusic, FaCog } from "react-icons/fa";

import "../style/sidebar.scss";

const SideBar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();


    const menuItems = [
        { path: "/dashboard", openText: "대시보드",icon: <FaTachometerAlt /> },
        { path: "/user", openText: "사용자 관리", icon: <FaUsers /> },
        { path: "/musicController/music", openText: "음원 관리", icon: <FaMusic /> },

    ];





    return (
        <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
            <button className="toggleSidebarBtn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? "◀" : "▶"} 
            </button>
            <h2 className="logo">{sidebarOpen ? "Dive Admin" : "DA"}</h2>
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index} className={location.pathname === item.path ? "active" : ""}>
                        <Link to={item.path}>{sidebarOpen ? item.openText : item.icon}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SideBar
