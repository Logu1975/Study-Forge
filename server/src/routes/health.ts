/**
 * routes/health.ts - the URL http://localhost:4000/api/health
 *
 * A "route" connects a URL to a function. This one answers GET requests with
 * the health report as JSON.
 */
import { Router } from "express";
import { config } from "../lib/config";
import { buildHealthReport } from "../lib/health";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json(buildHealthReport({ version: config.version }));
});
