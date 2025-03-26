import mongoose, { Schema, Document } from 'mongoose';

export interface IBoard extends Document {
  name: string;
  description: string;
}

const boardSchema = new Schema<IBoard>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Board = mongoose.model<IBoard>('Board', boardSchema);
