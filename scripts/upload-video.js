import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Configurar dotenv
dotenv.config();

// Configurar Cloudinary
cloudinary.config({
	cloud_name: "doe608i17",
	api_key: "425926411229738",
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadVideo = async () => {
	try {
		// Usar path.join para construir la ruta del archivo
		const videoPath = join(__dirname, "..", "Sonic Landing Background.mp4");

		const result = await cloudinary.uploader.upload(videoPath, {
			resource_type: "video",
			folder: "video",
			public_id: "background",
		});

		console.log("Video subido exitosamente!");
		console.log("URL del video:", result.secure_url);
	} catch (error) {
		console.error("Error al subir el video:", error);
	}
};

uploadVideo();
