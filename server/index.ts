import express from "express";
import router from "./routes.ts";
import cors from "cors";
import dotenv from "dotenv";

// Load env (support local.env fallback)
dotenv.config({ path: "local.env" });
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/api", router);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API server listening on ${port}`);
});
