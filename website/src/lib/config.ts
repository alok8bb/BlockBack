import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { anvil, sepolia } from "wagmi/chains";

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

if (!projectId) throw new Error("Project ID is not defined");
if (!contractAddress) throw new Error("Contract address is not defined");
if (!SERVER_URL) throw new Error("Server URL is not defined");

const metadata = {
  name: "BlockBack",
  description: "BlockBack",
  url: "https://web3modal.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const config = defaultWagmiConfig({
  chains: [sepolia],
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export const SERVER_ENDPOINTS = {
  getCampaignMetadata: (hash: string) => `${SERVER_URL}/data/${hash}`,
  getImage: (imagePath: string) => `${SERVER_URL}/image/${imagePath}`,
  uploadData: `${SERVER_URL}/data/upload`,
};
