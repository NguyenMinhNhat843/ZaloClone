import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';
import * as dotenv from 'dotenv';
import { Readable } from 'stream';
dotenv.config(); // Load các biến môi trường từ file .env

@Injectable()
export class CloundinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUNDINARY_NAME,
      api_key: process.env.CLOUNDINARY_API_KEY,
      api_secret: process.env.CLOUNDINARY_API_SECRET,
    });
  }

  async uploadFileByMultiformData(
    file: Express.Multer.File,
    folder: string = 'ZaloClone/chat_uploads',
    userId,
  ): Promise<{ url: string; type: string; size: number }> {
    return new Promise((resolve, reject) => {
      // console.log('file', file); // log ra đc
      if (file.size > 10 * 1024 * 1024) {
        return reject(new Error('Giới hạn file là 10MB'));
      }

      const extension = file.originalname.split('.').pop()?.toLowerCase();
      const baseName = file.originalname.split('.').slice(0, -1).join('.');
      const publicId = `${baseName}_${userId}${extension ? '.' + extension : ''}`;
      const mime = file.mimetype.toLowerCase();

      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          public_id: publicId,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(new Error('Không thể upload file lên Cloudinary'));

          let type: string;

          if (result.resource_type === 'image') {
            type = 'image';
          } else if (result.resource_type === 'video') {
            type = 'video';
          } else {
            if (
              ['docx', 'doc'].includes(extension || '') ||
              mime.includes('msword') ||
              mime.includes('wordprocessingml')
            ) {
              type = 'word';
            } else if (
              ['xlsx', 'xls'].includes(extension || '') ||
              mime.includes('spreadsheetml') ||
              mime.includes('excel')
            ) {
              type = 'excel';
            } else if (extension === 'txt' || mime === 'text/plain') {
              type = 'text';
            } else {
              type = 'file';
            }
          }

          resolve({ url: result.secure_url, type, size: file.size });
        },
      );

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(upload);
    });
  }

  // ======================= Xóa file trên Cloudinary =======================
  async deleteFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
