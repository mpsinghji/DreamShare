"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { FaGripLines } from "react-icons/fa6";
import { RxCrossCircled } from "react-icons/rx";

const Left = () => {
  const [toggle, setToggle] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setToggle(false);
      }
    };

    if (toggle) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggle]);

  return (
    <div style={{}}>
      {toggle ? (
        <div
          ref={boxRef}
          style={{
            background: "lightgrey",
            height: "100%",
            padding: "1pc",
            borderRadius: "20px",
            transition: "all 0.4s ease",
            opacity: toggle ? 1 : 0,
            transform: toggle ? "translateY(0px)" : "translateY(-20px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FaSearch />
            <input
              type="text"
              placeholder="Search..."
              style={{
                background: "white",
                borderRadius: "10px",
                border: "none",
                padding: "6px 10px",
                outline: "none",
              }}
            />
            <button
              onClick={() => setToggle(false)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                position: "absolute",
                top: "1px",
                right: "1px",
                padding: "12px",
                fontSize:'32px'
              }}
            >
              <RxCrossCircled />
            </button>
          </div>
          <div style={{ padding: "2pc", textAlign: "center" }}>
            <h2 style={{ padding: "2pc" }}>Yaha search results ayenge </h2>
            
          </div>
        </div>
      ) : (
        <div>
          <FaGripLines
            onClick={() => setToggle(true)}
            style={{ fontSize: "24px", cursor: "pointer" }}
          />

          <div style={{ fontSize: "19px", marginTop: "4pc" }}>
            <h2>Suggestions</h2>
            <p>user1</p>
            <p>user2</p>
            <p>user3</p>
            <p>user4</p>
            <p>user6</p>
            <p>user6</p>
            <p>user6</p>
            <p>user6</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Left;
