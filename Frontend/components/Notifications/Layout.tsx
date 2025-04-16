"use client";
import React from "react";
import Left from "../Pages/Home/Left";
import Notification from "./Notification";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4 py-6">
          {/* Left Sidebar - Navigation */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Left />
          </div>

          {/* Main Feed */}
          <div className="col-span-12 md:col-span-10 lg:col-span-10">
            <Notification/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
