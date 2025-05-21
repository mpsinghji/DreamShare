"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import { BASE_API_URL } from "@/server";
import Image from "next/image";
import { Send, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface User {
  _id: string;
  username: string;
  name: string;
  profilePicture?: string;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    name: string;
    profilePicture?: string;
  };
  receiver: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface Chat {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const authUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/messages/chats`, {
        withCredentials: true,
      });
      if (response.data.status === "success") {
        setChats(response.data.data.chats);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast.error("Failed to fetch chats");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/messages/${chatId}`, {
        withCredentials: true,
      });
      if (response.data.status === "success") {
        setMessages(response.data.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await axios.post(
        `${BASE_API_URL}/messages/send`,
        {
          receiverId: selectedChat.participants.find(p => p._id !== authUser?._id)?._id,
          content: newMessage,
        },
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        setMessages(prev => [...prev, response.data.data.message]);
        setNewMessage("");
        fetchChats(); // Refresh chat list to update last message
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      try {
        const response = await axios.get(`${BASE_API_URL}/users/search?query=${query}`, {
          withCredentials: true,
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const startNewChat = async (userId: string) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/messages/start-chat`,
        { userId },
        { withCredentials: true }
      );
      if (response.data.status === "success") {
        setSelectedChat(response.data.data.chat);
        setSearchQuery("");
        setSearchResults([]);
        fetchChats();
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Failed to start chat");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find(p => p._id !== authUser?._id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Chat List */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="border-b">
            {searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => startNewChat(user._id)}
                className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="relative w-10 h-10">
                  <Image
                    src={user.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${user.username}`}
                    alt={user.username}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat List */}
        <div className="overflow-y-auto h-[calc(100vh-8rem)]">
          {chats.map((chat) => {
            const otherUser = getOtherParticipant(chat);
            return (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedChat?._id === chat._id ? "bg-blue-50" : ""
                }`}
              >
                <div className="relative w-12 h-12">
                  <Image
                    src={otherUser?.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${otherUser?.username}`}
                    alt={otherUser?.username || ""}
                    fill
                    className="rounded-full object-cover"
                  />
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium truncate">{otherUser?.name}</p>
                    {chat.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(chat.lastMessage.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage?.content || "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src={getOtherParticipant(selectedChat)?.profilePicture || 
                    `https://avatar.iran.liara.run/public/boy?username=${getOtherParticipant(selectedChat)?.username}`}
                  alt={getOtherParticipant(selectedChat)?.username || ""}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{getOtherParticipant(selectedChat)?.name}</p>
                <p className="text-sm text-gray-500">
                  @{getOtherParticipant(selectedChat)?.username}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.sender._id === authUser?._id;
                return (
                  <div
                    key={message._id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isOwnMessage
                          ? "bg-blue-500 text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="break-words">{message.content}</p>
                      <p className={`text-xs mt-1 ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages; 