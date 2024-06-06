"use client";

import Navbar from "@/components/navbar";
import { BlockBack_ABI } from "@/contract/abi";
import { SERVER_ENDPOINTS, contractAddress } from "@/lib/config";
import { Campaign, CampaignMetadataResponse } from "@/lib/types";
import Jazzicon from "react-jazzicon";
import { useEffect, useState } from "react";
import { BaseError, useReadContract } from "wagmi";
import moment from "moment";
import { getCompletionPercentage, getTruncatedWalletAddr } from "@/utils";
import { CategoryCard } from "@/components/Cards";
import { useRouter } from "next/navigation";

type Filters = "Ongoing" | "Finished";

export default function Home() {
  const router = useRouter();
  const { data, isPending, error, isFetched } = useReadContract({
    abi: BlockBack_ABI,
    address: contractAddress as `0x${string}`,
    functionName: "getAllCampaigns",
  });

  const [selectedFilter, setSelectedFilter] = useState<Filters>("Ongoing");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  useEffect(() => {
    async function populateData() {
      if (isFetched) {
        if (!data) {
          return;
        }
        const campaigns: Campaign[] = [];
        for (let i = 0; i < data.length; i++) {
          const campaign = data[i];
          const res = await fetch(
            SERVER_ENDPOINTS.getCampaignMetadata(campaign.metadataHash)
          );
          if (!res.ok) {
            if (res.status === 404) {
              continue;
            }

            setServerError("Failed to fetch metadata");
            return;
          }

          const metadata = (await res.json()) as CampaignMetadataResponse;
          campaigns.push({
            ...metadata,
            ...campaign,
          });
        }
        setCampaigns(campaigns);
      }
    }

    populateData();
  }, [data]);

  return (
    <main className="w-full h-full flex flex-col">
      <Navbar />
      <div className="lg:w-[70%] self-center w-full">
        <div className="flex flex-row gap-4 text-3xl font-bold">
          <h1
            onClick={() => setSelectedFilter("Ongoing")}
            className={`${
              selectedFilter === "Ongoing" ? "text-accent-300" : "text-gray-500"
            } hover:cursor-pointer`}
          >
            OnGoing
          </h1>
          <h1
            onClick={() => setSelectedFilter("Finished")}
            className={`${
              selectedFilter === "Finished"
                ? "text-accent-300"
                : "text-gray-500"
            } hover:cursor-pointer`}
          >
            Finished
          </h1>
        </div>
        <div className="my-4 flex w-full gap-4">
          {(isPending || serverError || error) && (
            <div className="h-full w-full flex items-center justify-center content-center py-40 text-xl">
              {isPending
                ? "Fetching Campaigns..."
                : serverError
                ? serverError
                : error
                ? (error as unknown as BaseError).shortMessage
                : "Something went wrong!"}
            </div>
          )}
          {isFetched &&
            !serverError &&
            campaigns
              .filter((campaign) => {
                if (selectedFilter === "Ongoing") {
                  return campaign.status === 0;
                } else {
                  return campaign.status === 1;
                }
              })
              .map((campaign, key) => (
                <div
                  className="flex flex-col p-4 bg-magic-gray rounded-2xl w-1/3 gap-2 hover:cursor-pointer"
                  key={key}
                  onClick={() => router.push(`/campaign/${campaign.id}`)}
                >
                  <img
                    src={SERVER_ENDPOINTS.getImage(campaign.imagePath)}
                    className="w-full max-h-56 object-cover rounded-lg"
                    alt="Campaign Image"
                  />
                  <CategoryCard category={campaign.category} />
                  <h1 className="text-xl">{campaign.title}</h1>
                  <p className="text-gray-400 line-clamp-3">
                    {campaign.description}
                  </p>
                  <div className="flex flex-col w-full gap-2 mt-auto">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className={`bg-blue-600 h-2.5 rounded-full`}
                        style={{
                          width: `${getCompletionPercentage(
                            campaign.goalDetails.goal,
                            campaign.raisedAmount
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Jazzicon
                          diameter={15}
                          seed={Math.round(Math.random() * 10000000)}
                        />
                        <span>{getTruncatedWalletAddr(campaign.owner)}</span>
                      </div>
                      <p className="text-end">
                        {moment().to(moment(Number(campaign.deadline) * 1000))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </main>
  );
}
