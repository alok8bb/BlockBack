import { PropsWithChildren } from "react";

export const FundCategories = [
  "Technology",
  "Health and Wellness",
  "Social Impact",
  "Creative Arts",
  "Business and Entrepreneurship",
  "Other",
] as const;
export type FundCategory = (typeof FundCategories)[number];

export type CampaignMetadata = {
  title: string;
  category: FundCategory;
  description: string;
  website?: string;
  twitter?: string;
};

export type CampaignMetadataResponse = CampaignMetadata & {
  hash: string;
  imagePath: string;
};

export enum CampaignStatus {
  Active = 0,
  Completed = 1,
}

export type GoalDetails = {
  minAmount: bigint;
  maxAmount: bigint;
  goal: bigint;
};

export type Campaign = CampaignMetadataResponse & {
  id: bigint;
  status: CampaignStatus;
  metadataHash: string;
  owner: string;
  deadline: bigint;
  goalDetails: GoalDetails;
  raisedAmount: bigint;
};

export type ReactFCC<T = unknown> = React.FC<PropsWithChildren<T>>;
