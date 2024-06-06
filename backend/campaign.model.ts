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
  website?: string;
  twitter?: string;
}

const campaignMetadataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: FundCategories, required: true },
  description: { type: String, required: true },
  website: { type: String },
  twitter: { type: String },
  hash: { type: String, required: true },
  imagePath: { type: String, required: true },
});

export interface ICampaignMetadata extends CampaignMetadata, Document {
  hash: string;
  imagePath: string;
}

const Campaign = mongoose.model<ICampaignMetadata>(
  "CampaignMetadata",
  campaignMetadataSchema,
  "Campaign Metadata"
);

export default Campaign;
