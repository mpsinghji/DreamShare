"use client";

import React, { useState } from "react";
import { FaPhotoVideo, FaUserCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

interface CreatePostModalProps {
  closeModal: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ closeModal }) => {
  const [postText, setPostText] = useState<string>("");

  const handlePost = (): void => {
    if (postText.trim() === "") return;
    alert(`Posted: ${postText}`);
    setPostText("");
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 h-screen w-screen bg-black/50 flex justify-center items-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-8 rounded-2xl w-[90%] max-w-[400px] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute top-2.5 right-4 bg-transparent border-none text-xl cursor-pointer"
        >
          <RxCrossCircled />
        </button>

        <div className="flex items-center gap-2.5">
          <FaUserCircle size={40} className="text-gray-400" />
          <input
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 p-2.5 rounded-2xl border border-gray-200 outline-none text-sm"
          />
        </div>

        <div className="flex justify-around mt-6 items-center">
          <button
            className="bg-blue-50 border-none rounded-lg px-2.5 py-1.5 cursor-pointer flex items-center gap-1.5"
          >
            <FaPhotoVideo className="text-blue-600" /> 
            <span className="text-blue-600">Photo/Video</span>
          </button>

          <button
            className="bg-blue-600 text-white border-none rounded-lg px-3 py-1.5 font-bold cursor-pointer hover:bg-blue-700 transition-colors"
            onClick={handlePost}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal; 