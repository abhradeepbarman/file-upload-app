const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config()

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String
    },
    tags: {
        type: String
    },
    email: {
        type: String
    }
})


//post middleware



fileSchema.post('save', async function(doc) {
    try {
        //transporter
        //TODO: shift this configuration under config folder 
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        
        //send mail
        const info = await transporter.sendMail({
            from: "Abhra Deep Barman",
            to: doc.email, 
            subject: "New File uploaded on Cloudinary", // Subject line
            html: `<h3>Hey,</h3> 
            <p>File uploaded successfully!</p>
            view here: <a href=${doc.imageUrl}>link</a>`
        })

        console.log("Message sent: ", info.messageId);
    } 
    catch (error) {
        console.log(error);
    }
})


module.exports = mongoose.model("File", fileSchema);