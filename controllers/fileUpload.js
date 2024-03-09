const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

exports.localFileUpload = async(req, res) => {
    try {
        //fetch file from request
        const file = req.files.file;  
        console.log("File --> ", file);

        //choose whete to save the file in local machine
        let path = __dirname + "/files/" + Date.now() + "." + file.name.split(".")[1];
        console.log("Path --> ", path);

        //move the file to that directory
        file.mv(path, (err) => {
            console.log(err);
        });

        res.json({
            success: true,
            message: "Local file uploaded successfully"
        })
    } 
    catch (error) {
        console.log(error);
    }
}

function isFileTypeSupported(type, supportedTypes, fileSize) {
    if(supportedTypes.includes(type)) {
        return true;
    }
    else {
        return false;
    }
}

async function uploadFileToCloudinary(file, folder, quality) {
    try {
        const options = {
            folder, 
            resource_type: "auto",
            public_id: file.name,
        }

        if(quality) {
            options.quality = quality;
        }

        return await cloudinary.uploader.upload(file.tempFilePath, options); 
    } catch (error) {
        console.log("Cloudinary upload Error");
    } 
}

exports.imageUpload = async(req, res) => {
    try {
        //data fetch
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File type not supported!"
            })
        }

        //cloudinary upload
        const response = await uploadFileToCloudinary(file, "Codehelp");
        console.log("cloudinary file upload response --> ", response);

        //entry save in db
        const fileData = await File.create({
            name, 
            tags, 
            email, 
            imageUrl: response.url
        })

        res.json({
            success: true,
            message: "Image successfully uploaded"
        })
    } 
    catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong!"
        })
    }
}

exports.videoUpload = async(req, res) => {
    try {
        //data fetch
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;
        console.log(file);

        //validation
        const supportedTypes = ["mp4", "mov", "csv"];
        const fileType = file.name.split(".")[1].toLowerCase();

        //TODO: add a upper limit of 5mb for video
        if(file.size > 5242880 || !isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File type not supported!"
            })
        }

        //cloudinary upload
        const response = await uploadFileToCloudinary(file, "Codehelp");
        console.log("cloudinary file upload response --> ", response);

        //entry save in db
        const fileData = await File.create({
            name, 
            tags, 
            email, 
            imageUrl: response.url
        })

        res.json({
            success: true,
            url: response.url,
            message: "Video successfully uploaded"
        })
    } 
    catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong!"
        })
    }
}

exports.imageReduceUpload = async(req, res) => {
    try {
        //data fetch
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File type not supported!"
            })
        }

        //cloudinary upload
        const response = await uploadFileToCloudinary(file, "Codehelp", 30);
        console.log("cloudinary file upload response --> ", response);

        //entry save in db
        const fileData = await File.create({
            name, 
            tags, 
            email, 
            imageUrl: response.url
        })

        res.json({
            success: true,
            message: "Image successfully uploaded"
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong!"
        })
    }
} 