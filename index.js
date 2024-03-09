//app create
const express = require("express");
const app = express();

//port find
require("dotenv").config();
const port = process.env.PORT || 3000;

//middleware add
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//db connect
const {dbConnect} = require("./config/database");
dbConnect();

//cloudinary connect
const {cloudinaryConnect} = require("./config/cloudinary");
cloudinaryConnect();

//api route mount
const FileUpload = require("./routes/FileUpload");
app.use("/api/v1/upload", FileUpload);

//activate server
app.listen(port, () => {
    console.log(`app is running at ${port}`);
})