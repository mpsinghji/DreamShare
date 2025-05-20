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

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((store: RootState) => store.auth.user);


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



  


  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setError(null);
      // Use full API URL with correct path and port
      const res = await axios.get(
        `http://localhost:8000/api/v1/users/search?query=${query}`
      );
      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Search failed. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  

    return (
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="p-4 max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </form>

          {results.length > 0 ? (
            <ul className="space-y-3">
              {results.map((user) => (
                <li
                  key={user._id}
                  className="p-3 border rounded shadow flex items-center gap-3"
                >
                  <img
                    src={user.profilePicture || "/default-avatar.png"}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                    {/* <p className="text-sm text-gray-500">{user.email}</p> */}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            query && <p>No users found.</p>
          )}
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
                <div
                  key={user._id}
                  className="flex items-center justify-between"
                >
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