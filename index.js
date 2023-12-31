import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000
const Year = new Date().getFullYear();
const Day = new Date().getDate();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d = new Date();
let Month = months[d.getMonth()];
const Today = (`${Day} ${Month} ${Year}`);
console.log(Today);


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//mongoose.connect("mongodb+srv://nalakadinesh:Dinesh532@cluster0.drpwlh1.mongodb.net/todolistDB");
const MONGO_URI = "mongodb+srv://nalakadinesh:Dinesh532@cluster0.drpwlh1.mongodb.net/todolistDB";
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

const Scheme = mongoose.Schema;

const listScheme = new Scheme({
    ItemName : String
})
const userScheme = new Scheme({
    name:String,
    username: String,
    password: String
})

const Item = mongoose.model("Item" , listScheme);
const User = mongoose.model("User",userScheme);

app.get("/list", async (req,res)=>{
    const data = await Item.find({});
    res.render(__dirname + "/index.ejs",{Data: data,Day : Today});
})
app.get("/",(req,res)=>{
    res.render(__dirname+"/Home.ejs");
})
app.get("/log",(req,res)=>{
    res.render(__dirname+"/log.ejs");
})
app.get("/sign",(req,res)=>{
    res.render(__dirname+"/sign.ejs");
})


app.post("/list",async (req,res)=>{
    const newitem = req.body["new"];
    const item = new Item({ItemName:newitem});
    const insert = [item]
    Item.insertMany(insert );
    res.redirect("/list");
})

app.post("/delete", async (req,res)=>{
    await Item.deleteMany();
    res.redirect("/list");
})

app.post("/deleteOne",async (req,res)=>{
    const deleteItem = req.body;
    const id = deleteItem.deletebtn;
    await Item.deleteOne({_id: id});
    res.redirect("/list");
})

app.post("/signUp",(req,res)=>{
    const name = req.body.name;
    const username = req.body.newuser;
    const password = req.body.newPassword;
    const user = new User({name:name,username:username,password:password});
    const insertuser = [user];
    User.insertMany(insertuser);
    //res.redirect(__dirname+"/log.ejs");
})
app.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const findUser = await User.findOne({ username: username });

        if (findUser && findUser.password === password) {
            const data = await Item.find({});
            res.render(__dirname + "/index.ejs", { Data: data, Day: Today });
        } else {
            res.status(401).send("Invalid username or password");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

/*app.listen(port,()=>{
    console.log(`Server running on ${port}`);
})*/
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})

