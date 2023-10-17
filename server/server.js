import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import "dotenv/config";
// import bodyParser from "body-parser";

//APP config
const app = express();
const port = process.env.PORT || 8001;
const username = encodeURIComponent(process.env.USER_ID);
const password = encodeURIComponent(process.env.PASSWORD);
const connection_url = `mongodb+srv://${username}:${password}@cluster0.3sv0jkv.mongodb.net/tinderDB`;
// const connection_url = `mongodb://127.0.0.1:27017/tinderDB`;

//Middle Wares
app.use(cors())
app.use(express.json())
// app.use(bodyParser.urlencoded({ extended: false }));

//DB config
// console.log(username, password)
mongoose
  .connect(connection_url, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log("Failed to connect"));

const cardSchema = new mongoose.Schema({
  name: String,
  url: String,
});

const Card = mongoose.model("Card", cardSchema);

const initialCards = [
  {
    name: "Elon Musk",
    url: "https://hips.hearstapps.com/hmg-prod/images/gettyimages-1229892983-square.jpg",
  },
  {
    name: "Jeff Bezos",
    url: "https://images.hellomagazine.com/horizon/43/b5d93baf90fa-jeffbezosyacht.jpg",
  }
];

Card.find()
  .then((data) => {
    console.log("data fetched successfully");
    if (data.length == 0) {
      Card.insertMany(initialCards)
        .then(() => {
          console.log("cards inserted successfully");
        })
        .catch((err) => {
          console.log("error in inserting initial cards");
        });
    }
  })
  .catch((err) => {
    console.log("error in data fetching");
    res.send("Failed to fetch");
  });

//API endpoints
app.get("/", (req, res) => {
  res.send("Hello Clever Programmers");
  // console.log(process.env)
});

app.post("/tinder/cards", (req, res) => {
  res.send(req.body)
//   Card.create(dbCards, (err, data) => {
//     if (err) {
//       console.log("error in creating db");
//       res.status(500).send(err);
//     } else {
//       console.log("db created successfully");
//       res.status(201).send(data);
//     }
//   });
});

app.get("/tinder/cards", (req, res) => {
  Card.find()
    .then((data) => {
      console.log("data fetched successfully");
      // Server
      res.header("Access-Control-Allow-Origin", "*");
      res.send(data);
    })
    .catch((err) => {
      console.log("error in data fetching");
      res.send("Failed to fetch");
    });
});

//Listner
app.listen(port, () => {
  console.log(`Server is listening on localhost : ${port}`);
});
