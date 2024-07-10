import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Role } from './roles/enitities/roles.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule globally available
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DB_TYPE') as 'postgres', // Ensuring the type is properly cast
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        url: configService.get<string>('DB_CONNECTION_STRING'),
        ssl: configService.get<string>('DB_SSL') === 'true', 
        entities: [User,Role],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService], 
    }),
    UsersModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
