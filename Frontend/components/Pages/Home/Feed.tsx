"use client";
import React, { useState } from "react";
import { Image, MessageCircle, Heart, Share2, MoreHorizontal } from "lucide-react";

interface Post {
  id: number;
  username: string;
  userImage: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      username: "Mannan ",
      userImage: "https://avatar.iran.liara.run/public/17",
      content: "Aboslute Goat of the game,What a knock🔥 ",
      image: "https://cdn.britannica.com/48/252748-050-C514EFDB/Virat-Kohli-India-celebrates-50th-century-Cricket-November-15-2023.jpg",
      likes: 42,
      comments: 8,
      timeAgo: "2h",
    },
    {
      id: 2,
      username: "Diya",
      userImage: "https://avatar.iran.liara.run/public/65",
      content: "Check out this amazing sunset!",
      image: "https://miro.medium.com/v2/resize:fit:1400/1*tMKkGydXuiOBOb15srANvg@2x.jpeg",
      likes: 128,
      comments: 15,
      timeAgo: "4h",
    },
  ]);

  return (
    <div className="space-y-4">
      {/* Create Post */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-4">
          <img
            src="https://avatar.iran.liara.run/public/10"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <input
            type="text"
            placeholder="What's on your mind?"
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-between mt-4">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
            <Image className="h-5 w-5" />
            <span>Photo</span>
          </button>
          <button className="bg-blue-600 text-white rounded-full px-4 py-1 hover:bg-blue-700">
            Post
          </button>
        </div>
      </div>


      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm p-4">

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={post.userImage}
                alt={post.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold">{post.username}</h3>
                <p className="text-sm text-gray-500">{post.timeAgo}</p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

           <p className="mt-4">{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="mt-4 rounded-lg w-full"
            />
          )}


          <div className="flex justify-between mt-4 pt-4 border-t">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
              <Heart className="h-5 w-5" />
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments}</span>
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