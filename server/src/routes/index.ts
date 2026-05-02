import { Router } from "express";
import { calendarRouter } from "./calendarRoutes.js";
import { healthRouter } from "./healthRoutes.js";
import { marketRouter } from "./marketRoutes.js";
import { nhlRouter } from "./nhlRoutes.js";
import { weatherRouter } from "./weatherRoutes.js";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use(calendarRouter);
apiRouter.use(marketRouter);
apiRouter.use(nhlRouter);
apiRouter.use(weatherRouter);
