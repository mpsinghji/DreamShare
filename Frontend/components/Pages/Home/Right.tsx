"use client";
import React, { useState, useEffect } from "react";
import { Search, TrendingUp, Users, Hash } from "lucide-react";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";

interface UserSuggestion {
  _id: string;
  username: string;
  name: string;
  profilePicture?: string;
  isFollowing: boolean;
}

interface Trend {
  id: number;
  hashtag: string;
  posts: string;
}

const Right: React.FC = () => {
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const user = useSelector((store: RootState) => store.auth.user);
const toggleFollow = async (userId: string, isCurrentlyFollowing: boolean) => {
  try {
    // Optimistic UI update
    setSuggestions((prev) =>
      prev.map((user) =>
        user._id === userId
          ? { ...user, isFollowing: !isCurrentlyFollowing }
          : user
      )
    );

    const url = `${BASE_API_URL}/users/${
      isCurrentlyFollowing ? "unfollow" : "follow"
    }/${userId}`;
    await axios.post(url, {}, { withCredentials: true });

    toast.success(
      isCurrentlyFollowing ? "Unfollowed successfully" : "Followed successfully"
    );
  } catch (error: any) {
    // Revert optimistic update in case of error
    setSuggestions((prev) =>
      prev.map((user) =>
        user._id === userId
          ? { ...user, isFollowing: isCurrentlyFollowing }
          : user
      )
    );
    toast.error(
      error.response?.data?.message || "Failed to update follow status"
    );
  }
};

  const trends: Trend[] = [
    {
      id: 1,
      hashtag: "#IPL",
      posts: "125K posts",
    },
    {
      id: 2,
      hashtag: "#Election",
      posts: "98K posts",
    },
    {
      id: 3,
      hashtag: "#Jobs",
      posts: "75K posts",
    },
  ];

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_API_URL}/users/suggested-users`, {
        withCredentials: true,
      });
      // Take only first 3 suggestions
      setSuggestions(response.data.data.slice(0, 3));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      setIsLoading(true);
      await axios.post(
        `${BASE_API_URL}/users/follow/${userId}`,
        {},
        { withCredentials: true }
      );
      setSuggestions((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isFollowing: true } : user
        )
      );
      toast.success("Followed successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to follow user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      setIsLoading(true);
      await axios.post(
        `${BASE_API_URL}/users/unfollow/${userId}`,
        {},
        { withCredentials: true }
      );
      setSuggestions((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, isFollowing: false } : user
        )
      );
      toast.success("Unfollowed successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to unfollow user");
    } finally {
      setIsLoading(false);
    }
  };

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
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      user.profilePicture ||
                      "https://avatar.iran.liara.run/public"
                    }
                    alt={user.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(user._id, user.isFollowing)}
                  disabled={isLoading}
                  className={`rounded-full px-4 py-1 text-sm transition-colors ${
                    user.isFollowing
                      ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {user.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              No suggestions available
            </p>
          )}
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