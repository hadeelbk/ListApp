import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

import templateRoutes from "./routes/templateRoutes";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/templates", templateRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
