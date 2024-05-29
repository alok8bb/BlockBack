"use client";

import { useConnect } from "wagmi";
import { MainIcon } from "./icons";
import { getTruncatedWalletAddr } from "@/utils";
import { metaMask } from "wagmi/connectors";

export default function Navbar() {
  const { connect } = useConnect();
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
        <button
          onClick={() => {
            connect({ connector: metaMask() });
          }}
          className="px-8 py-1 rounded-full border-2 border-accent-500 hover:bg-accent-500 hover:text-white transition duration-300"
        >
          Login
        </button>
      </div>
    </nav>
  );
}
