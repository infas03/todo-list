"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const tasks_1 = require("../../../api/tasks");
const recurrenceSchema = new mongoose_1.Schema({
    pattern: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly', 'none'] },
    nextOccurrence: { type: Date }
});
const taskSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: Object.values(tasks_1.TaskStatus),
        default: tasks_1.TaskStatus.NOT_DONE
    },
    priority: {
        type: String,
        enum: Object.values(tasks_1.TaskPriority),
        default: tasks_1.TaskPriority.MEDIUM
    },
    dueDate: { type: Date },
    recurrence: recurrenceSchema,
    dependencies: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Task',
            default: []
        }],
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
exports.Task = (0, mongoose_1.model)('Task', taskSchema);
