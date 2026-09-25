import express, {
  type Request,
  type Response,
} from "express";
import cors from "cors";

const app = express();

const PORT = 4000;

app.use(cors());
app.use(express.json());

const healthResponse = {
  status: "ok",
  version: "0.0.1",
  uptimeSeconds: Math.floor(process.uptime()),
  checks: {
    api: "ok",
    database: "not_configured",
  },
};

app.get(
  "/",
  (_req: Request, res: Response) => {
    res.json({
      name: "StudyForge Server",
      status: "running",
    });
  }
);

app.get(
  "/health",
  (_req: Request, res: Response) => {
    res.json({
      ...healthResponse,
      uptimeSeconds: Math.floor(process.uptime()),
    });
  }
);

app.get(
  "/api/health",
  (_req: Request, res: Response) => {
    res.json({
      ...healthResponse,
      uptimeSeconds: Math.floor(process.uptime()),
    });
  }
);

app.listen(PORT, () => {
  console.log(
    `StudyForge server running on http://localhost:${PORT}`
  );
});