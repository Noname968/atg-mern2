// const mongoose = require("mongoose");

// const PostSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'newuser'
//     },
//     desc: {
//       type: String,
//       max: 500,
//     },
//     img: {
//       type: String,
//     },
//     likes: {
//       type: Array,
//       default: [],
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Post", PostSchema);

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
          user:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'newuser',
          },
          title:{
                    type:String,
                    required:true
          },
          image:{
                    type:String,
                    // required:true
          },
          video:{
                    type:String,
          },
          like:{
                    type:Array,
          },
          dislike:{
                    type:Array,
          },
          comments:[
                    {
                              user:{
                                        type:mongoose.Schema.ObjectId,
                                        required:true
                              },
                              username:{
                                        type:String,
                                        required:true
                              },
                              profile:{
                                        type:String
                              },
                              comment:{
                                        type:String,
                                        required:true
                              }
                    }
          ]
})

module.exports = mongoose.model("Post" , PostSchema);