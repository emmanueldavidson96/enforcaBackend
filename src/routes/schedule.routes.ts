import express from "express";
import * as Controller from "../controllers/schedule.controller";
import verifyToken from "../middlewares/verifyToken";

const router = express.Router();

// Create new schedule/interview
router.post("/create-schedule", verifyToken, Controller.createScheduleHandler);

// Get monthly schedule
router.get("/monthly-schedule", verifyToken, Controller.getMonthlyScheduleHandler);

// Get upcoming events
router.get("/upcoming-events", verifyToken, Controller.getUpcomingEventsHandler);

// Get schedule details
router.get("/schedule/:id", verifyToken, Controller.getScheduleDetailsHandler);

// Get schedules by type
router.get("/schedules/:eventType", verifyToken, Controller.getSchedulesByTypeHandler);

// Get today's schedule
router.get("/today-schedule", verifyToken, Controller.getTodayScheduleHandler);

// Update schedule
router.put("/update-schedule/:id", verifyToken, Controller.updateScheduleHandler);

// Cancel schedule
router.put("/cancel-schedule/:id", verifyToken, Controller.cancelScheduleHandler);

// Delete schedule
router.delete("/delete-schedule/:id", verifyToken, Controller.deleteScheduleHandler);

export default router;