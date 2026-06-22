import { Router } from "express";
import { createTransaction } from "./transaction.controller";

const TransitionRouter = Router();
TransitionRouter.post("/create-transition", createTransaction);

export default TransitionRouter;
