require("dotenv").config();
/*eslint-env es6*/
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const fetchRoutes = require("./routes/routes");
const cron = require("node-cron");
app.use(express.json());
app.use(require("cors")());
const fetchInfo = require("./controller/fetchFromYt");
/*
1 -> Fetch from YouTube
2 -> Database Add 
3 -> Database Update
4 -> Database Query
*/
//Configuring Node cron
let occ = 0;
const currTime = "2022-07-12T02:00:00Z";
cron.schedule("*/10 * * * * *", async () => {
  console.log("Inside Cron for ", ++occ);
  const [res, err] = await fetchInfo(currTime);
  //   console.log(res);
  if (res) {
    bulkInsert(res);
    currTime = res.items[0].snippet.publishedAt;
  } else if (err) {
    console.log(err);
  }
});

app.use("/api", fetchRoutes);

app.listen(PORT, () => console.log(`server at ${PORT}`));
