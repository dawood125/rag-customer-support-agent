import mongoose, { Schema, Document } from "mongoose";

export interface ICompany extends Document {
  name: string;
  email: string;
  plan: "free" | "basic" | "premium";
  isActive: boolean;
  apiKey: string;
  monthlyMessageLimit: number;
  messagesUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: [2, "Name too short"],
      maxlength: [100, "Name too long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    plan: {
      type: String,
      enum: ["free", "basic", "premium"],
      default: "free",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    apiKey: {
      type: String,
      unique: true,
      sparse: true,
    },

    monthlyMessageLimit: {
      type: Number,
      default: 100,
    },

    messagesUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Company = mongoose.model<ICompany>("Company", CompanySchema);
