"use client";
import React from "react";
import Link from "next/link";
import { Home, Search, Bell, Mail, Bookmark, User, Settings, LogOut } from "lucide-react";
import { useSelector } from "react-redux";
// import store from "@/store/store";

const Left = () => {
const user = useSelector((store) => store.auth.user);
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-0 h-screen ml-0 pl-1">
      <div className="flex flex-col space-y-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 mb-6">
          <span className="text-2xl font-bold text-blue-600">SocialSync</span>
        </Link>

        {/* Navigation Links */}
        <Link
          href="/"
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <Home className="h-6 w-6" />
          <span className="text-lg">Home</span>
        </Link>

        <Link
          href="/explore"
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <Search className="h-6 w-6" />
          <span className="text-lg">Explore</span>
        </Link>

        <Link
          href="/notifications"
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <Bell className="h-6 w-6" />
          <span className="text-lg">Notifications</span>
        </Link>

        <Link
          href="/messages"
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <Mail className="h-6 w-6" />
          <span className="text-lg">Messages</span>
        </Link>

        <Link
          href="/bookmarks"
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <Bookmark className="h-6 w-6" />
          <span className="text-lg">Bookmarks</span>
        </Link>

        <Link
          href={`/profile/${user?._id}`}
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <User className="h-6 w-6" />
          <span className="text-lg">Profile</span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <Settings className="h-6 w-6" />
          <span className="text-lg">Settings</span>
        </Link>

        {/* Post Button */}
        <button className="bg-blue-600 text-white rounded-full py-2 px-4 font-semibold hover:bg-blue-700 transition-colors">
          Post
        </button>

        {/* Logout Button */}
        <button className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 text-red-600">
          <LogOut className="h-6 w-6" />
          <span className="text-lg">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Left;
