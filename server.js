import express from 'express'
import dotenv from 'dotenv'
import connectDB from './database/db.js'
import projectRouter from './routes/project.js'
import userRouter from './routes/user.js'
import testimonialRouter from './routes/testimonial.js'
import blogRouter from './routes/blogs.js'
import categoryRouter from './routes/category.js'
import adminRouter from './routes/adminRoute.js'
import cors from 'cors'
import cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload'

const app = express()


dotenv.config({
    path: "./config.env"
})

// Add After the Dotenv to Access Environment Vaiables 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


connectDB()

app.use(cors({
    origin: ["https://sigmadevelopers.vercel.app","http://localhost:5173"],
    credentials: true
}))

// It is mandatory, otherwise you will be unable to find the error why the image is not uploading 🤣😥
app.use(fileUpload())

app.use(express.json({ limit: '10mb' }));
app.use(projectRouter)
app.use(userRouter)
app.use(testimonialRouter)
app.use(blogRouter)
app.use(categoryRouter)
app.use(adminRouter)


app.get("/", (req, res) => {
    res.send("Hello World")
})

app.listen(process.env.PORT, () => {
    console.log(`Server is Running on PORT : ${process.env.PORT}`);
})