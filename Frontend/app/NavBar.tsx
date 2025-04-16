import React from "react";
import Image from "next/image";
import logo2 from "../public/images/Site_Logo.png";
import { FaSearch, FaBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const NavBar: React.FC = () => {
  return (
    <div className="flex justify-center">
      <div className="flex justify-evenly items-center p-5 bg-black w-[70%] h-20 mb-8 text-2xl text-white rounded-b-2xl">
        <Image 
          src={logo2} 
          alt="SocialSync Logo"
          width={40}
          height={40}
          className="object-contain"
        />
        <FaSearch className="cursor-pointer hover:text-gray-300 transition-colors" />
        <FaBell className="cursor-pointer hover:text-gray-300 transition-colors" />
        <CgProfile className="cursor-pointer hover:text-gray-300 transition-colors" />
      </div>
    </div>
  );
};

export default NavBar; 