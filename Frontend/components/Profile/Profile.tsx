"use client";

import React, { useEffect, useState } from "react";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { FaComment, FaEdit } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { handleAuthRequest } from "../utils/apiRequest";
import { RootState } from "@/store/store";
import Image from "next/image";
import EditProfileModal from "./EditProfileModal";

interface Post {
  _id: string;
  caption: string;
  image?: {
    url: string;
    public_id: string;
  };
  user: {
    _id: string;
    username: string;
    bio: string;
  };
  likes: string[];
  comments: any[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  followers: string[];
  following: string[];
}

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
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
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/posts/user-posts/${authUser?._id}`, {
        withCredentials: true,
      });
      setPosts(response.data.data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await axios.post(`${BASE_API_URL}/posts/like/${postId}`, {}, {
        withCredentials: true,
      });
      fetchUserPosts(); // Refresh to get updated likes
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isOwnProfile = authUser?._id === user._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="relative w-32 h-32">
            <Image
              src={user.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${user.username}`}
              alt={user.name}
              fill
              className="rounded-full object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://avatar.iran.liara.run/public/boy?username=${user.username}`;
              }}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">@{user.username}</p>
              </div>
              {isOwnProfile ? (
                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors">
                  <FaEdit />
                  <span onClick={() => setIsEditProfileModalOpen(true)}>Edit Profile</span>
                </button>
              ) : (
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Follow
                </button>
              )}
            </div>

            <p className="text-gray-700 mb-4">{user.bio || "No bio yet"}</p>

            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-semibold">{posts.length}</span>
                <span className="text-gray-600 ml-1">Posts</span>
              </div>
              <div>
                <span className="font-semibold">{user.followers?.length || 0}</span>
                <span className="text-gray-600 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-semibold">{user.following?.length || 0}</span>
                <span className="text-gray-600 ml-1">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-3 font-semibold ${
            activeTab === 'posts'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        {isOwnProfile && (
          <button
            className={`px-6 py-3 font-semibold ${
              activeTab === 'saved'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('saved')}
          >
            Saved
          </button>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {post.image?.url && (
              <div className="relative aspect-square">
                <Image
                  src={post.image.url}
                  alt="Post"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://avatar.iran.liara.run/public/boy?username=${user.username}`;
                  }}
                />
              </div>
            )}
            <div className="p-4">
              <p className="text-gray-800 mb-3 line-clamp-2">{post.caption}</p>
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                      post.likes?.includes(authUser?._id || '') ? 'text-red-500' : ''
                    }`}
                  >
                    <CiHeart size={20} />
                    <span>{post.likes?.length || 0}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                    <FaComment size={16} />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                </div>
                <button className="hover:text-blue-500 transition-colors">
                  <CiBookmark size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts yet</p>
        </div>
      )}
      <EditProfileModal
      isOpen={isEditProfileModalOpen}
      onClose={() => setIsEditProfileModalOpen(false)}
      user={user}
      onProfileUpdate={() => {
        fetchUserProfile();
        setIsEditProfileModalOpen(false);
      }}
    />
    </div>    
  );
};

export default Profile;
