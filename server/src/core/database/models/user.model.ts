import { Schema, model, Document, Model } from 'mongoose';
import { hash } from '../../utils/password';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  tasks: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: (v: string) => /\S+@\S+\.\S+/.test(v),
      message: 'Invalid email format'
    }
  },
  password: { type: String, required: true },
  name: { type: String, required: true },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await hash(this.password);
  next();
});

export const User: Model<IUser> = model<IUser>('User', userSchema);