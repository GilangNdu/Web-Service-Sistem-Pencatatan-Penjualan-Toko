import "dotenv/config";
import express from "express";
import router from "./routes/api.js";

const app = express();
const port = process.env.PORT || 2024;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", router);

app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
