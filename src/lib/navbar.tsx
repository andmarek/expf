import React from "react";
import Link from 'next/link';


const NavBar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center border-b-2 border-base-black">
      <div className="text-2xl font-semibold m-2">
        <Link href="/" className="transition-all duration-300 text-lg mx-2">
          Retro Rover
        </Link>
      </div>
      <div className="flex flex-row space-x-4 m-2">
        <Link href="/" className="hover:no-underline transition-all duration-300 text-lg mx-2">
          Home
        </Link>
        <Link href="/profile" className="hover:no-underline transition-all duration-300 text-lg mx-2">
          About
        </Link>
        <Link href="/controlPanel" className="hover:no-underline transition-all duration-300 text-lg mx-2">
          Boards
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
