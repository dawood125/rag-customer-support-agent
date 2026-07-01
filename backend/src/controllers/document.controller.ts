import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import { DocumentModel } from "../models/Document";
import { extractText, cleanText } from "../utils/textExtractor";
import { chunkText, getChunkStats } from "../utils/chunker";

export async function uploadDocument(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const file = req.file;
    const fileExt = path
      .extname(file.originalname)
      .toLowerCase()
      .replace(".", "");
    const fileName = path.parse(file.originalname).name;

    const document = await DocumentModel.create({
      companyId: req.user.companyId,
      uploadedBy: req.user.userId,
      fileName: file.originalname,
      fileType: fileExt,
      fileSize: file.size,
      status: "processing",
      chunks: [],
    });

    processDocument(document._id.toString(), file.path, fileExt).catch((err) =>
      console.error("Background processing error:", err),
    );

    return res.status(201).json({
      success: true,
      message: "Document uploaded! Processing in background...",
      data: {
        document: {
          _id: document._id,
          fileName: document.fileName,
          fileType: document.fileType,
          fileSize: document.fileSize,
          status: document.status,
        },
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (e) {}
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload document",
    });
  }
}

async function processDocument(
  documentId: string,
  filePath: string,
  fileType: string,
) {
  try {
    console.log(`📄 Processing document ${documentId}...`);

    const rawText = await extractText(filePath, fileType);
    const text = cleanText(rawText);

    console.log(`✅ Extracted ${text.length} characters`);

    const chunks = chunkText(text);
    const stats = getChunkStats(chunks);

    console.log(
      `✂️  Created ${stats.totalChunks} chunks (avg: ${stats.avgSize} chars)`,
    );

    await DocumentModel.findByIdAndUpdate(documentId, {
      chunks: chunks,
      totalChunks: chunks.length,
      status: "ready",
    });

    console.log(`✅ Document ${documentId} is ready!`);

    await fs.unlink(filePath);
  } catch (error) {
    console.error(`❌ Processing failed for ${documentId}:`, error);

    await DocumentModel.findByIdAndUpdate(documentId, {
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    });

    try {
      await fs.unlink(filePath);
    } catch (e) {}
  }
}

export async function getDocuments(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const documents = await DocumentModel.find({
      companyId: req.user.companyId,
    })
      .select("-chunks")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        documents,
        count: documents.length,
      },
    });
  } catch (error) {
    console.error("Get documents error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
}

export async function getDocument(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const document = await DocumentModel.findOne({
      _id: id,
      companyId: req.user.companyId!,
    }).lean();

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { document },
    });
  } catch (error) {
    console.error("Get document error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch document",
    });
  }
}

export async function deleteDocument(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const document = await DocumentModel.findOneAndDelete({
      _id: id,
      companyId: req.user.companyId,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete document",
    });
  }
}
