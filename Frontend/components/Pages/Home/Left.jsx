"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Home, Search, Bell, Mail, Bookmark, User, Settings, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../../utils/apiRequest";
import { setAuthUser } from "@/store/authSlice";
import { toast } from "sonner";

const Left = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const user = useSelector((store) => store.auth.user);

  const handleLogout = async () => {
    const logoutReq = async () => {
      return await axios.post(`${BASE_API_URL}/users/logout`, {}, {
        withCredentials: true,
      });
    };

    const result = await handleAuthRequest(logoutReq, setIsLoading);
    if (result) {
      dispatch(setAuthUser(null));
      toast.success("Logged out successfully");
      router.push("/auth/login");
    }
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm p-4 sticky top-0 h-screen ml-0 pl-1 ${showLogoutConfirm ? 'blur-sm' : ''}`}>
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
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 text-red-600"
          >
            <LogOut className="h-6 w-6" />
            <span className="text-lg">Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Left;
