import fs from "fs/promises"
import pdfParse from "pdf-parse"
import mammoth from "mammoth"

export async function extractText(
    filePath: string,
    fileType: string
): Promise<string> {
    try {
        switch (fileType.toLowerCase()) {
            case "pdf":
                return await extractFromPDF(filePath)

            case "docx":
                return await extractFromDocx(filePath)

            case "txt":
            case "md":
                return await extractFromText(filePath)

            default:
                throw new Error(`Unsupported file type: ${fileType}`)
        }
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to extract text: ${error.message}`)
        }
        throw error
    }
}


async function extractFromPDF(filePath: string): Promise<string> {
    const dataBuffer = await fs.readFile(filePath)

    const data = await pdfParse(dataBuffer)

    return data.text
}


async function extractFromDocx(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath })

    return result.value
}

async function extractFromText(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath, "utf-8")
    return content
}

export function cleanText(text: string): string {
    return text
        .replace(/\s+/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
}