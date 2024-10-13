import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Book, BookDocument } from 'src/schemas/Book.schema';
import { CreateBookDto } from './dto/CreateBook.dto';
import { UserDocument, User } from 'src/schemas/User.schema';
import { UsersService } from 'src/users/users.service';
import { OpenAI } from 'openai';

@Injectable()
export class BooksService {
  private openai: OpenAI;

  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    private usersService: UsersService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getBookRecommendations(userInput: string): Promise<string[]> {
    try {
      console.log('getbookrecommendation is called');
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Recommend the top 3 books based on the following input: ${userInput}`,
          },
        ],
        max_tokens: 200,
        n: 1,
      });

      const recommendations = response.choices[0].message.content
        .trim()
        .split('\n')
        .filter(Boolean);
      return recommendations.slice(0, 3);
    } catch (error) {
      if (error.code === 'insufficient_quota') {
        console.error(
          'Rate limit exceeded or insufficient quota. Please check your OpenAI plan and billing.',
        );
        throw new Error(
          'Rate limit exceeded. Please try again later or upgrade your plan.',
        );
      } else {
        console.error('An unexpected error occurred:', error);
        throw new Error(
          'An error occurred while fetching book recommendations. Please try again later.',
        );
      }
    }
  }

  async createBook(createBookDto: CreateBookDto, userId: string) {
    try {
      const newBook = new this.bookModel({
        ...createBookDto,
        previousOwners: [userId],
        currentOwner: userId,
        firstDonator: userId,
        isbn: createBookDto.isbn,
      });
      return await newBook.save();
    } catch (error) {
      console.log('error here is', error);
    }
  }

  async findBooksByIsbn(isbn: string): Promise<BookDocument[]> {
    return this.bookModel.find({ isbn });
  }

  getBooks() {
    return this.bookModel.find();
  }

  getBookById(id: string) {
    return this.bookModel.findById(id);
  }

  async deleteBook(id: string, userId: string) {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new HttpException('Book not found1', HttpStatus.NOT_FOUND);
    }

    if (book.currentOwner.toString() !== userId) {
      throw new HttpException(
        'You can only cancel your own donation',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.bookModel.findByIdAndDelete(id);
  }

  async passBook(bookId: string, newOwnerId: string) {
    const book = await this.bookModel.findById(bookId);
    if (!book) {
      throw new HttpException('Book not found2', HttpStatus.NOT_FOUND);
    }

    book.currentOwner = new Types.ObjectId(newOwnerId);

    const borrowerId = new Types.ObjectId(newOwnerId);
    const borrowedAt = new Date();

    for (const ownerId of book.previousOwners) {
      const user = await this.usersService.getUserById(ownerId.toString());

      if (user) {
        user.notifications.push({
          bookId: book._id as Types.ObjectId,
          borrowerId: borrowerId,
          message: `The book "${book.title}" has been claimed.`,
          borrowedAt: borrowedAt,
        });
        await user.save();
      }
    }

    const originalDonator = await this.usersService.getUserById(
      book.firstDonator.toString(),
    );
    if (originalDonator) {
      originalDonator.points += 10;
      await originalDonator.save();
    }

    return await book.save();
  }

  async addComment(bookId: string, userId: string, comment: string) {
    const book = await this.bookModel.findById(bookId);
    if (!book) {
      throw new HttpException('Book not found3', HttpStatus.NOT_FOUND);
    }

    book.comments.push({ userId: new Types.ObjectId(userId), comment });

    const firstDonator = await this.usersService.getUserById(
      book.firstDonator.toString(),
    );
    if (firstDonator) {
      firstDonator.points += 5;
      await firstDonator.save();
    }

    return await book.save();
  }
}
