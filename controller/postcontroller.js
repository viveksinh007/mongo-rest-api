const createError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Post = require("../models/Post");
const getAllPosts = async (req, res, next) => {
  const posts = await Post.find().populate('createdBy','username').sort("createdAt").limit(10);
  res.status(StatusCodes.OK).json({ posts, count: posts.length });
};

const getPost = async (req, res, next) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;
  const post = await Post.findOne({
    _id: postId,
    createdBy: userId,
  });
  if (!post) {
    throw new NotFoundError(`No post with id ${postId}`);
  }
  res.status(StatusCodes.OK).json({ post });
};

const getAllUsersPost = async (req, res, next) => {
  const {
    user: { userId },
  } = req;
  const posts = await Post.find({
    createdBy: userId,
  });
  res.status(StatusCodes.OK).json({ posts, count: posts.length });
};
const createPost = async (req, res, next) => {
  req.body.createdBy = req.user.userId;
  const post = await Post.create(req.body);
  res.status(StatusCodes.CREATED).json({ post });
};

const updatePost = async (req, res, next) => {
  const {
    body: { title, code, category },
    user: { userId },
    params: { id: postId },
  } = req;

  if (!title || !code || !category) {
    throw new BadRequestError("title , code , category fields must be provide");
  }

  const opts = { new: true, runValidators: true };
  const post = await Post.findOneAndUpdate(
    { _id: postId, createdBy: userId },
    req.body,
    opts
  );

  if (!post) {
    throw new NotFoundError(`No Post with id ${postId}`);
  }

  res.status(StatusCodes.OK).json({ post });
};
const deletePost = async (req, res, next) => {
  const {
    user: { userId },
    params: { id: postId },
  } = req;

  const post = await Post.findOneAndDelete({
    _id: postId,
    createdBy: userId,
  });
  if (!post) {
    throw new NotFoundError(`No Post with id ${postId}`);
  }
  res.status(StatusCodes.OK).send();
};

const getpostbytitlesearch =async(req,res,next)=>{
  const {
    params: { id:posttitle },
  } = req;

  if (!posttitle) {
    throw new BadRequestError("Post Title ,fields must be provide");
  }

  const posts = await Post.find({ "title": { "$regex": posttitle, "$options": "i" }}).populate('createdBy','username').sort("createdAt");
  res.status(StatusCodes.OK).json({ posts, count: posts.length });

}

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getAllUsersPost,
  getpostbytitlesearch
};
