"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Settings: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Replace with your API endpoint and payload
      await axios.put(
        "/api/v1/users/update-profile",
        { username, email },
        { withCredentials: true }
      );
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        "/api/v1/users/change-password",
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
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
      await axios.post("/api/v1/auth/logout", {}, { withCredentials: true });
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      toast.error("Failed to logout.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <h2 className="text-xl font-semibold">Update Profile</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Update Profile
        </button>
      </form>

      <form onSubmit={handleChangePassword} className="space-y-4">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Change Password
        </button>
      </form>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Settings;
