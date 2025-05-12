import { UserButton } from "@clerk/nextjs";
import React from "react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex p-4 item-center justify-between bg-secondary shadow-md">
      <img src={"/logo.svg"} width={70} height={50} />
      <ul className="flex gap-6">
        <Link
          href="/dashboard"
          className="hove:text-primary hover:font-bold transition-all cursor-pointer"
        >
          Dashboard
        </Link>

        <li className="hove:text-primary hover:font-bold transition-all cursor-pointer">
          Questions
        </li>
        <li className="hove:text-primary hover:font-bold transition-all cursor-pointer">
          Upgrade
        </li>
        <li className="hove:text-primary hover:font-bold transition-all cursor-pointer">
          About us
        </li>
      </ul>
      <UserButton />
    </div>
  );
};

export default Header;
