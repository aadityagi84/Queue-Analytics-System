import { Router } from "express";
import { getSummary } from "./analytics.controller";

const sumaryRoutes = Router();

sumaryRoutes.get("/summary", getSummary);

export default sumaryRoutes;
