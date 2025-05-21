"use client";

import React, { useEffect, useState } from "react";
import { FaBell, FaCheckCircle } from "react-icons/fa";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow';
  message: string;
  createdAt: string;
  read: boolean;
  from: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  post?: {
    _id: string;
    image?: {
      url: string;
    };
  };
}

const Notification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/notifications`, {
        withCredentials: true,
      });
      console.log("Notifications response:", response.data);
      if (response.data.status === "success") {
        setNotifications(response.data.data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.patch(
        `${BASE_API_URL}/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👥';
      default:
        return '📢';
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
    <div className="max-w-2xl mx-auto px-4 py-8 font-sans">
      <div className="flex items-center gap-3 mb-6">
        <FaBell className="text-blue-600 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
      </div>

      <div className="flex flex-col gap-4">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((note) => (
            <div
              key={note._id}
              className={`flex justify-between items-center p-4 rounded-xl shadow-sm transition-all ${
                note.read
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-blue-50 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-10 h-10">
                  <Image
                    src={note.from.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${note.from.username}`}
                    alt={note.from.username}
                    fill
                    className="rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://avatar.iran.liara.run/public/boy?username=${note.from.username}`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{note.from.username}</span>
                    <span>{getNotificationIcon(note.type)}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{note.message}</p>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                  </span>
                </div>
                {note.post?.image && (
                  <div className="relative w-12 h-12">
                    <Image
                      src={note.post.image.url}
                      alt="Post thumbnail"
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="ml-4">
                {note.read ? (
                  <MdOutlineMarkEmailRead className="text-green-500 text-xl" />
                ) : (
                  <FaCheckCircle 
                    className="text-blue-500 text-xl cursor-pointer hover:scale-110 transition"
                    onClick={() => markAsRead(note._id)}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
