"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Search, TrendingUp, Users, Hash, X } from "lucide-react";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import Image from "next/image";
import debounce from "lodash/debounce";

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
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((store: RootState) => store.auth.user);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        setError(null);
        const res = await axios.get(
          `http://localhost:8000/api/v1/users/search?query=${searchQuery}`
        );
        setResults(res.data);
      } catch (err) {
        console.error("Search failed:", err);
        setError("Search failed. Please try again.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // Update search results when query changes
  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  const toggleFollow = async (
    userId: string,
    isCurrentlyFollowing: boolean
  ) => {
    try {
      // Optimistic UI update: toggle follow state immediately
      setSuggestions((prev) =>
        prev.map((user) =>
          user._id === userId
            ? { ...user, isFollowing: !isCurrentlyFollowing }
            : user
        )
      );

      // Call backend API for follow/unfollow
      await axios.post(
        `${BASE_API_URL}/users/follow-unfollow/${userId}`,
        {},
        { withCredentials: true }
      );

      toast.success(
        isCurrentlyFollowing
          ? "Unfollowed successfully"
          : "Followed successfully"
      );
    } catch (error: any) {
      // Revert optimistic update on failure
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
      const response = await axios.get(
        `${BASE_API_URL}/users/suggested-users`,
        {
          withCredentials: true,
        }
      );
      // Take only first 3 suggestions
      setSuggestions(response.data.data.slice(0, 3));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch suggestions"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar Trigger */}
      <div className="relative">
        <button
          onClick={() => setShowSearchModal(true)}
          className="w-full flex items-center space-x-2 p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Search className="h-5 w-5 text-gray-500" />
          <span className="text-gray-500">Search users...</span>
        </button>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4 shadow-xl">
            {/* Search Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Search Users</h2>
                <button
                  onClick={() => {
                    setShowSearchModal(false);
                    setQuery("");
                    setResults([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by username or name..."
                  className="w-full p-3 pl-12 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="p-4 text-red-500 text-center">{error}</div>
              ) : results.length > 0 ? (
                <div className="divide-y">
                  {results.map((user) => (
                    <div
                      key={user._id}
                      className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12">
                          <Image
                            src={user.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${user.username}`}
                            alt={user.username}
                            fill
                            className="rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://avatar.iran.liara.run/public/boy?username=${user.username}`;
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-gray-600">@{user.username}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : query ? (
                <div className="p-8 text-center text-gray-500">
                  No users found for "{query}"
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Start typing to search users
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
              <div
                key={user._id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      user.profilePicture ||
                      `https://avatar.iran.liara.run/public/boy?username=${user.username}`
                    }
                    alt={user.username}
                    className="w-10 h-10 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://avatar.iran.liara.run/public/boy?username=${user.username}`;
                    }}
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