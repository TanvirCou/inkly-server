import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import Activity from "../models/activity.model.js";
import { Webhook } from "svix";
import 'dotenv/config'
import { clerkClient } from "@clerk/express";

export const clerkWebHook = async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  

  if (!WEBHOOK_SECRET) {
    throw new Error("Webhook secret needed!");
  }

  const payload = req.body;
  const headers = req.headers;
  

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;
  try {
    evt = wh.verify(payload, headers);
    
  } catch (err) {
    return res.status(400).json({
      message: "Webhook verification failed!",
    });
  }  

  if (evt.type === "user.created") {
      const newUser = new User({
        clerkUserId: evt.data.id,
        username: evt.data.username,
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        email: evt.data.email_addresses[0].email_address,
        img: evt.data.profile_image_url,
        role: "user"
      });
      
      const savedUser = await newUser.save();
  
      if(savedUser) {
        await clerkClient.users.updateUserMetadata(evt.data.id, {
          publicMetadata: {
            userId: newUser._id,
            role: "user"
          }
        })

        const activity = new Activity({message: "New User created", user: newUser._id});
        await activity.save();
      }
  }

  if (evt.type === 'user.updated') {

    const user = {
      username: evt.data.username,
      firstName: evt.data.first_name,
      lastName: evt.data.last_name,
      email: evt.data.email_addresses[0].email_address,
      img: evt.data.profile_image_url,
    }

    const updatedUser = await User.findOneAndUpdate({ clerkUserId: evt.data.id }, user, { new: true })
    // const activity = new Activity({message: "User information updated", user: updatedUser._id});
    // await activity.save();
  }

  if (evt.type === "user.deleted") {
    const deletedUser = await User.findOneAndDelete({
      clerkUserId: evt.data.id,
    });

    await Post.deleteMany({user:deletedUser._id})
    await Comment.deleteMany({user:deletedUser._id})

    const activity = new Activity({message: "User has been deleted", user: deletedUser._id});
    await activity.save();
  }

  return res.status(200).json({
    message: "Webhook received",
  });
};
