require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(require("cors")());
app.listen(PORT, () => console.log(`server at ${PORT}`));
