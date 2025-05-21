"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import Image from "next/image";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { FaComment } from "react-icons/fa";
import { X, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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
    name: string;
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
}

const Explore = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const authUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/posts/all`, {
        withCredentials: true,
      });
      if (response.data.status === "success") {
        const shuffledPosts = response.data.data.posts.sort(
          () => Math.random() - 0.5
        );
        setPosts(shuffledPosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/posts/like-dislike/${postId}`, {}, {
        withCredentials: true,
      });
      
      if (response.data.status === "success") {
        // If we're in the modal view, update the selected post
        if (selectedPost && selectedPost._id === postId) {
          const updatedPost = await axios.get(`${BASE_API_URL}/posts/all`, {
            withCredentials: true,
          }).then(res => res.data.data.posts.find((p: Post) => p._id === postId));
          
          if (updatedPost) {
            setSelectedPost(updatedPost);
          }
        }
        
        // Refresh all posts
        fetchPosts();
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(
        `${BASE_API_URL}/posts/comment/${postId}`,
        { text: newComment },
        { withCredentials: true }
      );
      
      // Update the selected post's comments immediately
      if (selectedPost && response.data.status === "success") {
        const updatedPost = await axios.get(`${BASE_API_URL}/posts/all`, {
          withCredentials: true,
        }).then(res => res.data.data.posts.find((p: Post) => p._id === postId));
        
        if (updatedPost) {
          setSelectedPost(updatedPost);
        }
      }
      
      setNewComment("");
      fetchPosts(); // Refresh all posts
    } catch (error) {
      console.error("Error adding comment:", error);
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Explore</h1>
      
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map((post) => (
          post.image?.url && (
            <div 
              key={post._id} 
              className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
              onClick={() => setSelectedPost(post)}
            >
              <Image
                src={post.image.url}
                alt={post.caption}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={false}
              />
              <div className="absolute inset-0 bg-black/0 backdrop-blur-0 group-hover:bg-black/40 group-hover:backdrop-blur-[2px] transition-all duration-300 rounded-lg flex items-center justify-center">
                <div className="flex gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1">
                    <CiHeart size={24} />
                    <span>{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaComment size={20} />
                    <span>{post.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        ))}
      </div>

      {/* Detailed View Modal */}
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
            <div className="w-1/2 h-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
              <div className="relative w-full h-full">
                <Image
                  src={selectedPost.image?.url || ''}
                  alt="Post"
                  fill
                  className="object-contain rounded-l-2xl"
                />
              </div>
              {/* Like and Comment buttons */}
              <div className="absolute bottom-4 left-4 flex gap-4 z-20">
                <button
                  onClick={() => handleLike(selectedPost._id)}
                  className={`flex items-center gap-1 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors ${
                    selectedPost.likes?.includes(authUser?._id || '') ? 'text-red-500' : 'text-gray-700'
                  }`}
                >
                  <CiHeart size={24} />
                  <span>{selectedPost.likes?.length || 0}</span>
                </button>
                <div className="flex items-center gap-1 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-700">
                  <FaComment size={20} />
                  <span>{selectedPost.comments?.length || 0}</span>
                </div>
              </div>
            </div>
            
            {/* Right side - Comments with glass effect */}
            <div className="w-1/2 h-full flex flex-col bg-white/80 backdrop-blur-sm rounded-r-2xl">
              {/* Header with glass effect */}
              <div className="p-4 border-b border-gray-200/50 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10">
                    <Image
                      src={selectedPost.user.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${selectedPost.user.username}`}
                      alt={selectedPost.user.username || 'User'}
                      fill
                      className="rounded-full object-cover ring-2 ring-white/50"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://avatar.iran.liara.run/public/boy?username=${selectedPost.user.username}`;
                      }}
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">{selectedPost.user.username}</span>
                    <p className="text-sm text-gray-500">{selectedPost.caption}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
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
                            alt={comment.user.username || 'User'}
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
                      alt={authUser?.username || 'User'}
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
          <p className="text-gray-500 text-lg">No posts found</p>
        </div>
      )}
    </div>
  );
};

export default Explore; 