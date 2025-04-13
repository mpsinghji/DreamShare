"use client";

import React, { useState } from "react";
import { FaPhotoVideo, FaUserCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

const CreatePostModal = ({ closeModal }) => {
  const [postText, setPostText] = useState("");

  const handlePost = () => {
    if (postText.trim() === "") return;
    alert(`Posted: ${postText}`);
    setPostText("");
    closeModal();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={closeModal}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "20px",
          width: "90%",
          maxWidth: "400px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          <RxCrossCircled />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FaUserCircle size={40} color="gray" />
          <input
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="What's on your mind?"
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: "20px",
              border: "1px solid lightgray",
              outline: "none",
              fontSize: "14px",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: "1.5rem",
            alignItems: "center",
          }}
        >
          <button
            style={{
              background: "#e4f0ff",
              border: "none",
              borderRadius: "10px",
              padding: "6px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaPhotoVideo color="#1877f2" /> Photo/Video
          </button>

          <button
            style={{
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "6px 12px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
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
