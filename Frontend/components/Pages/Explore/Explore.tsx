"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import Image from "next/image";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { FaComment } from "react-icons/fa";

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
  comments: any[];
  createdAt: string;
}

const Explore = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/posts/all`, {
        withCredentials: true,
      });
      if (response.data.status === "success") {
        setPosts(response.data.data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await axios.post(`${BASE_API_URL}/posts/like/${postId}`, {}, {
        withCredentials: true,
      });
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!newComment.trim()) return;
    try {
      await axios.post(
        `${BASE_API_URL}/posts/comment/${postId}`,
        { content: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      fetchPosts();
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
              {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <div className="flex gap-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-1">
                    <CiHeart size={20} />
                    <span>{post.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaComment size={16} />
                    <span>{post.comments?.length || 0}</span>
                  </div>
                </div>
              </div> */}
            </div>
          )
        ))}
      </div>

      {/* Detailed View Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-6xl h-[80vh] flex overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Left side - Image */}
            <div className="w-1/2 relative bg-gray-100 flex items-center justify-center">
              {selectedPost.image?.url && (
                <div className="relative w-full h-full">
                  <Image
                    src={selectedPost.image.url}
                    alt={selectedPost.caption}
                    fill
                    sizes="50vw"
                    className="object-contain"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Right side - Details and Comments */}
            <div className="w-1/2 flex flex-col border-l bg-white">
              {/* User info and caption */}
              <div className="p-4 border-b">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-10 h-10">
                    <Image
                      src={selectedPost.user.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${selectedPost.user.username}`}
                      alt={selectedPost.user.username}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedPost.user.username}</p>
                    <p className="text-sm text-gray-500">{selectedPost.user.name}</p>
                  </div>
                </div>
                <p className="text-gray-800">{selectedPost.caption}</p>
              </div>

              {/* Comments section */}
              <div className="flex-1 overflow-y-auto p-4">
                {selectedPost.comments.map((comment, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex items-start gap-3">
                      <div className="relative w-8 h-8">
                        <Image
                          src={comment.user.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${comment.user.username}`}
                          alt={comment.user.username}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{comment.user.username}</p>
                        <p className="text-gray-800">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions and comment input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => handleLike(selectedPost._id)}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <CiHeart size={24} />
                    <span>{selectedPost.likes?.length || 0}</span>
                  </button>
                  <button className="hover:text-blue-500 transition-colors">
                    <CiBookmark size={24} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleComment(selectedPost._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No posts found</p>
        </div>
      )}
    </div>
  );
};

export default Explore; 