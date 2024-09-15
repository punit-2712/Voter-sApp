const { default_type } = require("mime");
const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  party:{
    type:String,
    required:true
  },
  age:{
    type:Number,
    require:true
  },
  votes:[
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        votedAt:{
            type:Date,
            default:Date.now()
        }
    }
  ],
  votecount:{
    type:Number,
    default:0
  }

});

const Candidate = mongoose.model("candidate", candidateSchema);
module.exports = Candidate;
