"use client";
import React from "react";
import { Search, TrendingUp, Users, Hash } from "lucide-react";

const Right = () => {
  const suggestions = [
    {
      id: 1,
      username: "alex_tech",
      name: "Alex Johnson",
      avatar: "https://avatar.iran.liara.run/public",
    },
    {
      id: 2,
      username: "sarah_design",
      name: "Sarah Williams",
      avatar: "https://avatar.iran.liara.run/public/1",
    },
    {
      id: 3,
      username: "mike_dev",
      name: "Mike Chen",
      avatar: "https://avatar.iran.liara.run/public/2",
    },
  ];

  const trends = [
    {
      id: 1,
      hashtag: "#WebDevelopment",
      posts: "125K posts",
    },
    {
      id: 2,
      hashtag: "#ReactJS",
      posts: "98K posts",
    },
    {
      id: 3,
      hashtag: "#TypeScript",
      posts: "75K posts",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search SocialSync"
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Who to Follow */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Who to follow
        </h2>
        <div className="space-y-4">
          {suggestions.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
              <button className="bg-black text-white rounded-full px-4 py-1 text-sm hover:bg-gray-800">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trends */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Trends for you
        </h2>
        <div className="space-y-4">
          {trends.map((trend) => (
            <div key={trend.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Hash className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="font-semibold">{trend.hashtag}</h3>
                  <p className="text-sm text-gray-500">{trend.posts}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-sm text-gray-500 space-y-2">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Cookie Policy
          </a>
        </div>
        <p>© 2024 SocialSync</p>
      </div>
    </div>
  );
};

export default Right;
