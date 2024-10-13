import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({
    required: true,
    type: [String],
    validate: [
      (val: string[]) => val.length > 0,
      'At least one author required',
    ],
  })
  authors: string[];

  @Prop({ required: true })
  publisher: string;

  @Prop({ required: true })
  publishedDate: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  pageCount: number;

  @Prop({
    required: true,
    type: [String],
    validate: [
      (val: string[]) => val.length > 0,
      'At least one category required',
    ],
  })
  categories: string[];

  @Prop({ required: false })
  averageRating?: number;

  @Prop({ required: false })
  image?: string;

  @Prop({ required: true })
  language: string;

  @Prop()
  isbn: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  previousOwners: Types.ObjectId[];

  @Prop({
    type: [{ userId: { type: Types.ObjectId, ref: 'User' }, comment: String }],
    default: [],
  })
  comments: { userId: Types.ObjectId; comment: string }[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  firstDonator: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  currentOwner: Types.ObjectId;

  @Prop({ default: false })
  readyForDonation: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);
