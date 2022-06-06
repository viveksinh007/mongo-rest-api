var express = require("express");
const {
  getAllPosts,
  getPost,
  getAllUsersPost,
  deletePost,
  updatePost,
  createPost,
  getpostbytitlesearch
} = require("../controller/postcontroller");
const authenticateUser = require("../middleware/authenticated");

var router = express.Router();

router.route("/").post(authenticateUser, createPost).get(getAllPosts);
router.route("/search/:id").get(getpostbytitlesearch);
router
  .route("/:id")
  .get(authenticateUser, getPost)
  .delete(authenticateUser, deletePost)
  .patch(authenticateUser, updatePost);
router.route("/user/posts").get(authenticateUser, getAllUsersPost);
module.exports = router;
