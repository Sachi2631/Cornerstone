import { Schema, model, Document } from "mongoose";

export interface ResourceItem {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface ResourceDoc extends Document {
  id: string;
  category: string;
  items: ResourceItem[];
  createdAt: Date;
  updatedAt: Date;
}

const ResourceItemSchema = new Schema<ResourceItem>(
  {
    id: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const ResourceSchema = new Schema<ResourceDoc>(
  {
    id: { type: String, required: true, unique: true, index: true, trim: true },
    category: { type: String, required: true, index: true, trim: true },
    items: { type: [ResourceItemSchema], default: [] },
  },
  { timestamps: true, collection: "Resource" }
);

export const Resource = model<ResourceDoc>("Resource", ResourceSchema);
