"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BASE_API_URL } from "@/server";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User, Mail, Lock, LogOut } from "lucide-react";
import Image from "next/image";

interface UserData {
  _id: string;
  username: string;
  email: string;
  name: string;
  profilePicture?: string;
  bio?: string;
  followers: number;
  following: number;
  posts: number;
}

const Settings: React.FC = () => {
  const router = useRouter();
  const authUser = useSelector((state: RootState) => state.auth.user);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/users/me`, {
        withCredentials: true,
      });
      if (response.data.status === "success") {
        setUserData(response.data.data.user);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${BASE_API_URL}/users/change-password`,
        {
          currentPassword,
          newPassword,
          newPasswordConfirm: confirmPassword
        },
        { withCredentials: true }
      );
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_API_URL}/auth/logout`, {}, { withCredentials: true });
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Account Settings</h1>
          <p className="text-blue-100">Manage your account settings and preferences</p>
        </div>

        <div className="p-6">
          {/* User Profile Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={userData?.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${userData?.username}`}
                    alt={userData?.username || "Profile"}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{userData?.name}</h3>
                  <p className="text-gray-500">@{userData?.username}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Account Details
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-medium">{userData?.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Username</label>
                <p className="font-medium">@{userData?.username}</p>
              </div>

            </div>
          </div>

          {/* Change Password Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
