import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String
    },
    tag: {
      type: String
    },
    
  },
  { timestamps: true,

    collection: 'blogs', // Specify the collection name here


   },

);

export default mongoose?.models?.Blog || mongoose.model("Blog", BlogSchema);
