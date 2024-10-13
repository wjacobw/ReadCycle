import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      
    ]),
    JwtModule.register({}),
  ],
  exports: [MongooseModule, UsersService],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
