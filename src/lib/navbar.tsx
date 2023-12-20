import React from "react";

const NavBar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div className="text-lg font-semibold">
        <a href="#home">expf</a>
      </div>
      <div>
        <a href="#home" className="ml-4 hover:text-gray-300">Home</a>
        <a href="#profile" className="ml-4 hover:text-gray-300">Profile</a>
      </div>
    </nav>
  );
};

export default NavBar;
