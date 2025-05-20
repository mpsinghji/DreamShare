"use client";
import React, { useState, useEffect } from "react";
import {
  Image,
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
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
  likes: number;
  comments: number;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const authUser = useSelector((state: RootState) => state.auth.user);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/posts/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setPosts(data.data.posts.reverse()); // Correct property access
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePost = async () => {
    if (!caption || !imageFile) return alert("Add caption and image");
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", imageFile);

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
      if (res.ok) {
        setCaption("");
        setImageFile(null);
        fetchPosts(); // Refresh posts
      } else {
        alert(data.message || "Failed to create post");
      }
    } catch (err) {
      console.error("Post error:", err);
    } finally {
      setLoading(false);
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
              className="mt-4 rounded-lg w-full"
            />
          )}

          <div className="flex justify-between mt-4 pt-4 border-t">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
              <Heart className="h-5 w-5" />
              <span>{post.likes || 0}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments || 0}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
