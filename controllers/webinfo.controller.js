import Webinfo from "../models/webinfo.model.js";
import Activity from "../models/activity.model.js";
import User from "../models/user.model.js";

export const updateInfo = async (req, res) => {
    const clerkUserId = req.auth.userId;
    const title = req.body.title;
    const desc = req.body.desc;
    const id = req.body.id;
  
    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }

    const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json("User not found!");
  }
  
    const role = req.auth.sessionClaims?.metadata?.role || "user";
  
    if (role !== "admin") {
      return res.status(403).json("Only admin can do this!");
    }
  
    const info = await Webinfo.findById(id);
  
    if (!id || !info) {
        const newInfo = new Webinfo({title, desc});
        await newInfo.save();

        const activity = new Activity({message: "Website information added", user: user._id});
        await activity.save();

        res.status(200).json("Info Created!");
        return
    }
  
    const updatedInfo = await Webinfo.findByIdAndUpdate(
        id,
        {
          title,
          desc
        },
        { new: true }
      );

      const activity = new Activity({message: "Website information updated", user: user._id});
        await activity.save();
  
      
    
    res.status(200).json(updatedInfo);
   
  };


  export const getInfo = async (req, res) => {
  
    const info = await Webinfo.find();
    // console.log(admins);
    
    
    res.status(200).json(info[0]);
   
  };