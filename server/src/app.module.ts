import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigModule and ConfigService
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UsersController } from './controllers/user.controller';
import { FilesController } from './controllers/file.controller';
import { CustomersController } from './controllers/customer.controller';
import { FileService } from './services/file.service';
import { CustomersService } from './services/customer.service';
import { FileEntity } from './entities/file.entity';
import { Customer } from './entities/customers.entity';
import { Queue } from './entities/queue.entity';
import { FileGateway } from './FileGateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, FileEntity, Customer, Queue],
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([User, FileEntity, Customer, Queue]),
  ],
  controllers: [UsersController, FilesController, CustomersController],
  providers: [UserService, FileService, CustomersService, FileGateway],
})
export class AppModule { }
