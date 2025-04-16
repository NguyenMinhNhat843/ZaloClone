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
      if (file.size > 10 * 1024 * 1024) {
        // Giới hạn 10MB
        throw new Error('Giới hạn file là 10MB');
      }

      // Tạo public_id: tên_gốc_userId.đuôi
      const extension = file.originalname.split('.').pop()?.toLowerCase();
      const baseName = file.originalname.split('.').slice(0, -1).join('.'); // Tên gốc không chứa đuôi
      const publicId = `${baseName}_${userId}${extension ? '.' + extension : ''}`;

      const upload = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto', // Tự động nhận diện image, video, file
          public_id: publicId, // Bao gồm đuôi mở rộng
        },
        (error, result) => {
          if (error) return reject(error);

          // Xác định type chi tiết
          let type: string;
          const extension = file.originalname.split('.').pop()?.toLowerCase();
          const mime = file.mimetype.toLowerCase();

          // Kiểm tra xem result có undefined không
          if (result === undefined) {
            reject(new Error('Không thể upload file lên Cloudinary'));
            return;
          }

          // Kiểm tra loại tệp
          if (result.resource_type === 'image') {
            type = 'image';
          } else if (result.resource_type === 'video') {
            type = 'video';
          } else {
            // Phân loại file raw
            if (
              extension === 'docx' ||
              extension === 'doc' ||
              mime.includes('msword') ||
              mime.includes('wordprocessingml')
            ) {
              type = 'word';
            } else if (
              extension === 'xlsx' ||
              extension === 'xls' ||
              mime.includes('spreadsheetml') ||
              mime.includes('excel')
            ) {
              type = 'excel';
            } else if (extension === 'txt' || mime === 'text/plain') {
              type = 'text';
            } else {
              type = 'file'; // Fallback cho các file khác
            }
          }

          // trả về url và loại tệp
          resolve({ url: result.secure_url, type, size: file.size });
        },
      );

      // Chuyển bufer thành stream
      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null); // Kết thúc stream
      stream.pipe(upload); // Kết nối stream với upload
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
