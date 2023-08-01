const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");

// Replace this URL with the URL of your own database.
const mongoUrl =
  "mongodb+srv://omarfsm02:uPH7cxj8JwbjNW5B@masjidomar.mlqpri8.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client
  .connect()
  .then(() => {
    console.log("Connected successfully to MongoDB");

    const db = client.db("MasjidOmar");
    const teamsCollection = db.collection("teams");

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    app.post("/teams", (req, res) => {
      console.log("Hello there3");
      const team = req.body;
      teamsCollection.insertOne(team, (err, result) => {
        if (err) {
          res
            .status(500)
            .send({ message: "Error occurred while registering team." });
        } else {
          res.status(201).send({ message: "Team successfully registered." });
        }
      });
    });

    app.get("/", (req, res) => {
      res.send("Hello, world!");
    });

    app.get("/teams", async (req, res) => {
      console.log("GET /teams request received");

      try {
        console.log("Attempting to execute database query");
        const teams = await teamsCollection.find().toArray();
        console.log("Database query completed");
        console.log("Sending teams response: ", teams);
        res.status(200).send(teams);
      } catch (err) {
        console.error("Error occurred while fetching teams: ", err);
        res
          .status(500)
          .send({ message: "Error occurred while fetching teams." });
      }
    });

    console.log("Hello there");
    app.listen(4000, () => console.log("Server is running on port 4000"));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
