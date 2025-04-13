"use client";

import React from "react";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";

const Feed = () => {
  const posts = [
    {
      id: 1,
      user: "Mannan ",
      avatar: "https://avatar.iran.liara.run/public/17",
      time: "2 hours ago",
      content: "What an absolute GOAT of the game",
      image:
        "https://cdn.britannica.com/48/252748-050-C514EFDB/Virat-Kohli-India-celebrates-50th-century-Cricket-November-15-2023.jpg",
    },
    {
      id: 2,
      user: "Diya",
      avatar: "https://avatar.iran.liara.run/public/65",
      time: "1 hour ago",
      content: "Check out this amazing sunset!",
      image:
        "https://miro.medium.com/v2/resize:fit:1400/1*tMKkGydXuiOBOb15srANvg@2x.jpeg",
    },
  ];

  return (
    <div style={{ padding: "1rem", width: "100%", maxWidth: "600px" }}>
      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            background: "#f9f9f9",
            borderRadius: "15px",
            marginBottom: "1.5rem",
            padding: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <img
              src={post.avatar}
              alt={post.user}
              style={{
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                marginRight: "10px",
              }}
            />
            <div>
              <strong>{post.user}</strong>
              <p style={{ fontSize: "12px", margin: 0, color: "#666" }}>
                {post.time}
              </p>
            </div>
          </div>


              <p style={{ marginBottom: "10px" }}>{post.content}</p>
          {post.image && (
            <img
              src={post.image}
              alt="post"
              style={{
                width: "100%",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginTop: "10px",
              color: "#555",
            }}
          >
            <FaHeart style={{ cursor: "pointer" }} />
            <FaComment style={{ cursor: "pointer" }} />
            <FaShare style={{ cursor: "pointer" }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
