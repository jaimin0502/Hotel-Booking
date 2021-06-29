import express from "express";
import { readdirSync } from 'fs';
import cors from 'cors';
import mongoose from 'mongoose';
const morgan =require('morgan');
require ('dotenv').config();
const app = express();

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.7yeud.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true,
       
    })
    .then(() => console.log('Database connected'))
    .catch((err)=> console.log(err));

readdirSync("./routes").map((r)=>
         app.use("/api",require(`./routes/${r}`)));

const port =process.env.PORT || 5000

app.listen(port,()=>console.log(`Server is running on port ${port}`));