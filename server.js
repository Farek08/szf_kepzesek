const express = require("express")
require("dotenv").config()  // A .env fájlt olvassa
const trainings = require("./routes/trainings")


const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on("error", (error) => {
    console.log(error);
});
database.once("connected", () => {
    console.log(`Database Connected ${database.host}`);
});

const app = express()

app.use(express.json())

app.use("/api/trainings", trainings)


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))