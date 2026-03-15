import mongoose, { Schema } from "mongoose";

const TaskSchema = new Schema({
    title: { type: String, required: true },
    userID: { type: String, required: true },
    description : { type: String, enum: ["to do", "in progress", "done", "archived"] },
    priority: { type: String, enum: ["low", "medium", "high"] },
    status : { type: String, required: true },
    dueDate: { type: Date, required: false },
    completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Task = mongoose.model("Task", TaskSchema)