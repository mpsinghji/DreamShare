"use client";

import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaComment } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../utils/apiRequest";
import { RootState } from "@/store/store";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const authUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const getProfileReq = async () => {
      return await axios.get(`${BASE_API_URL}/users/me`, {
        withCredentials: true,
      });
    };

    const result = await handleAuthRequest(getProfileReq, setIsLoading);
    if (result) {
      setUser(result.data.data.user);
      // TODO: Fetch user posts here when the endpoint is available
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      {/* Cover Section */}
      <div className="relative h-60 rounded-2xl overflow-hidden">
        <img
          src={user.coverImage || "https://via.placeholder.com/1200x400"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Profile Info - Moved outside the cover section */}
      <div className="relative -mt-16 px-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {user.name}
            </h2>
            <p className="text-gray-600">@{user.username}</p>
          </div>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="bg-white rounded-2xl shadow-md mt-6 p-6">
        <p className="text-gray-700">{user.bio || "No bio yet"}</p>

        <div className="flex justify-between text-center mt-6">
          <div>
            <p className="text-lg font-bold">{posts.length}</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div>
            <p className="text-lg font-bold">{user.followers?.length || 0}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div>
            <p className="text-lg font-bold">{user.following?.length || 0}</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-6">Posts</h3>
        <div className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No posts yet</p>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={user.profilePicture || "https://via.placeholder.com/150"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-800 mb-3">{post.content}</p>

                {post.image && (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}

                <div className="flex gap-6 text-gray-600 mt-4 text-xl">
                  <button className="hover:text-red-500 transition">
                    <CiHeart />
                  </button>
                  <button className="hover:text-blue-500 transition">
                    <FaComment />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
