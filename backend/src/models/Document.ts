import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChunk {
  chunkIndex: number;
  content: string;
  charCount: number;
  // embedding: number[]
}

export interface IDocument extends Document {
  _id: Types.ObjectId;
  companyId: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  fileName: string;
  fileType: string;
  fileSize: number;
  totalChunks: number;
  chunks: IChunk[];
  status: "processing" | "ready" | "failed";
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChunkSchema = new Schema(
  {
    chunkIndex: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    charCount: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const DocumentSchema = new Schema<IDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
      index: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader is required"],
    },
    fileName: {
      type: String,
      required: [true, "File name is required"],
      trim: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: ["pdf", "docx", "txt", "md"],
    },
    fileSize: {
      type: Number,
      required: true,
      max: [10 * 1024 * 1024, "File too large (max 10MB)"],
    },
    totalChunks: {
      type: Number,
      default: 0,
    },
    chunks: [ChunkSchema],
    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

DocumentSchema.index({ companyId: 1, createdAt: -1 })
// DocumentSchema.index({ "chunks.content": "text" })

export const DocumentModel = mongoose.model<IDocument>("Document", DocumentSchema)