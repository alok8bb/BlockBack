"use client";

import { CategoryCard } from "@/components/Cards";
import Navbar from "@/components/navbar";
import { BlockBack_ABI } from "@/contract/abi";
import { SERVER_ENDPOINTS, contractAddress } from "@/lib/config";
import { Campaign, CampaignMetadataResponse } from "@/lib/types";
import { getCompletionPercentage, getTruncatedWalletAddr } from "@/utils";
import moment from "moment";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Jazzicon from "react-jazzicon";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

export default function Page() {
  const account = useAccount();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const { data, isPending, isFetched } = useReadContract({
    abi: BlockBack_ABI,
    address: contractAddress as `0x${string}`,
    functionName: "getCampaignsByCreator",
    account: account.address,
  });
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

  const { writeContract, isSuccess, isError, error } = useWriteContract();
  function withdrawCampaignAmount(id: bigint) {
    // Withdraw the raised amount from the campaign
    writeContract({
      abi: BlockBack_ABI,
      address: contractAddress as `0x${string}`,
      functionName: "withdrawCampaign",
      args: [id],
    });

    if (isSuccess) {
      toast.success("Successfully withdrawn the raised amount");
    }

    if (isError) {
      toast.error("Failed to withdraw the raised amount");
    }

    if (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex w-full justify-center my-10 mx-10 flex-col">
        <h1 className={"text-accent-300 text-3xl font-bold"}>
          Manage Campaigns
        </h1>
        {error && <div>{error.message}</div>}
        {isPending && <div>Loading...</div>}
        {serverError && <div>{serverError}</div>}
        {!isPending && campaigns.length === 0 && <div>No campaigns found</div>}
        <div className="my-4 flex gap-4">
          {isFetched &&
            campaigns.map((campaign, key) => {
              return (
                <div
                  className="flex flex-col p-4 bg-magic-gray rounded-2xl w-1/4 gap-2 hover:cursor-pointer"
                  key={key}
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
                    <h1>
                      {`${getCompletionPercentage(
                        campaign.goalDetails.goal,
                        campaign.raisedAmount
                      )}
                %`}
                    </h1>
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
                    {campaign.status === 0 &&
                      Number(campaign.deadline) <
                        Math.floor(new Date().getTime() / 1000) && (
                        <button
                          onClick={() => withdrawCampaignAmount(campaign.id)}
                          className="p-4 bg-accent-300 text-black rounded-lg mt-5"
                        >
                          Withdraw Raised{" "}
                          {Number(campaign.raisedAmount) / 10 ** 18} ETH
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
