// crud phone routes with and controller validation and error handling
import express from "express";
import PhoneController from "../controllers/phone.controller.js";

// import { phoneSchema } from "../validators/phone.validator.js";

const router = express.Router();
const phoneController = new PhoneController();

router.get("/", phoneController.getPhones);
router.get("/:id", phoneController.getPhoneById);
router.post("/", phoneController.createPhone);
router.put("/:id", phoneController.updatePhone);
router.delete("/:id", phoneController.deletePhone);

export default router;
