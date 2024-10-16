import { mongooseConnect } from "@/lib/mongoose";
import { Blog } from "@/models/Blog";

export default async function handle(req, res) {
    
       // If authenticated, connect to MongoDB
    await mongooseConnect();
    
    const { method } = req;


    if (method === 'POST') {
        const { title, slug, description, blogcategory, tags, status } = req.body;

        const productDoc = await Blog.create({
            title, slug, description, blogcategory, tags, status
        })

        res.json(productDoc)
    }

    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Blog.findById(req.query.id));
        } else {
            res.json((await Blog.find()).reverse())
        }
    }


    if (method === 'PUT') {
        const { _id, title, slug, description, blogcategory, tags, status } = req.body;
        await Blog.updateOne({ _id }, {
            title, slug, description, blogcategory, tags, status
        });

        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Blog.deleteOne({ _id: req.query?.id });
            res.json(true)
        }
    }
}


// pages/api/blog.js
// import { mongooseConnect } from "@/lib/mongoose";
// import { Blog } from "@/models/Blog";
// import { getSession } from "next-auth/react";
// import middleware from "@/lib/middleware"; // Import the middleware
// import nextConnect from 'next-connect';

// const handler = nextConnect();

// // Apply the middleware
// handler.use(middleware);

// handler.post(async (req, res) => {
//   await mongooseConnect(); // Connect to MongoDB

//   // Retrieve the session using NextAuth
//   const session = await getSession({ req });

//   if (!session) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const { title, slug, description, blogcategory, tags, status } = req.body;

//   // Validate required fields
//   if (!title || !slug || !description) {
//     return res.status(400).json({ message: 'Title, slug, and description are required' });
//   }

//   try {
//     const blogDoc = await Blog.create({
//       title,
//       slug,
//       description,
//       blogcategory,
//       tags,
//       status
//     });
//     return res.status(201).json(blogDoc);
//   } catch (error) {
//     console.error('Error creating blog post:', error);
//     return res.status(500).json({ message: 'Error creating blog post', error });
//   }
// });

// handler.get(async (req, res) => {
//   await mongooseConnect();

//   try {
//     if (req.query?.id) {
//       // Fetch a single blog by id
//       const blog = await Blog.findById(req.query.id);
//       if (!blog) {
//         return res.status(404).json({ message: 'Blog post not found' });
//       }
//       return res.json(blog);
//     } else if (req.query?.blogcategory) {
//       // Fetch blogs by blog category
//       const blogs = await Blog.find({ blogcategory: req.query.blogcategory });
//       return res.json(blogs.reverse());
//     } else if (req.query?.tags) {
//       // Fetch blogs by tags
//       const blogs = await Blog.find({ tags: req.query.tags });
//       return res.json(blogs.reverse());
//     } else if (req.query?.slug) {
//       // Fetch blogs by slug
//       const blogs = await Blog.find({ slug: req.query.slug });
//       return res.json(blogs.reverse());
//     } else {
//       // Fetch all blogs
//       const blogs = await Blog.find().sort({ createdAt: -1 });
//       return res.json(blogs.reverse());
//     }
//   } catch (error) {
//     console.error('Error fetching blog posts:', error);
//     return res.status(500).json({ message: 'Error fetching blog posts', error });
//   }
// });

// handler.put(async (req, res) => {
//   await mongooseConnect(); // Connect to MongoDB

//   // Retrieve the session using NextAuth
//   const session = await getSession({ req });

//   if (!session) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const { _id, ...updateData } = req.body; // Destructure and gather the rest

//   if (!_id) {
//     return res.status(400).json({ message: 'Blog post ID is required for update' });
//   }

//   try {
//     const updatedBlog = await Blog.findByIdAndUpdate(_id, updateData, { new: true });
//     if (!updatedBlog) {
//       return res.status(404).json({ message: 'Blog post not found' });
//     }
//     return res.json(updatedBlog);
//   } catch (error) {
//     console.error('Error updating blog post:', error);
//     return res.status(500).json({ message: 'Error updating blog post', error });
//   }
// });

// handler.delete(async (req, res) => {
//   await mongooseConnect(); // Connect to MongoDB

//   // Retrieve the session using NextAuth
//   const session = await getSession({ req });

//   if (!session) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   const { id } = req.query;

//   if (!id) {
//     return res.status(400).json({ message: 'Blog post ID required for deletion' });
//   }

//   try {
//     const result = await Blog.deleteOne({ _id: id });
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: 'Blog post not found' });
//     }
//     return res.status(204).json({ message: 'Blog post deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting blog post:', error);
//     return res.status(500).json({ message: 'Error deleting blog post', error });
//   }
// });

// export default handler;
