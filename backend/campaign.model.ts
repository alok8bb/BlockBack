import mongoose, { Document } from "npm:mongoose";

export const FundCategories = [
  "Technology",
  "Health and Wellness",
  "Social Impact",
  "Creative Arts",
  "Business and Entrepreneurship",
  "Other",
] as const;
export type TFundCategory = (typeof FundCategories)[number];

export interface CampaignMetadata {
  title: string;
  category: TFundCategory;
  description: string;
  minAmount: number;
  maxAmount: number;
  goalAmount: number;
  website?: string;
  twitter?: string;
  deadline: number;
}

const campaignMetadataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: FundCategories, required: true },
  description: { type: String, required: true },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  goalAmount: { type: Number, required: true },
  website: { type: String },
  twitter: { type: String },
  deadline: { type: Number, required: true },
  hash: { type: String, required: true },
});

export interface ICampaignMetadata extends CampaignMetadata, Document {
  hash: string;
}

const Campaign = mongoose.model<ICampaignMetadata>(
  "CampaignMetadata",
  campaignMetadataSchema,
  "Campaign Metadata"
);

export default Campaign;
