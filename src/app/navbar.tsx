import React from "react";
import Link from 'next/link';
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

function NavLink(props: {linkText: string, href: string}) {
  return (
    <Link href={props.href} className="text-base-300 hover:text-base-100 hover:no-underline transition-all duration-300 text-lg mr-2">
        {props.linkText}
    </Link>
  )
}

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center border-b border-base-300">
      <div className="text-2xl m-2">
        <NavLink linkText="Retro Rover" href="/"/>
      </div>
      <div className="flex flex-row space-x-4 m-2">
        <UserButton />
        <SignedOut>
          <NavLink linkText="Sign In" href="/sign-in"/>
        </SignedOut>
        <NavLink linkText="Home" href="/"/>
        <NavLink linkText="About" href="/about"/>
        <SignedIn>
          <NavLink linkText="My Boards" href="/myBoards"/>
        </SignedIn>
      </div>
    </nav>
  );
};
