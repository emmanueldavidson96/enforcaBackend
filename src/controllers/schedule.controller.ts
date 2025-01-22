import { RequestHandler, Response, Request, NextFunction } from "express";
import createHttpError from "http-errors";
import scheduleModel from "../models/schedule.model";

// Create Interview/Meeting Schedule
export const createScheduleHandler: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    const {title, startDate, endDate, companyName, department, eventType,
        location, description, participantEmails} = request.body;
    try {
        if (!title || !startDate || !endDate || !companyName || !eventType) {
            throw createHttpError(400, "Missing required fields!");
        }

        const newSchedule = await scheduleModel.create({
            title,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            companyName,
            department: department || '',
            eventType,
            location: location || 'Virtual Call',
            description: description || '',
            participantEmails: participantEmails || [],
            organizer: request.userId,
            status: 'scheduled'
        });

        response.status(201).json({
            success: true,
            message: "Schedule created successfully!",
            schedule: newSchedule
        });
    } catch (error) {
        next(error);
    }
};

// Get Monthly Schedule
export const getMonthlyScheduleHandler: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    const { month, year } = request.query;
    try {
        const startDate = new Date(Number(year), Number(month) - 1, 1);
        const endDate = new Date(Number(year), Number(month), 0);

        const schedules = await scheduleModel.find({
            organizer: request.userId,
            startDate: { $gte: startDate },
            endDate: { $lte: endDate }
        }).sort({ startDate: 1 });

        response.status(200).json({
            success: true,
            message: "Monthly schedules retrieved successfully",
            schedules
        });
    } catch (error) {
        next(error);
    }
};

// Get Upcoming Events
export const getUpcomingEventsHandler: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const currentDate = new Date();
        const schedules = await scheduleModel.find({
            organizer: request.userId,
            startDate: { $gte: currentDate },
            status: { $ne: 'cancelled' }
        })
            .sort({ startDate: 1 })
            .limit(5);

        response.status(200).json({
            success: true,
            message: "Upcoming events retrieved successfully",
            schedules
        });
    } catch (error) {
        next(error);
    }
};

// Update Schedule
export const updateScheduleHandler: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    const updateData = request.body;

    try {
        const schedule = await scheduleModel.findOneAndUpdate(
            { _id: id, organizer: request.userId },
            updateData,
            { new: true }
        );

        if (!schedule) {
            throw createHttpError(404, "Schedule not found or unauthorized!");
        }

        response.status(200).json({
            success: true,
            message: "Schedule updated successfully!",
            schedule
        });
    } catch (error) {
        next(error);
    }
};

// Delete Schedule
export const deleteScheduleHandler: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;

    try {
        const schedule = await scheduleModel.findOneAndDelete({
            _id: id,
            organizer: request.userId
        });

        if (!schedule) {
            throw createHttpError(404, "Schedule not found or unauthorized!");
        }

        response.status(200).json({
            success: true,
            message: "Schedule deleted successfully!"
        });
    } catch (error) {
        next(error);
    }
};

// Get Schedule Details
export const getScheduleDetailsHandler: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;

    try {
        const schedule = await scheduleModel.findOne({
            _id: id,
            organizer: request.userId
        });

        if (!schedule) {
            throw createHttpError(404, "Schedule not found!");
        }

        response.status(200).json({
            success: true,
            message: "Schedule details retrieved successfully!",
            schedule
        });
    } catch (error) {
        next(error);
    }
};

// Get Schedules By Type
export const getSchedulesByTypeHandler: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    const { eventType } = request.params;
    try {
        const schedules = await scheduleModel.find({
            organizer: request.userId,
            eventType: eventType,
            status: { $ne: 'cancelled' }
        }).sort({ startDate: 1 });

        response.status(200).json({
            success: true,
            message: `${eventType} schedules retrieved successfully`,
            schedules
        });
    } catch (error) {
        next(error);
    }
};

// Get Today's Schedule
export const getTodayScheduleHandler: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const schedules = await scheduleModel.find({
            organizer: request.userId,
            startDate: { $gte: today, $lt: tomorrow },
            status: { $ne: 'cancelled' }
        }).sort({ startDate: 1 });

        response.status(200).json({
            success: true,
            message: "Today's schedules retrieved successfully",
            schedules
        });
    } catch (error) {
        next(error);
    }
};

// Cancel Schedule
export const cancelScheduleHandler: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    try {
        const schedule = await scheduleModel.findOneAndUpdate(
            { _id: id, organizer: request.userId },
            {
                status: 'cancelled',
                cancellationReason: request.body.reason || 'No reason provided'
            },
            { new: true }
        );

        if (!schedule) {
            throw createHttpError(404, "Schedule not found or unauthorized!");
        }

        response.status(200).json({
            success: true,
            message: "Schedule cancelled successfully!",
            schedule
        });
    } catch (error) {
        next(error);
    }
};