"use client";

import { MainIcon } from "./icons";

export default function Navbar() {
  return (
    <nav className="flex justify-between p-10 font-sans items-center">
      <div className="flex flex-row items-center gap-4">
        <MainIcon height={40} width={40} className={"fill-accent-500"} />
        <a href="/" className="text-3xl text-gray-100 font-bold tracking-wide">
          BlockBack
        </a>
      </div>

      <div className="flex flex-row items-center gap-12 text-xl font-semibold text-gray-200 transition duration-300">
        <a href="" className="hover:text-accent-500">
          About
        </a>
        <a
          href="/campaign/new"
          className="font-bold hover:text-accent-500 transition duration-300"
        >
          Create Campaign
        </a>
        <w3m-button />
      </div>
    </nav>
  );
}
