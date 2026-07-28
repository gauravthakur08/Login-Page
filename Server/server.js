 const express = require("express");
const app = express();
require('dotenv').config()
const Authroute = require("./routes/auth")
const cors = require("cors");
const  mongoose = require("mongoose");
 app.use(cors())
app.use(express.json());
//Make json data readable to us//
// app.use(express.urlencoded({ extended: true }));
//Make readable the urlecoded data//

app.use("/api/auth",Authroute);


const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{console.log("MONGODB IS CONNECTED");
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
})
.catch((error)=>{
  console.error( "MONGODB ERROR CONNECTION",error.message);
  
});

