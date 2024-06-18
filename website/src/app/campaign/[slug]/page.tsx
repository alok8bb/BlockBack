"use client";

import { CategoryCard } from "@/components/Cards";
import Navbar from "@/components/navbar";
import { BlockBack_ABI } from "@/contract/abi";
import { SERVER_ENDPOINTS, contractAddress } from "@/lib/config";
import { Campaign, ReactFCC } from "@/lib/types";
import { getCompletionPercentage, getTruncatedWalletAddr } from "@/utils";
import moment from "moment";
import { useEffect, useState } from "react";
import { HiOutlineGlobe } from "react-icons/hi";
import { RxTwitterLogo } from "react-icons/rx";
import Jazzicon from "react-jazzicon";
import { useReadContract, useWriteContract } from "wagmi";
import { parseEther } from "viem";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { inputStyles } from "@/components";

export default function CampaignPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const id = params.slug;
  const { data, isPending, error, isFetched } = useReadContract({
    abi: BlockBack_ABI,
    address: contractAddress as `0x${string}`,
    functionName: "getCampaign",
    args: [BigInt(id)],
  });

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [contribution, setContribution] = useState<string>("");

  useEffect(() => {
    async function populateData() {
      if (isFetched) {
        if (!data) {
          setServerError("Failed to fetch campaign");
          return;
        }

        const res = await fetch(
          SERVER_ENDPOINTS.getCampaignMetadata(data.metadataHash)
        );
        if (!res.ok) {
          if (res.status === 404) {
            setServerError("Campaign metadata not found");
            return;
          }

          setServerError("Failed to fetch metadata");
          return;
        }

        const metadata = await res.json();
        setCampaign({
          ...metadata,
          ...data,
        });
      }
    }

    populateData();
  }, [data]);

  const { writeContract, isSuccess, isError } = useWriteContract();
  function handleOnClick() {
    writeContract({
      abi: BlockBack_ABI,
      address: contractAddress as `0x${string}`,
      functionName: "contribute",
      args: [BigInt(id)],
      value: parseEther(contribution),
    });
  }

  useEffect(() => {
    if (isSuccess) {
      toast(
        "Transaction sent successfully, contribution will reflect upon completion!",
        { icon: "🎉" }
      );
      setContribution("");
    }
  }, [isSuccess]);

  return (
    <>
      <Navbar />
      <div className="w-full flex justify-center items-center md:mt-10">
        {campaign && (
          <div className="flex md:flex-row flex-col w-full lg:mx-30 xl:mx-72 gap-10">
            <div className="md:w-2/3 flex flex-col gap-2">
              <img
                src={SERVER_ENDPOINTS.getImage(campaign.imagePath)}
                className="w-full max-h-56 object-cover rounded-lg"
                alt="Campaign Image"
              />
              <CategoryCard category={campaign.category} />
              <h1 className="text-3xl font-semibold">{campaign.title}</h1>
              <p className="text-gray-400">{campaign.description}</p>
            </div>
            <div className="md:w-1/3 flex flex-col gap-5">
              <div>
                {campaign.website && (
                  <a
                    href={campaign.website}
                    target="blank"
                    className="text-blue-400 hover:text-blue-300 flex flex-row gap-2 items-center"
                  >
                    <HiOutlineGlobe size={18} />
                    {campaign.website}
                  </a>
                )}
                {campaign.twitter && (
                  <a
                    href={campaign.twitter}
                    target="blank"
                    className="text-blue-400 hover:text-blue-300 flex flex-row gap-2 items-center"
                  >
                    <RxTwitterLogo size={18} />
                    {campaign.twitter}
                  </a>
                )}
              </div>

              <div>
                <TitleHeader>Deployer</TitleHeader>
                <div className="flex items-center gap-2">
                  <Jazzicon
                    diameter={20}
                    seed={Math.round(Math.random() * 10000000)}
                  />
                  <span className="text-lg text-blue-400 hover:text-blue-300">
                    <a href="">{getTruncatedWalletAddr(campaign.owner)}</a>
                  </span>
                </div>
              </div>

              <div>
                <TitleHeader>Deadline</TitleHeader>
                <p className="text-start">
                  {moment(Number(campaign.deadline) * 1000).format(
                    "MMMM Do YYYY, h:mm a"
                  )}
                  <br />({moment().to(moment(Number(campaign.deadline) * 1000))}
                  )
                </p>
              </div>

              <div>
                <TitleHeader>Goal Details</TitleHeader>
                <p className="text-start">
                  {`Goal: ${Number(campaign.goalDetails.goal) / 10 ** 18} ETH`}
                  <br />
                  {`Min Contribution: ${
                    Number(campaign.goalDetails.minAmount) / 10 ** 18
                  } ETH`}
                  <br />
                  {`Max Contribution:  ${
                    Number(campaign.goalDetails.maxAmount) / 10 ** 18
                  } ETH`}
                </p>
              </div>
              <div>
                <TitleHeader>Completion</TitleHeader>
                <div className="w-full flex flex-row gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
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

                  <h1>
                    {getCompletionPercentage(
                      campaign.goalDetails.goal,
                      campaign.raisedAmount
                    )}
                    %
                  </h1>
                </div>
              </div>

              {Number(campaign.deadline) > new Date().getTime() / 1000 && (
                <div>
                  <div className="">
                    <input
                      type="number"
                      step={"any"}
                      className={`${inputStyles} !p-4 w-full`}
                      placeholder="Amount (ETH) ex. 0.02"
                      onChange={(e) => setContribution(e.target.value)}
                    />

                    <button
                      type="submit"
                      className="px-6 py-3 mt-4 bg-accent-500 text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400 w-full"
                      onClick={handleOnClick}
                    >
                      Contribute
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {isPending && <h1>Loading...</h1>}
      </div>
    </>
  );
}

const TitleHeader: ReactFCC = ({ children }) => {
  return <h1 className="text-xl font-semibold tracking-wide">{children}</h1>;
};
