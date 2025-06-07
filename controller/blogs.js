import Blog from "../models/blog.js"
import cloudinary from 'cloudinary'
import Category from "../models/category.js"

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate("category")

        return res.json({
            success: true,
            blogs
        })
    } catch (error) {
        return res.status(200).json({
            success: false,
            message: error.message
        })
    }
}

export const addNewBlog = async (req, res) => {
    try {
        const { title, category, author, content, shortDescription } = req.body

        console.log(req.body)
        let cloudinaryRes;
        if (req.body.image) {
            cloudinaryRes = await cloudinary.v2.uploader.upload(req.body.image,
                {
                    folder: "NFTs Blogs",
                    crop: "scale",
                },
            );
        }

        const categoryExists = await Category.findOne({ category });
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Category does not exist",
            });
        }
        await Blog.create({
            title, author, content, category: categoryExists, shortDescription, image: {
                public_id: cloudinaryRes.public_id,
                url: cloudinaryRes.secure_url
            }
        })

        return res.status(201).json({
            success: true,
            message: "Blog Created Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const getSingleBlog = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blog.findById(id).populate("category");

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        return res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid blog ID" });
        }

        return res.status(500).json({ error: "Internal server error" });
    }
};





export const updateBlog = async (req, res) => {
    try {
        const { title, category, content, author, shortDescription } = req.body

        const { id } = req.params

        const categoryExists = await Category.findOne({ category });
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: "Category does not exist",
            });
        }

        let blog = await Blog.findById(id)

        let cloudinaryRes;
        if (req.body.image) {
            if (blog.image && blog.image.public_id) {

                let blogImageId = blog.image.public_id

                await cloudinary.v2.uploader.destroy(blogImageId)


                cloudinaryRes = await cloudinary.v2.uploader.upload(req.body.image,
                    {
                        folder: "NFTs Blogs",
                        crop: "scale",
                    },
                );


                blog.image = {
                    public_id: cloudinaryRes.public_id,
                    url: cloudinaryRes.secure_url
                }
                await blog.save()
            }
        }
        blog = await Blog.findByIdAndUpdate(id, {
            title, category: categoryExists, content, author, shortDescription
        })

        await blog.save()
        return res.status(200).json({
            success: true,
            message: "Blog Updated Successfully"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}


export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params

        await Blog.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: "Blog Deleted Successfully"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}