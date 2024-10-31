const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");

dotenv.config();

cloudinary.config({
	cloud_name: "doe608i17",
	api_key: "425926411229738",
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

const uploadVideo = async () => {
	try {
		const videoPath = path.join(
			__dirname,
			"..",
			"video",
			"Sonic Landing Background.mp4",
		);
		console.log("Buscando video en:", videoPath);

		if (!fs.existsSync(videoPath)) {
			console.error("El archivo no existe en la ruta:", videoPath);
			return;
		}

		console.log("Archivo encontrado, iniciando subida...");

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
