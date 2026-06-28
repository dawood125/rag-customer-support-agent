import multer from "multer"
import path from "path"
import { Request } from "express"
import { v4 as uuidv4 } from "uuid"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/")  
    },

    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

const fileFilter = function (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const allowedExtensions = [".pdf", ".docx", ".txt", ".md"]
    const ext = path.extname(file.originalname).toLowerCase()

    if (allowedExtensions.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error(`Invalid file type. Allowed: ${allowedExtensions.join(", ")}`))
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 
    }
})