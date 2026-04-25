import postService from "../services/postService.js";
import userRepository from "../repositories/userRepository.js";

class PostController {
    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            res.render("posts", { posts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async showCreateForm(req, res) {
        try {
            const users = await userRepository.findAll();
            res.render("post-form", { post: null, users, action: "/posts", method: "POST" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async create(req, res) {
        try {
            const { userId, title, content, imageUrl, hashtags } = req.body;
            const postData = {
                title,
                content,
                imageUrl,
                hashtags: hashtags ? hashtags.split(",").map(h => h.trim()).filter(h => h) : [],
            };
            await postService.createPost(userId, postData);
            res.redirect("/posts");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async showEditForm(req, res) {
        try {
            const posts = await postService.getPosts();
            const post = posts.find(p => p._id.toString() === req.params.id);
            if (!post) return res.status(404).json({ error: "Post no encontrado" });
            const users = await userRepository.findAll();
            res.render("post-form", { post, users, action: `/posts/${req.params.id}/update`, method: "POST" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { title, content, imageUrl, hashtags } = req.body;
            const postData = {
                title,
                content,
                imageUrl,
                hashtags: hashtags ? hashtags.split(",").map(h => h.trim()).filter(h => h) : [],
            };
            await postService.updatePost(req.params.id, postData);
            res.redirect("/posts");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            await postService.deletePost(req.params.id);
            res.redirect("/posts");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new PostController();
