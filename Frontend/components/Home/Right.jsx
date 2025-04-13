"use client";

import React,{useState} from "react";

import { FaPlus } from "react-icons/fa";
import Post from "../../app/Post.jsx"; 

const Right = () => {
  const suggestions = [
    { name: "Alex Carter", avatar: "https://i.pravatar.cc/30?img=3" },
    { name: "Maya Lopez", avatar: "https://i.pravatar.cc/30?img=4" },
    { name: "Ravi Kumar", avatar: "https://i.pravatar.cc/30?img=5" },
    ];
      const [showModal, setShowModal] = useState(false);

  return (
    <div
      style={{
        width: "290px",
        padding: "1rem",
        background: "#f5f5f5",
        borderRadius: "15px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ marginBottom: "1rem" }}>People You May Know</h3>
      {suggestions.map((user, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
            gap: "10px",
          }}
        >
          <img
            src={user.avatar}
            alt={user.name}
            style={{ borderRadius: "50%", width: "30px", height: "30px" }}
          />
          <span style={{ flex: 1 }}>{user.name}</span>
          <button
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              borderRadius: "5px",
              border: "none",
              background: "#007bff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      ))}

      <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>Trending</h3>
      <ul style={{ paddingLeft: "15px", color: "#555" }}>
        <li>#ReactJS</li>
        <li>#DevLife</li>
        <li>#AI2025</li>
      </ul>
      <div
        style={{
          width: "250px",
          padding: "1rem",
          background: "#f5f5f5",
          borderRadius: "15px",
          textAlign: "center",
        }}
      >
        <h3>Create a Post</h3>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "auto",
          }}
        >
          <FaPlus /> New Post
        </button>

        {showModal && (
          <Post closeModal={() => setShowModal(false)} />
        )}
      </div>
    </div>
  );
};

export default Right;
