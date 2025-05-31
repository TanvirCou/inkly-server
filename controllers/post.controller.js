import 'dotenv/config'
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Activity from "../models/activity.model.js";

export const getPosts = async (req, res) => {
  // const page = parseInt(req.query.page) || 1;
  // const limit = parseInt(req.query.limit) || 2;

  const query = {};

  const cat = req.query.cat;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;

  if (cat) {
    query.category = cat;
  }

  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
  }

  if (author) {
    const user = await User.findOne({ username: author }).select("_id");

    if (!user) {
      return res.status(404).json("No post found!");
    }

    query.user = user._id;
  }

  let sortObj = { createdAt: -1 };

  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;
      case "oldest":
        sortObj = { createdAt: 1 };
        break;
      case "popular":
        sortObj = { visit: -1 };
        break;
      case "trending":
        sortObj = { visit: -1 };
        query.createdAt = {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        break;
    }
  }

  if (featured) {
    query.isFeatured = true;
  }
  

  const posts = await Post.find(query)
    .populate("user", "username firstName lastName img")
    .sort(sortObj)
    // .limit(limit)
    // .skip((page - 1) * limit);

  // const totalPosts = await Post.countDocuments();
  // const hasMore = page * limit < totalPosts;

  // console.log(posts);
  // console.log(totalPosts);
  
  

  res.status(200).json( posts );
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "user",
    "username firstName lastName img title bio fbLink twitterLink instagramLink"
  );
  res.status(200).json(post);
};

export const createPost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  

  // console.log(req.headers);
  // console.log(req.body);

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });
  

  if (!user) {
    return res.status(404).json("User not found!");
  }

  let slug = req.body.title.replace(/ /g, "-").toLowerCase();

  let existingPost = await Post.findOne({ slug });

  let counter = 2;

  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await Post.findOne({ slug });
    counter++;
  }

  const newPost = new Post({ user: user._id, slug, ...req.body });

  const post = await newPost.save();


  const activity = new Activity({message: "New post created", user: user._id});
  await activity.save();

  res.status(200).json(post);
};

export const deletePost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json("User not found!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role === "admin") {
    await Post.findByIdAndDelete(req.params.id);
    const activity = new Activity({message: "Post has been deleted", user: user._id});
    await activity.save();
    return res.status(200).json("Post has been deleted");
  }

  const deletedPost = await Post.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deletedPost) {
    return res.status(403).json("You can delete only your posts!");
  }

  const activity = new Activity({message: "Post has been deleted", user: user._id});
  await activity.save();

  res.status(200).json("Post has been deleted");
};

export const featurePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });
  

  if (!user) {
    return res.status(404).json("User not found!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role !== "admin") {
    return res.status(403).json("You cannot feature posts!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json("Post not found!");
  }

  const isFeatured = post.isFeatured;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      isFeatured: !isFeatured,
    },
    { new: true }
  );

  const activity = new Activity({message: "Post set as featured", user: user._id});
      await activity.save();

  res.status(200).json(updatedPost);
};

export const updatePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });
  
  if (!user) {
    return res.status(404).json("User not found!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json("Post not found!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  

  

  if (role === "admin") {
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        req.body,
        { new: true }
      );

      const activity = new Activity({message: "Post details updated", user: user._id});
      await activity.save();
      
      return res.status(200).json(updatedPost);
    } catch (error) {
      console.log(error);
      
    }

    
  }

  // const user = await User.findOne({ clerkUserId });

  // if (role !== "admin") {
  //   return res.status(403).json("You cannot feature posts!");
  // }

  const isUserPost = post.user._id === user._id;

  if(isUserPost) {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      ...req.body,
      { new: true }
    );

    const activity = new Activity({message: "Post details updated", user: user._id});
      await activity.save();
  
    return res.status(200).json(updatedPost);
  } else {
    return res.status(404).json("This Post is not your!");
  }

  
};

