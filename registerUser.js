const mongoose = require('mongoose');
const userDetailsSchema = new mongoose.Schema(
  {
    //we create the database schema here
    name: String,
    //email: String
    //We want to make each user uniques so we modify the email
    email: { type: String, unique: true },
    lastname: String,
    password: String,

  },
  {
    collection: "userInfo"
  }
)
mongoose.model('userInfo', userDetailsSchema)