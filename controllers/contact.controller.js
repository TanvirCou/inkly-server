import Contact from "../models/contact.model.js";
import Activity from "../models/activity.model.js";

export const createContact = async (req, res) => {
  const userId = req.body.id;

  
    const newContact = new Contact({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message
    });
  
    const savedContact = await newContact.save();
    

      const activity = new Activity({message: "New contact inquiries created", user: userId && userId});
      await activity.save();

      
  
  
    
  
    res.status(201).json(savedContact);
  };


  export const getContactInquiries = async (req, res) => {
    const clerkUserId = req.auth.userId;
    
  
    if (!clerkUserId) {
      return res.status(401).json("Not authenticated!");
    }
  
    const role = req.auth.sessionClaims?.metadata?.role || "user";
    
    
  
    if (role !== "admin") {
      return res.status(403).json("You cannot get the admins!");
    }
  
    const inquiries = await Contact.find().sort({ createdAt: -1 });;

    
    
    
    res.status(200).json(inquiries);
   
  };