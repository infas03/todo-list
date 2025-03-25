import { Schema, model, Document, Model, ObjectId } from 'mongoose';
import { hashPassword } from '../../utils/password';

export type UserRole = 'USER' | 'ADMIN';

export interface IUser extends Document {
  _id: ObjectId;
  email: string;
  password: string;
  name: string;
  role: string;
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
  password: { 
    type: String, 
    required: true,
    minlength: 8,
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true
  },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
}, { 
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.__v;
    }
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const User: Model<IUser> = model<IUser>('User', userSchema);