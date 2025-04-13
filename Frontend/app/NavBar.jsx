import React from "react";
import logo2 from "../public/images/Site_Logo.png";
import { FaSearch } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const NavBar = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          padding: "20px",
          background: "black",
          width: "70%",
            height:'5pc',
          marginBottom: "2pc",
          fontSize: "2pc",
          color: "white",
          borderBottomRightRadius: "20px",
          borderBottomLeftRadius: "20px",
        }}
      >
        <img src={logo2} />
        <FaSearch style={{}} />
        <FaBell />
        <CgProfile />
      </div>
    </div>
  );
};

export default NavBar;
