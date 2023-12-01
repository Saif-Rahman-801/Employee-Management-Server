const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.86h0qhu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("WebSolutionsDb");
    const userCollections = database.collection("users");
    const workSheetCollections = database.collection("workSheet");
    const servicesCollections = database.collection("Services");
    const testimonialsCollections = database.collection("testimonials");

    // Services api
    app.get("/services", async (req, res) => {
      const cursor = servicesCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // testimonials api
    app.get("/testimionials", async (req, res) => {
      const cursor = testimonialsCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // users api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollections.insertOne(user);
      res.send(result);
    });
    // Read Data
    app.get("/users", async (req, res) => {
      const cursor = userCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get a specific Data
    app.get("/users/:email", async (req, res) => {
      const mail = req.params.email;
      const query = { email: mail };
      const user = await userCollections.findOne(query);
      res.send(user);
    });

    // Update a Specific Data
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      //   console.log(id, user);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUser = {
        $set: {
          isVerified: user.isVerified,
        },
      };
      const result = await userCollections.updateOne(
        filter,
        updatedUser,
        options
      );
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollections.deleteOne(query);
      res.send(result);
    });

    //  Make hr
    app.put("/hr/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(id, user);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedUser = {
        $set: {
          role: user.role,
          isVerified: user.isVerified,
        },
      };
      const result = await userCollections.updateOne(
        filter,
        updatedUser,
        options
      );
      res.send(result);
    });

    // Worksheet related API
    app.post("/worksheet", async (req, res) => {
      const workSheetData = req.body;
      const result = await workSheetCollections.insertOne(workSheetData);
      res.send(result);
    });

    app.get("/worksheet", async (req, res) => {
      const cursor = workSheetCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/worksheets", async (req, res) => {
      try {
        const { email } = req.query;

        if (!email) {
          return res.status(400).send("Email parameter is required");
        }

        // Find worksheets based on the provided email
        const worksheets = await workSheetCollections.find({ email }).toArray();

        res.send(worksheets);
      } catch (error) {
        console.error("Error retrieving worksheets:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("HEllO WORLD");
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
