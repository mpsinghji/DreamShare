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
import { X, MessageCircle } from "lucide-react";

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
    profilePicture?: string;
  };
  likes: string[];
  comments: {
    _id: string;
    text: string;
    user: {
      username: string;
      profilePicture: string;
    };
    createdAt: string;
  }[];
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
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
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
      await axios.post(`${BASE_API_URL}/posts/like-dislike/${postId}`, {}, {
        withCredentials: true,
      });
      fetchUserPosts(); // Refresh to get updated likes
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId: string) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/posts/comment/${postId}`, {
        text: newComment,
      }, {
        withCredentials: true,
      });

      // Update the selected post's comments immediately
      if (selectedPost && response.data.status === "success") {
        const updatedPost = await axios.get(`${BASE_API_URL}/posts/user-posts/${authUser?._id}`, {
          withCredentials: true,
        }).then(res => res.data.data.posts.find((p: Post) => p._id === postId));
        
        if (updatedPost) {
          setSelectedPost(updatedPost);
        }
      }

      fetchUserPosts(); // Refresh to get updated comments
      setNewComment('');
    } catch (error) {
      console.error("Error commenting on post:", error);
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
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {post.image?.url && (
              <div 
                className="relative aspect-square cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
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
                  <button 
                    onClick={() => setSelectedPost(post)}
                    className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                  >
                    <FaComment size={16} />
                    <span>{post.comments?.length || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comments Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Enhanced backdrop with stronger blur */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-md transition-all duration-300"
            onClick={() => setSelectedPost(null)}
          />
          
          {/* Modal container with glass effect */}
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl w-11/12 max-w-5xl h-[85vh] flex shadow-2xl border border-white/20">
            {/* Left side - Image with gradient overlay */}
            <div className="w-1/2 h-full relative flex flex-col">
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <img
                  src={selectedPost.image?.url}
                  alt="Post"
                  className="w-full h-full object-contain rounded-l-2xl"
                />
              </div>
              <div className="p-4 bg-white/80 backdrop-blur-sm border-t">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="relative w-8 h-8">
                    {/* <Image
                      src={selectedPost.user.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${selectedPost.user.username}`}
                      alt={selectedPost.user.username}
                      fill
                      className="rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://avatar.iran.liara.run/public/boy?username=${selectedPost.user.username}`;
                      }}
                    /> */}
                  </div>
                  <span className="font-semibold text-gray-800">{selectedPost.user.username}</span>
                </div>
                <p className="text-gray-700">{selectedPost.caption}</p>
              </div>
            </div>
            
            {/* Right side - Comments with glass effect */}
            <div className="w-1/2 h-full flex flex-col bg-white/80 backdrop-blur-sm rounded-r-2xl">
              {/* Header with glass effect */}
              <div className="p-4 border-b border-gray-200/50 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Comments</h2>
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Comments list with custom scrollbar */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {selectedPost.comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageCircle className="h-12 w-12 mb-2 opacity-50" />
                    <p>No comments yet</p>
                    <p className="text-sm">Be the first to comment!</p>
                  </div>
                ) : (
                  selectedPost.comments.map((comment) => (
                    <div key={comment._id} className="group">
                      <div className="flex items-start space-x-3">
                        <div className="relative w-8 h-8">
                          <Image
                            src={comment.user.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${comment.user.username}`}
                            alt={comment.user.username}
                            fill
                            className="rounded-full object-cover ring-2 ring-white/50"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://avatar.iran.liara.run/public/boy?username=${comment.user.username}`;
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-3 shadow-sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-gray-800">{comment.user.username}</span>
                                <span className="text-xs text-gray-400">
                                  {comment.createdAt ? new Date(comment.createdAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true
                                  }) : new Date(selectedPost.createdAt).toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true
                                  })}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment input with glass effect */}
              <div className="p-4 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="relative w-8 h-8">
                    <Image
                      src={authUser?.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${authUser?.username}`}
                      alt={authUser?.username}
                      fill
                      className="rounded-full object-cover ring-2 ring-white/50"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://avatar.iran.liara.run/public/boy?username=${authUser?.username}`;
                      }}
                    />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                  <button
                    onClick={() => handleComment(selectedPost._id)}
                    disabled={!newComment.trim()}
                    className="text-blue-600 font-semibold px-4 py-2 rounded-full hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
      `}</style>

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
