import { Schema, model, Document, Model, Types } from 'mongoose';
import { Recurrence, TaskPriority, TaskStatus } from '../../../api/tasks';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  recurrence?: Recurrence;
  dependencies: Types.ObjectId[];
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isRecurringInstance?: boolean;
}

const recurrenceSchema = new Schema<Recurrence>({
  pattern: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly', 'none'] },
  nextOccurrence: { type: Date }
});

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: Object.values(TaskStatus),
    default: TaskStatus.NOT_DONE
  },
  priority: {
    type: String,
    enum: Object.values(TaskPriority),
    default: TaskPriority.MEDIUM
  },
  dueDate: { type: Date },
  recurrence: recurrenceSchema,
  dependencies: [{
    type: Schema.Types.ObjectId,
    ref: 'Task',
    default: []
  }],
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Task: Model<ITask> = model<ITask>('Task', taskSchema);