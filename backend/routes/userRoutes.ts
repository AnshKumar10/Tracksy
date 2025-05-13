import {
  getUserById,
  getUserProfile,
  getUsers,
  updateUserProfile,
} from "../controllers/userControllers";
import { Router } from "express";
import { adminOnlyAccess, protect } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.get("/", protect, adminOnlyAccess, getUsers);

router.get("/profile", protect, getUserProfile);

router.put("/profile", protect, updateUserProfile);

router.get("/:id", protect, getUserById);

router.post("/upload-image", upload.single("image"), (request, response) => {
  if (!request.file) {
    response.status(400).json({
      message: "No file uploaded",
    });
  }

  const imageUrl = `${request.protocol}://${request.get("host")}/uploads/${
    request.file?.filename
  }`;

  response.status(200).json({
    imageUrl,
  });
});

export default router;
