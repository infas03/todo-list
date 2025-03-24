import { Schema, model, Document, Model } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  completed: boolean;
  user: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Task: Model<ITask> = model<ITask>('Task', taskSchema);