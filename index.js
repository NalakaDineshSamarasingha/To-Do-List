import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import mongoose from "mongoose";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
const Year = new Date().getFullYear();
const Day = new Date().getDate();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d = new Date();
let Month = months[d.getMonth()];
const Today = (`${Day} ${Month} ${Year}`);
console.log(Today);


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb+srv://nalakadinesh:Dinesh532@cluster0.drpwlh1.mongodb.net/todolistDB");

const Scheme = mongoose.Schema;

const listScheme = new Scheme({
    ItemName : String
})

const Item = mongoose.model("Item" , listScheme);

app.get("/", async (req,res)=>{
    const data = await Item.find({});
    res.render(__dirname + "/index.ejs",{Data: data,Day : Today});
})

app.post("/",async (req,res)=>{
    const newitem = req.body["new"];
    const item = new Item({ItemName:newitem});
    const insert = [item]
    Item.insertMany(insert );
    res.redirect("/");
})

app.post("/delete", async (req,res)=>{
    await Item.deleteMany();
    res.redirect("/");
})

app.post("/deleteOne",async (req,res)=>{
    const deleteItem = req.body;
    const id = deleteItem.deletebtn;
    await Item.deleteOne({_id: id});
    res.redirect("/");
})

app.listen(port,()=>{
    console.log(`Server running on ${port}`);
})

