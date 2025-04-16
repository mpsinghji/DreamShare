"use client";

import React from "react";
import { FaBell, FaCheckCircle } from "react-icons/fa";
import { MdOutlineMarkEmailRead } from "react-icons/md";

const notifications = [
  {
    id: 1,
    message: "John Cena liked your post.",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    message: "You have a new follower: Jaspreet.",
    timestamp: "5 hours ago",
    read: true,
  },
  {
    id: 3,
    message: "Your profile was viewed 10 times today.",
    timestamp: "1 day ago",
    read: false,
  },
  {
    id: 4,
    message: "Mikasa commented on your photo.",
    timestamp: "2 days ago",
    read: true,
  },
];

const Notification = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 font-sans">
      <div className="flex items-center gap-3 mb-6">
        <FaBell className="text-blue-600 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
      </div>

      <div className="flex flex-col gap-4">
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`flex justify-between items-center p-4 rounded-xl shadow-sm transition-all ${
              note.read
                ? "bg-gray-50 hover:bg-gray-100"
                : "bg-blue-50 border border-blue-200 hover:bg-blue-100"
            }`}
          >
            <div>
              <p className="text-gray-800">{note.message}</p>
              <span className="text-xs text-gray-500">{note.timestamp}</span>
            </div>
            <div>
              {note.read ? (
                <MdOutlineMarkEmailRead className="text-green-500 text-xl" />
              ) : (
                <FaCheckCircle className="text-blue-500 text-xl cursor-pointer hover:scale-110 transition" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
