import express from "express";
import saleController from "../controllers/saleController.js";
const router = express.Router();
import authController from "../controllers/authController.js";
import categories from "../controllers/categoryController.js";
import news from "../controllers/newsController.js";
import jwtAuth from "../middleware/jwtAuth.js";

router.post("/sales", saleController.create);
router.get("/sales", saleController.getAll);
router.get("/sales/:id", saleController.getById);
router.put("/sales/:id", saleController.update);
router.delete("/sales/:id", saleController.remove);
router.post("/auth", authController.login);
router.get("/categories", jwtAuth, categories.getAll);
router.get("/categories/:id", jwtAuth, categories.getById);
router.post("/categories", jwtAuth, categories.create);
router.put("/categories/:id", jwtAuth, categories.update);
router.delete("/categories/:id", jwtAuth, categories.destroy);
router.get("/news", jwtAuth, news.getAll);
router.get("/news/:id", jwtAuth, news.getById);
router.post("/news", jwtAuth, news.create);
router.put("/news/:id", jwtAuth, news.update);
router.delete("/news/:id", jwtAuth, news.destroy);

export default router;
