import Category from "../models/category.model.js";
import Activity from "../models/activity.model.js";
import User from "../models/user.model.js";

export const createCategory = async (req, res) => {
    const clerkUserId = req.auth.userId;
    const label = req.body.label;
  
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

    const value = req.body.label.replace(/ /g, "-").toLowerCase();
  
    const isCatExist = await Category.findOne({value});
  
    if (isCatExist) {
        return res.status(403).json("Category already exist");
    }

    const newCategory = new Category({label, value});

    const savedCategory = await newCategory.save();

    const activity = new Activity({message: "New category created", user: user._id});
  await activity.save();
     
    res.status(200).json(savedCategory);
   
  };


  export const getCategories = async (req, res) => {
  
    const categories = await Category.find();
    // console.log(admins);
    
    
    res.status(200).json(categories);
   
  };


  export const deleteCategory = async (req, res) => {
    const clerkUserId = req.auth.userId;
    const id = req.params.id;
  
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
  
  
    const deletedCategory = await Category.findOneAndDelete({
      _id: id,
    });

    const activity = new Activity({message: "Category has been deleted", user: user._id});
  await activity.save();

  
    res.status(200).json("Comment deleted");
  };