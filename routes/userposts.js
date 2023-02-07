const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const userauth = require('../middleware/userauth');

//Create Post
router.post("/", userauth, async (req, res) => {
  try {
    let { title, image, video } = req.body;
    let newpost = new Post({
      title, image, video, user: req.user
    })
    const post = await newpost.save()
    res.status(200).json(post)
  } catch (error) {
    return res.status(500).json("Internal error occured")
  }
})

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update user post
router.put("/update/post/:id", userauth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json("Post does not found")
    };

    post = await Post.findByIdAndUpdate(req.params.id, {
      $set: req.body
    })
    let updatepost = await post.save();
    res.status(200).json(updatepost);
  } catch (error) {
    return res.status(500).json("Internal error occured")
  }
})

//Like
router.put("/:id/like", userauth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.like.includes(req.user.id)) {
      if (post.dislike.includes(req.user.id)) {
        await post.updateOne({ $pull: { dislike: req.user.id } })
      }
      await post.updateOne({ $push: { like: req.user.id } })
      return res.status(200).json("Post has been liked")

    } else {
      await post.updateOne({ $pull: { like: req.user.id } });
      return res.status(200).json("like removed")
    }

  } catch (error) {
    return res.status(500).json("Internal server error ")
  }
})

//Dislike
router.put("/:id/dislike", userauth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.dislike.includes(req.user.id)) {
      if (post.like.includes(req.user.id)) {
        await post.updateOne({ $pull: { like: req.user.id } })
      }
      await post.updateOne({ $push: { dislike: req.user.id } })
      return res.status(200).json("Post has been disliked")
    } else {
      await post.updateOne({ $pull: { dislike: req.user.id } });
      return res.status(200).json("dislike removed")
    }

  } catch (error) {
    return res.status(500).json("Internal server error")
  }

})

//Comment 
router.put("/comment/:id", userauth, async (req, res) => {
  // try {
  const { comment, username, profile } = req.body;
  const comments = {
    user: req.user,
    username,
    comment,
    profile
  }
  const post = await Post.findById(req.params.id);
  post.comments.push(comments);
  await post.save();
  res.status(200).json(post);
  // } catch (error) {
  //       return res.status(500).json("Internal server error")
  // }
})

//Delete post 
router.delete("/delete/:id", userauth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json("Post does not found")
    }
    if (post.user.toString() === req.user) {
      const deletepost = await Post.findByIdAndDelete(req.params.id);
      return res.status(200).json("You post has been deleted")
    } else {
      return res.status(400).json("You are not allowed to delete this post")
    }
  } catch (error) {
    return res.status(500).json("Internal server error")
  }
})

module.exports = router;