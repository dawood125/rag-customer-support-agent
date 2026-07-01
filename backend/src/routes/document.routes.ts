import { Router } from "express"
import { authenticate } from "../middlewares/auth.middleware"
import { upload } from "../config/multer"
import {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument
} from "../controllers/document.controller"

const router = Router()

router.use(authenticate)

router.post("/upload", upload.single("file"), uploadDocument)

router.get("/", getDocuments)

router.get("/:id", getDocument)

router.delete("/:id", deleteDocument)

export default router