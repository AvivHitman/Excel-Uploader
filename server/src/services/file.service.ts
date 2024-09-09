import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileEntity } from '../entities/file.entity';
import { User } from '../entities/user.entity';
import { Queue } from '../entities/queue.entity';
import { FileGateway } from '../FileGateway';
import { Customer } from '../entities/customers.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as xlsx from 'xlsx';

@Injectable()
export class FileService {
    private readonly maxConcurrentUploads = 5;
    constructor(
        @InjectRepository(FileEntity)
        private filesRepository: Repository<FileEntity>,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        @InjectRepository(Customer)
        private readonly customerRepository: Repository<Customer>,

        @InjectRepository(Queue)
        private readonly queueRepository: Repository<Queue>,

        private readonly fileGateway: FileGateway

    ) { }

    async deleteFile(fileId: number): Promise<FileEntity> {
        const file = await this.filesRepository.findOne({ where: { f_id: fileId } });

        if (!file) {
            throw new Error(`File with ID ${fileId} not found`);
        }

        const filePath = file.f_path;
        const userDirectory = path.dirname(filePath);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`File ${filePath} deleted successfully.`);
            } else {
                console.warn(`File ${filePath} not found on disk.`);
            }

            this.deleteDirectoryIfEmpty(userDirectory);

            console.log(`File record with ID ${fileId} and associated customers deleted from the database.`);

            // Delete the file record, which will cascade delete the associated customers
            await this.filesRepository.delete(fileId);
            return file;

        } catch (error) {
            console.error('Error deleting file:', error);
            throw new Error('Failed to delete file');
        }
    }

    async saveFile(userId: number, file: Express.Multer.File): Promise<FileEntity> {
        const pendingDirectory = path.join(__dirname, '..', 'ExcelPending', `user_${userId}`);
        const uploadDirectory = path.join(__dirname, '..', 'ExcelUploads', `user_${userId}`);

        try {
            const user = await this.usersRepository.findOne({ where: { u_id: userId } });
            const isLimitReached = await this.isQueueOnLimit();
            const fileStatus = isLimitReached ? "pending" : "uploading";

            if (!user) {
                throw new Error('User not found');
            }

            const uniqueFilePath = this.generateUniqueFilePath(isLimitReached ? pendingDirectory : uploadDirectory, file.originalname);

            const newFile = this.filesRepository.create({
                f_path: uniqueFilePath,
                f_name: file.originalname,
                user: user,
                f_status: fileStatus
            });

            const savedFile = await this.filesRepository.save(newFile);
            await this.updateFileStatus(newFile, fileStatus, newFile.user.u_id, newFile.f_id);

            const queueItem = this.queueRepository.create({
                q_status: 'pending',
                file: savedFile,
            });

            await this.queueRepository.save(queueItem);

            if (fileStatus === 'pending') {
                if (!fs.existsSync(pendingDirectory)) {
                    fs.mkdirSync(pendingDirectory, { recursive: true });
                }
                fs.writeFileSync(uniqueFilePath, file.buffer);
            }

            this.processQueue(file.buffer);
            return savedFile;

        } catch (error) {
            throw new Error(`Failed to save file. error: ${error}`);
        }
    }

    async getCustomersByFileId(fileId: number): Promise<Customer[]> {
        const file = await this.filesRepository.findOne({
            where: { f_id: fileId },
            relations: ['customers'],
        });
        if (!file) {
            throw new Error('File not found after save');
        }
        return file.customers;
    }

    async getFilesByUserId(userId: number): Promise<FileEntity[]> {
        return await this.filesRepository.find({
            where: { user: { u_id: userId } },
            relations: ['user'],
        });
    }

    async downloadFile(fileId: number): Promise<string> {
        const file = await this.filesRepository.findOne({
            where: { f_id: fileId },
            relations: ['user'],
        });

        if (!file) {
            throw new Error(`File with ID ${fileId} not found`);
        }
        const filePath = path.join(file.f_path);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found on the server`);
        }

        return filePath;
    }


    //helper functions
    private async processExcelFile(fileEntity: FileEntity, filePath: string) {
        try {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const customerData = xlsx.utils.sheet_to_json(sheet);

            for (const data of customerData) {
                const customer = this.customerRepository.create({
                    c_name: data['Name'],
                    c_email: data['Email'],
                    c_israeli_id: data['Israeli ID'],
                    c_phone: data['Phone'],
                    file: fileEntity,
                });

                await this.customerRepository.save(customer);
            }
            console.log('Customer data successfully updated from Excel file.');

        } catch (error) {
            console.error('Error processing Excel file:', error);
            throw new Error('Failed to process Excel file');
        }
    }

    private async processQueue(fileBuffer?: Buffer): Promise<void> {
        const isLimitReached = await this.isQueueOnLimit();
        if (isLimitReached) {
            return;
        }

        const nextInQueue = await this.queueRepository.findOne({
            where: { q_status: 'pending' },
            order: { q_id: 'ASC' },
        });

        if (!nextInQueue) {
            return;
        }

        nextInQueue.q_status = 'uploading';
        await this.queueRepository.save(nextInQueue);

        await this.updateFileStatus(nextInQueue.file, 'uploading', nextInQueue.file.user.u_id, nextInQueue.file.f_id);

        const pendingDirectory = path.join(__dirname, '..', 'ExcelPending', `user_${nextInQueue.file.user.u_id}`);
        const uploadDirectory = path.join(__dirname, '..', 'ExcelUploads', `user_${nextInQueue.file.user.u_id}`);
        const pendingFilePath = path.join(pendingDirectory, path.basename(nextInQueue.file.f_path));

        //if the file is in the pending folder so change his path
        if (fs.existsSync(pendingFilePath)) {
            const uniqueFilePath = this.generateUniqueFilePath(uploadDirectory, nextInQueue.file.f_name);
            fs.renameSync(pendingFilePath, uniqueFilePath);
            nextInQueue.file.f_path = uniqueFilePath;
            this.deleteDirectoryIfEmpty(pendingDirectory);
            await this.filesRepository.save(nextInQueue.file);
        }

        // file uploading - adding the setTimeOut for simulation
        setTimeout(async () => {
            try {
                if (!fs.existsSync(uploadDirectory)) {
                    fs.mkdirSync(uploadDirectory, { recursive: true });
                }

                fs.writeFileSync(nextInQueue.file.f_path, fileBuffer);

                //save customers on DB
                await this.processExcelFile(nextInQueue.file, nextInQueue.file.f_path);

                console.log(`File has been fully uploaded and saved to ${nextInQueue.file.f_path}`);

                // Remove the file from the queue after successful processing
                await this.queueRepository.delete(nextInQueue.q_id);

                await this.updateFileStatus(nextInQueue.file, 'uploaded', nextInQueue.file.user.u_id, nextInQueue.file.f_id);


            } catch (error) {
                console.error(`Failed to process file ${nextInQueue.file.f_name}`, error);
                nextInQueue.q_status = 'pending';
                await this.queueRepository.save(nextInQueue);
            } finally {
                this.processQueue(fileBuffer);  // Continue processing the queue
            }
        }, 5000);
    }

    private async isQueueOnLimit(): Promise<boolean> {
        const currentUploads = await this.queueRepository.count({
            where: { q_status: 'uploading' },
        });

        return currentUploads >= this.maxConcurrentUploads;
    }

    private async updateFileStatus(
        file: FileEntity,
        status: "pending" | "uploading" | "uploaded",
        userId: number,
        fileId: number
    ): Promise<void> {

        file.f_status = status;
        await this.filesRepository.save(file);

        // Emit the status change via WebSocket
        this.fileGateway.emitFileStatusUpdate(userId, fileId, status);
        console.log(`File ${file.f_path} is ${status}`);
    }

    private generateUniqueFilePath(userDirectory: string, originalFileName: string): string {
        const fileExtension = path.extname(originalFileName);
        const uniqueFileName = `${path.basename(originalFileName, fileExtension)}_${uuidv4()}${fileExtension}`;
        const uniqueFilePath = path.join(userDirectory, uniqueFileName);

        return uniqueFilePath;
    }

    private deleteDirectoryIfEmpty(directory: string): void {
        const files = fs.readdirSync(directory);
        if (files.length === 0) {
            fs.rmdirSync(directory);
            console.log(`Deleted empty directory: ${directory}`);
        }
    }
}
