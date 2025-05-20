"use client";

import React, { useState } from "react";
import { FaPhotoVideo } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";

interface CreatePostModalProps {
  closeModal: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ closeModal }) => {
  const [postText, setPostText] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const authUser = useSelector((state: RootState) => state.auth.user);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePost = async (): Promise<void> => {
    if (postText.trim() === "" && !imageFile) return;
    
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("caption", postText);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("http://localhost:8000/api/v1/posts/create-post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      setPostText("");
      setImageFile(null);
      setPreviewUrl(null);
      closeModal();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!authUser) return null;

  return (
    <div
      className="fixed inset-0 h-screen w-screen bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-6 rounded-2xl w-[90%] max-w-[500px] relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RxCrossCircled size={24} />
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div className="relative w-12 h-12">
            <Image
              src={authUser.profilePicture || `https://avatar.iran.liara.run/public/boy?username=${authUser.username}`}
              alt={authUser.username}
              fill
              className="rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://avatar.iran.liara.run/public/boy?username=${authUser.username}`;
              }}
            />
          </div>
          <div className="flex-1">
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-3 rounded-xl border border-gray-200 outline-none text-sm resize-none min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {previewUrl && (
              <div className="relative mt-3 rounded-xl overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={500}
                  height={300}
                  className="w-full h-auto object-cover"
                />
                <button
                  onClick={() => {
                    setImageFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70 transition-colors"
                >
                  <RxCrossCircled size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <label className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">
            <FaPhotoVideo size={20} />
            <span>Add Photo/Video</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePost}
            disabled={isLoading || (postText.trim() === "" && !imageFile)}
          >
            {isLoading ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal; 