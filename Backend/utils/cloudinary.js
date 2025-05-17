import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (fileUri, type = "profile") => {
    try {
        // First, create a unique filename
        const timestamp = Date.now();
        const filename = `image_${timestamp}`;

        // Set up the upload options
        const uploadOptions = {
            resource_type: "auto",
            public_id: filename,
            folder: type === "profile" ? "DreamShare/ProfilePicture" : "DreamShare/Posts",
            use_filename: false,
            unique_filename: false,
            overwrite: true
        };

        // Upload the file
        const response = await cloudinary.uploader.upload(fileUri, uploadOptions);

        // If the upload was successful but not in the right folder, try to move it
        if (response.public_id && !response.public_id.includes("DreamShare")) {
            const newPublicId = `${uploadOptions.folder}/${filename}`;
            await cloudinary.uploader.rename(response.public_id, newPublicId);
            response.public_id = newPublicId;
            response.secure_url = response.secure_url.replace(response.public_id, newPublicId);
        }

        return response;
    } catch (error) {
        console.log("Cloudinary upload error:", error);
        throw new Error("Failed to upload to cloudinary");
    }
}

export default uploadToCloudinary;
