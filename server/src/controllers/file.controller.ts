import { Controller, Delete, Param, Post, Body, Get, UseInterceptors, UploadedFile, ParseIntPipe, Res } from '@nestjs/common';
import { FileService } from '../services/file.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FileService) { }

    @Delete(':id')
    async deleteFile(@Param('id') id: string) {
        const fileId = parseInt(id, 10);

        if (isNaN(fileId)) {
            throw new Error('Invalid file ID');
        }

        return await this.filesService.deleteFile(fileId);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('userId') userId: string) {
        const allowedMimeTypes = [
            'application/vnd.ms-excel',                      // .xls
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',  // .xlsx
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error('Only Excel files are allowed');
        }
        const userIdNumber = parseInt(userId, 10);
        const savedFile = await this.filesService.saveFile(userIdNumber, file);
        console.log('File uploaded successfully:', savedFile);
        return { message: 'File uploaded successfully', file: savedFile };
    }

    @Get(':id/customers')
    getCustomersByFileId(@Param('id') id: number) {
        return this.filesService.getCustomersByFileId(id);
    }

    @Get('user/:userId')
    async getFilesByUserId(@Param('userId', ParseIntPipe) userId: number) {
        const files = await this.filesService.getFilesByUserId(userId);

        if (!files) {
            throw new Error(`No files found for user with ID ${userId}`);
        }

        return files;
    }

    @Get('download/:id')
    async downloadFile(@Param('id') id: string, @Res() res: Response) {
        const fileId = parseInt(id, 10);
        if (isNaN(fileId)) {
            throw new Error('Invalid file ID');
        }

        const filePath = await this.filesService.downloadFile(fileId);
        res.set({
            'Content-Type': 'application/octet-stream',
        });
        res.download(filePath, (err: any) => {
            if (err) {
                throw new Error('Error occurred while downloading the file');
            }
        });
    }
}
