"use client";
import React, { useState, useEffect } from "react";
import {
  Image,
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Post {
  _id: string;
  caption: string;
  image?: {
    url: string;
  };
  user: {
    username: string;
    profilePicture: string;
  };
  createdAt: string;
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
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const authUser = useSelector((state: RootState) => state.auth.user);
  
  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/posts/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      const posts = data.data.posts;

      if (posts.length > 1) {
        // Step 1: Sort by createdAt descending (newest first)
        const sortedPosts = [...posts].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Step 2: Extract the newest post
        const [latestPost, ...otherPosts] = sortedPosts;

        // Step 3: Shuffle the rest
        const shuffledPosts = otherPosts.sort(() => Math.random() - 0.5);

        // Step 4: Combine and update state
        setPosts([latestPost, ...shuffledPosts]);
      } else {
        setPosts(posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  
  
  
  useEffect(() => {
    fetchPosts();
  }, []);

  // Add this useEffect to monitor state changes
  useEffect(() => {
    console.log("Image Preview State:", imagePreview);
    console.log("Image File State:", imageFile);
  }, [imagePreview, imageFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("File selected:", file);
      
      // Create preview URL first
      const previewUrl = URL.createObjectURL(file);
      console.log("Preview URL created:", previewUrl);
      
      // Update states
      setImagePreview(previewUrl);
      setImageFile(file);
    }
  };
  
  useEffect(() => {
    return () => {
      // Cleanup preview URL when component unmounts
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handlePost = async () => {
    console.log("Post button clicked");
    if (!caption || !imageFile) {
      alert("Add caption and image");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", imageFile);
    console.log("FormData prepared:", formData);
    console.log("Token from localStorage:", localStorage.getItem("token"));

    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:8000/api/v1/posts/create-post",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Response from server:", data);
      console.log(caption);

      if (res.ok) {
        setCaption("");
        setImageFile(null);
        setImagePreview(null); // Clear preview after successful post
        fetchPosts();
      } else {
        alert(data.message || "Failed to create post");
      }
    } catch (err) {
      console.error("Post error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/posts/like-dislike/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (res.ok) {
        fetchPosts(); // Refresh posts to get updated likes
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!newComment.trim()) return;
    
    try {
      const res = await fetch(`http://localhost:8000/api/v1/posts/comment/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (res.ok) {
        setNewComment("");
        // Refresh the selected post to get updated comments
        const updatedPost = await fetch(`http://localhost:8000/api/v1/posts/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).then(res => res.json())
          .then(data => data.data.posts.find((p: Post) => p._id === postId));
        
        if (updatedPost) {
          setSelectedPost(updatedPost);
        }
        fetchPosts(); // Refresh all posts
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Create Post */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <img
            src={authUser?.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${authUser?.username}`}
            alt="Profile"
            className="w-10 h-10 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://avatar.iran.liara.run/public/boy?username=${authUser?.username}`;
            }}
          />
          <input
            type="text"
            placeholder="What's on your mind?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4 relative border rounded-lg overflow-hidden">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-96 w-full object-contain"
              onError={(e) => {
                console.error("Error loading preview image:", e);
                const target = e.target as HTMLImageElement;
                target.src = "";
              }}
            />
            <button
              onClick={() => {
                if (imagePreview) {
                  URL.revokeObjectURL(imagePreview);
                }
                setImagePreview(null);
                setImageFile(null);
              }}
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 cursor-pointer">
            <Image className="h-5 w-5" />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <button
            onClick={handlePost}
            disabled={loading}
            className="bg-blue-600 text-white rounded-full px-4 py-1 hover:bg-blue-700"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* Posts List */}
      {posts.map((post) => (
        <div key={post._id} className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={post.user?.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${post.user?.username}`}
                alt={post.user?.username}
                className="w-10 h-10 rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://avatar.iran.liara.run/public/boy?username=${post.user?.username}`;
                }}
              />
              <div>
                <h3 className="font-semibold">{post.user?.username}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-4">{post.caption}</p>
          {post.image?.url && (
            <img
              src={post.image.url}
              alt="Post"
              className="mt-4 rounded-lg w-full h-auto max-h-[600px] object-contain"
            />
          )}

          <div className="flex justify-between mt-4 pt-4 border-t">
            <button 
              onClick={() => handleLike(post._id)}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600"
            >
              <Heart 
                className={`h-5 w-5 ${post.likes.includes(authUser?._id || '') ? 'fill-red-600 text-red-600' : ''}`} 
              />
              <span>{post.likes.length || 0}</span>
            </button>
            <button 
              onClick={() => setSelectedPost(post)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments.length || 0}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      ))}

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
            <div className="w-1/2 h-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
              <img
                src={selectedPost.image?.url}
                alt="Post"
                className="w-full h-full object-contain rounded-l-2xl"
              />
            </div>
            
            {/* Right side - Comments with glass effect */}
            <div className="w-1/2 h-full flex flex-col bg-white/80 backdrop-blur-sm rounded-r-2xl">
              {/* Header with glass effect */}
              <div className="p-4 border-b border-gray-200/50 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedPost.user.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${selectedPost.user.username}`}
                    alt={selectedPost.user.username}
                    className="w-10 h-10 rounded-full ring-2 ring-white/50"
                  />
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
                        <img
                          src={comment.user.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${comment.user.username}`}
                          alt={comment.user.username}
                          className="w-8 h-8 rounded-full ring-2 ring-white/50"
                        />
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
                  <img
                    src={authUser?.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${authUser?.username}`}
                    alt={authUser?.username}
                    className="w-8 h-8 rounded-full ring-2 ring-white/50"
                  />
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
    </div>
  );
};

export default Feed;
