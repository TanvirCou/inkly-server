import Activity from "../models/activity.model.js";
import User from "../models/user.model.js";

export const getAllActivities = async (req, res) => {
    const clerkUserId = req.auth.userId;
    
  
    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }
    
  
    const activity = await Activity.find().populate("user", "username firstName lastName img").sort({ createdAt: -1 }).limit(5);
    
    res.status(200).json(activity);
   
  };


  export const getSingleUserActivities = async (req, res) => {
    const clerkUserId = req.auth.userId;
    
  
    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({clerkUserId });
  

  if (!user) {
    return res.status(404).json("User not found!");
  }
    
  
    const activity = await Activity.find({user: user._id}).populate("user", "username firstName lastName img").sort({ createdAt: -1 });
    
    res.status(200).json(activity);
   
  };