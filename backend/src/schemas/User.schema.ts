import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true })
  googleId?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  username: string;

  @Prop({ required: false })
  age: number;

  @Prop({ required: false })
  address: string;

  @Prop({ default: 0 })
  points: number;

  @Prop({
    type: [
      {
        bookId: { type: Types.ObjectId, ref: 'Book' },
        borrowerId: { type: Types.ObjectId, ref: 'User' },
        message: String,
        borrowedAt: Date,
      },
    ],
    default: [],
  })
  notifications: {
    bookId: Types.ObjectId;
    borrowerId: Types.ObjectId;
    message: string;
    borrowedAt: Date;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
