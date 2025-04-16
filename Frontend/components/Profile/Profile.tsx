"use client";

import React from "react";
import { CiHeart } from "react-icons/ci";
import { FaComment } from "react-icons/fa";

const Profile = () => {
  const user = {
    name: "Mannan Puri",
    username: "mannan.codes",
    avatar:
      "https://media.licdn.com/dms/image/v2/D5603AQFqAg2SL-gGVA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1721972901147?e=2147483647&v=beta&t=-c9zzbdcMSkYJqyCcVfTErATyqJcz_s2Zbd5rZPTUXo",
    cover:
      "https://ichef.bbci.co.uk/ace/standard/3840/cpsprodpb/1d36/live/1304a800-365f-11ef-88f3-6b74aebc5fc9.jpg",
    bio: "Web Developer | React & Node | Dreamer",
    followers: 132,
    following: 87,
    posts: 24,
  };

  const posts = [
    {
      id: 1,
      content: "To Travel is to live! 🚀",
      image:
        "https://hips.hearstapps.com/hmg-prod/images/alpe-di-siusi-sunrise-with-sassolungo-or-langkofel-royalty-free-image-1623254127.jpg?crop=1xw:1xh;center,top&resize=980:*",
      timestamp: "2 hours ago",
    },
    {
      id: 2,
      content:
        "Just finished with the Spiderman No way Home ,An absolute thriller",
      image:
        "https://static1.srcdn.com/wordpress/wp-content/uploads/2022/01/Spider-Man-No-Way-Home-All-Three-Spider-Men-Together.jpg",
      timestamp: "1 day ago",
    },
    {
      id: 3,
      content: "What an absolute Knock,Absolute GOAT of the game",
      image:
        "https://cdn.britannica.com/48/252748-050-C514EFDB/Virat-Kohli-India-celebrates-50th-century-Cricket-November-15-2023.jpg",
      timestamp: "3 days ago",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      {/* Cover Section */}
      <div className="relative h-60 rounded-2xl overflow-hidden">
        <img
          src={user.cover}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute -bottom-12 left-6 flex items-center space-x-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-white drop-shadow">
              {user.name}
            </h2>
            <p className="text-gray-200">@{user.username}</p>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-2xl shadow-md mt-16 p-6">
        <p className="text-gray-700">{user.bio}</p>

        <div className="flex justify-between text-center mt-6">
          <div>
            <p className="text-lg font-bold">{user.posts}</p>
            <p className="text-sm text-gray-500">Posts</p>
          </div>
          <div>
            <p className="text-lg font-bold">{user.followers}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </div>
          <div>
            <p className="text-lg font-bold">{user.following}</p>
            <p className="text-sm text-gray-500">Following</p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Edit Profile
          </button>
          <button className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100 transition">
            Message
          </button>
        </div>
      </div>

      {/* Posts Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-6">Posts</h3>
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500">{post.timestamp}</p>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
