import { IChunk } from "../models/Document";

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

export function chunkText(text: string): IChunk[] {
  const cleanTextContent = text.replace(/\s+/g, " ").trim();

  if (!cleanTextContent) {
    return [];
  }

  if (cleanTextContent.length <= CHUNK_SIZE) {
    return [
      {
        chunkIndex: 0,
        content: cleanTextContent,
        charCount: cleanTextContent.length,
      },
    ];
  }

  const chunks: IChunk[] = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < cleanTextContent.length) {
    let endIndex = Math.min(startIndex + CHUNK_SIZE, cleanTextContent.length);

    if (endIndex < cleanTextContent.length) {
      const lastPeriod = cleanTextContent.lastIndexOf(". ", endIndex);
      const lastQuestion = cleanTextContent.lastIndexOf("? ", endIndex);
      const lastExclamation = cleanTextContent.lastIndexOf("! ", endIndex);

      const sentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);

      if (sentenceEnd > startIndex + CHUNK_SIZE * 0.5) {
        endIndex = sentenceEnd + 1;
      }
    }

    const content = cleanTextContent.substring(startIndex, endIndex).trim();

    if (content) {
      chunks.push({
        chunkIndex: chunkIndex,
        content: content,
        charCount: content.length,
      });
      chunkIndex++;
    }

    // Advance with overlap, but never move backwards or stall.
    // If the remaining tail is shorter than the overlap, just jump to the end.
    const nextStartIndex = endIndex - CHUNK_OVERLAP;
    if (nextStartIndex <= startIndex) {
      startIndex = endIndex;
    } else {
      startIndex = nextStartIndex;
    }
  }

  return chunks;
}


export function getChunkStats(chunks: IChunk[]) {
    if (chunks.length === 0) {
        return { totalChunks: 0, avgSize: 0, minSize: 0, maxSize: 0 }
    }

    const sizes = chunks.map(c => c.charCount)
    const total = sizes.reduce((sum, size) => sum + size, 0)

    return {
        totalChunks: chunks.length,
        avgSize: Math.round(total / chunks.length),
        minSize: Math.min(...sizes),
        maxSize: Math.max(...sizes)
    }
}