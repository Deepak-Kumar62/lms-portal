import express from "express";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import {
  capturePaymentAndFinalizeOrder,
  createOrder,
} from "../../controllers/studentControllers/order.controller.js";

const router = express.Router();

router.post("/create", verifyAuth, createOrder);
router.post("/capture", verifyAuth, capturePaymentAndFinalizeOrder);

export default router;
