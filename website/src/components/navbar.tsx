import { MainIcon } from "./icons";

export default function Navbar() {
  return (
    <nav className="flex justify-between p-10 font-sans items-center">
      <div className="flex flex-row items-center gap-4">
        <MainIcon height={40} width={40} className={"fill-accent-300"} />
        <h3 className="text-3xl text-gray-100 font-bold tracking-wide">
          BlockBack
        </h3>
      </div>

      <div className="flex flex-row items-center gap-12 text-xl font-semibold text-gray-200">
        <a href="" className="hover:text-accent-300">
          About
        </a>
        <a href="" className="font-bold hover:text-accent-300">
          Create Campaign
        </a>
        <button className="px-8 py-1 rounded-full border-2 border-accent-300 hover:text-accent-300">
          Login
        </button>
      </div>
    </nav>
  );
}
