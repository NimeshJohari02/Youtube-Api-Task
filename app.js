require("dotenv").config();
/*eslint-env es6*/
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const fetchRoutes = require("./routes/routes");
app.use(express.json());
app.use(require("cors")());

/*
1 -> Fetch from YouTube
2 -> Database Add 
3 -> Database Update
4 -> Database Query
*/
app.use("/api", fetchRoutes);

app.listen(PORT, () => console.log(`server at ${PORT}`));
