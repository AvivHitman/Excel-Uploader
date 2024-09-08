import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'mariadb',
      port: 3306,
      username: 'ezuser',
      password: 'ezpass',
      database: 'excel_upload_tasks',
      entities: [User, FileEntity, Customer, Queue],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([User, FileEntity, Customer, Queue]),
  ],
  controllers: [UsersController, FilesController, CustomersController],
  providers: [UserService, FileService, CustomersService, FileGateway],
})
export class AppModule { }
