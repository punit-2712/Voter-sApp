const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");

const checkAdminRole=async(userId)=>{
  try{
    const user=await User.findById(userId);
    return user.role=='admin';

  }catch(err){
    return false;
  }

}

const { jwtAuthMiddleware, generateToken } = require("../jwt");
router.post("/", async (req, res) => {
  try {
    if(!checkAdminRole(req.user.id)){
      return res.status(404).json({message:"User has not admin role"});
    }
    const data = req.body;

    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    console.log("Data Saved");
    res.status(200).json({ response: response});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/:candidateID", async (req, res) => {
  try {
    const userId = req.user.id; //jwt se
    const { currentPassword, newPassword } = req.body; //extract from request body

    //Find the user by UserId
    const user = await User.findById(userId);

    //pasword check
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Password is wrong" });
    }
    //Update the user's password
    user.password = newPassword;
    await user.save();
    console.log("Password updated");
    res.status(200).json({ message: "Password Updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal serveer Error" });
  }
});

module.exports = router;
