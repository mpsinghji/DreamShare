
import React from 'react'
import Left from './Left';
import Right from './Right';
import Feed from './Feed';
import NavBar from '../../app/NavBar.jsx';
const Home = () => {
  return (
    <div>
      <NavBar />
      <div style={{ display: "flex", padding: "20px" }}>
        <div style={{ flex: 1 }}>
          <Left />
        </div>
        <div style={{ flex: 2 }}>
          <Feed />
        </div>
        <div style={{ flex: 1 }}>
          <Right />
        </div>
      </div>
    </div>
  );
};

export default Home;
