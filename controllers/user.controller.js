import { clerkClient } from "@clerk/express";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Activity from "../models/activity.model.js";

export const getUserSavedPosts = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }

  const savedPosts = await Promise.all(
    user.savedPosts.map((postId) => Post.findById(postId).populate("user", "username firstName lastName img"))
  );

  res.status(200).json(savedPosts);
};

export const savePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  const isSaved = user.savedPosts.some((p) => p === postId);

  if (!isSaved) {
    await User.findByIdAndUpdate(user._id, {
      $push: { savedPosts: postId },
    });
  } else {
    await User.findByIdAndUpdate(user._id, {
      $pull: { savedPosts: postId },
    });
  }

  res.status(200).json(isSaved ? "Post has bee unsaved successfully" : "Post has been saved successfully");
};

export const updateUser = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json("User not found!");
  }
  
  

  const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        title: req.body.title,
        bio: req.body.bio,
        fbLink: req.body.fbLink,
        twitterLink: req.body.twitterLink,
        instagramLink: req.body.instagramLink
      },
      { new: true }
    );

    

    const activity = new Activity({message: "User information updated", user: user._id});
  await activity.save();
  
  res.status(200).json(updatedUser);
 
};

export const makeAdmin = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const email = req.body.email;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({email: email });
  

  if (!user) {
    return res.status(404).json("User not found!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role !== "admin") {
    return res.status(403).json("Only admin can do this!");
  }

  const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        role: "admin"
      },
      { new: true }
    );

    if(updateUser) {
      await clerkClient.users.updateUserMetadata(user.clerkUserId, {
        publicMetadata: {
          role: "admin"
        }
      });

      const activity = new Activity({message: "New admin created", user: user._id});
      await activity.save();
    }


  
  res.status(200).json(updatedUser);
 
};

export const removeFromAdmin = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const id = req.body.id;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role !== "admin") {
    return res.status(403).json("Only admin can do this!");
  }

  const user = await User.findById(id);

  

  if (!user) {
    return res.status(404).json("User not found!");
  }

  const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        role: "user"
      },
      { new: true }
    );

    if(updateUser) {
      await clerkClient.users.updateUserMetadata(user.clerkUserId, {
        publicMetadata: {
          role: "user"
        }
      });

      const activity = new Activity({message: "Admin has been removed", user: user._id});
      await activity.save();
    }
  
  res.status(200).json(updatedUser);
 
};

export const getAdmins = async (req, res) => {
  const clerkUserId = req.auth.userId;
  

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";
  
  

  if (role !== "admin") {
    return res.status(403).json("You cannot get the admins!");
  }

  const admins = await User.find({role: "admin"});
  // console.log(admins);
  
  
  res.status(200).json(admins);
 
};

export const getUser = async (req, res) => {
  const clerkUserId = req.auth.userId;
  

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  if(!user) {
    return res.status(403).json("User not found");
  }
  
  
  res.status(200).json(user);
 
};

export const getAllUsers = async (req, res) => {
  const clerkUserId = req.auth.userId;
  

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }
  

  const users = await User.find();

  
  
  
  res.status(200).json(users);
 
};
