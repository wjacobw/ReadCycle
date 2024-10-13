import {
  Controller,
  Post,
  Body,
  Req,
  HttpException,
  HttpStatus,
  Delete,
  Get,
  Param,
  UseGuards,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/CreateBook.dto';
import { Request } from 'express';
import { UserDocument } from 'src/schemas/User.schema';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user.interface';
import { Types } from 'mongoose';

@Controller('books')
export class BooksController {
  usersService: any;
  constructor(
    private booksService: BooksService,
    private jwtService: JwtService,
  ) {}

  @Get('recommend')
  async getRecommendations(@Query('input') input: string) {
    if (!input) {
      throw new HttpException('Input is required', HttpStatus.BAD_REQUEST);
    }

    const recommendations =
      await this.booksService.getBookRecommendations(input);
    return recommendations;
  }

  @Post('donate')
  async donateBook(
    @Body() createBookDto: CreateBookDto,
    @Req() req: RequestWithUser,
  ) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new HttpException('Unauthorized', 401);
      }

      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken) {
        throw new HttpException('Invalid token', 401);
      }

      const userId = decodedToken['sub'];

      return this.booksService.createBook(createBookDto, userId);
    } catch (error) {
      console.log('errorrr', error);
    }
  }

  @Get('user/:ownerId')
  async getOwner(@Param('ownerId') ownerId: string) {
    const user = await this.usersService.getUserById(ownerId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  // @Post('map-user-ids-to-emails')
  // async mapUserIdsToEmails(@Body('userIds') userIds: string[]) {
  //   try {
  //     const objectIds = userIds.map((id) => new Types.ObjectId(id));
  //     const userMap = await this.booksService.mapUserIdsToEmails(objectIds);
  //     return userMap;
  //   } catch (error) {
  //     throw new HttpException(
  //       'Failed to map user IDs to emails',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  @Get()
  getBooks() {
    return this.booksService.getBooks();
  }

  @Get('search')
  async searchBooksByIsbn(
    @Query('isbn') isbn: string,
    @Req() req: RequestWithUser,
  ) {
    if (!isbn) {
      throw new HttpException('ISBN is required', HttpStatus.BAD_REQUEST);
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const books = await this.booksService.findBooksByIsbn(isbn);

    if (!books || books.length === 0) {
      throw new HttpException(
        'No books found with that ISBN',
        HttpStatus.NOT_FOUND,
      );
    }

    const userId = decodedToken['sub'];
    const booksNotOwnedByUser = books.filter(
      (book) => book.currentOwner.toString() !== userId,
    );
    return booksNotOwnedByUser;
  }

  @Get(':id')
  async getBookById(@Param('id') id: string) {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new HttpException('Book not found11', 404);
    const findBook = await this.booksService.getBookById(id);
    if (!findBook) throw new HttpException('Book not found2', 404);
    return findBook;
  }

  @Post('claim/:id')
  async claimBook(@Param('id') bookId: string, @Req() req: RequestWithUser) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException();
      }

      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      const userId = decodedToken['sub'];

      const isValid = mongoose.Types.ObjectId.isValid(bookId);
      if (!isValid) throw new HttpException('Invalid Book ID', 400);
      const book = await this.booksService.getBookById(bookId);
      if (!book) {
        throw new HttpException('Book not found3', HttpStatus.NOT_FOUND);
      }
      return await this.booksService.passBook(bookId, userId);
    } catch (error) {
      console.error('Error claiming book:', error);
      throw new HttpException(
        'Could not claim book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string, @Req() req: Request) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        throw new HttpException('Unauthorized', 401);
      }

      const decodedToken = this.jwtService.decode(token);
      if (!decodedToken) {
        throw new HttpException('Invalid token', 401);
      }

      const userId = decodedToken['sub'];

      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) throw new HttpException('Invalid Book ID', 400);

      const deletedBook = await this.booksService.deleteBook(id, userId);
      if (!deletedBook) throw new HttpException('Book not found4', 404);

      return { message: 'Book deleted successfully' };
    } catch (error) {
      console.log('Error while deleting book:', error);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
