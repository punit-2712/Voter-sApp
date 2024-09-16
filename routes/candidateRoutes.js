const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const User=require("../models/user")
const { jwtAuthMiddleware, generateToken } = require("./../jwt");
const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (user.role =="admin") {
      return true;
    }
  } catch (err) {
    return false;
  }
};

router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!await checkAdminRole(req.user.id)) {
      return res.status(403).json({ message: "User has not admin role" });
    }
    const data = req.body;

    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    console.log("Data Saved");
    res.status(200).json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User has not admin role" });
    }
    const candidateID = req.params.candidateID;
    const updatedCandidateData = req.body;
    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: trye,
        runValidators: true,
      }
    );
    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    console.log("Candidate data  updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal serveer Error" });
  }
});

router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "User has not admin role" });
    }
    const candidateID = req.params.candidateID;

    const response = await Candidate.findByIdAndDelete(candidateID);
    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    console.log("Candidate deleted");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal serveer Error" });
  }
});


//voter abhi 

router.post("/vote/:candidateID", jwtAuthMiddleware,async(req,res)=>{

  const candidateId=req.params.candidateID;
  const userId=req.user.id;
  try{

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }
    if (user.role == "admin") {
      return res.status(403).json({ message: "Admin is not allowed" });
    }

    //update the candidate document after voting 

    candidate.votes.push({user:userId});
    candidate.voteCount++;
    await candidate.save();

    //update the user Document 
    user.isVoted=true;
    await user.save();

  }catch(err){
    

  }


});
module.exports = router;
