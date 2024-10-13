import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from 'src/schemas/Book.schema';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Book.name,
        schema: BookSchema,
      },
    ]),
    UsersModule,
    JwtModule.register({}),
  ],
  providers: [BooksService],
  controllers: [BooksController],
})
export class BooksModule {}
