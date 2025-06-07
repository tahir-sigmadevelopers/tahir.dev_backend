import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({
    title: String,
    author: {
        type: String,
        default:"Mohammad Tahir"
    },
    shortDescription: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    image: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
            required: true
        }
    }
})


const Blog = mongoose.model("blog", blogSchema)


export default Blog