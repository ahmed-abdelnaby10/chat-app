import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'chat-app',
            format: file.originalname.split('.').pop(),
            public_id: file.originalname.split('.')[0],
        };
    }
});

const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0];
    if (fileType === 'image') {
        return cb(null, true);
    } else {
        return cb(new Error('Only images allowed'), false);
    }
};

const uploadImage = () => {
    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: 1024 * 1024 * 2, // 2 MB file size limit
        },
    });
};

export default uploadImage;