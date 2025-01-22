import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    department: {
        type: String
    },
    eventType: {
        type: String,
        enum: ['interview', 'meeting', 'webinar', 'other'],
        required: true
    },
    location: {
        type: String,
        default: 'Virtual Call'
    },
    description: {
        type: String
    },
    participantEmails: [{
        type: String
    }],
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
    }
}, {
    timestamps: true
});

export default mongoose.model("Schedule", scheduleSchema);