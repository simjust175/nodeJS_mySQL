const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3006;

const clients = require("./routes/clientRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/clients", clients);

app.listen(port, ()=>{
    console.log(`Homework app running on port: ${port}`);
});