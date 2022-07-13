const fetchInfo = require("./controller/fetchFromYt");
const axios = require("axios");
const { bulkInsert } = require("./utils/elasticHelper");
let cron = require("node-cron");
let currTime = "2022-07-12T02:00:00Z";
let occ = 0;
cron.schedule("*/10 * * * * *", async () => {
  console.log("Inside Cron for ", ++occ);
  const [res, err] = fetchInfo(currTime);
  if (res) {
    bulkInsert(res);
    currTime = res.items[0].snippet.publishedAt;
  } else if (err) {
    console.log(err);
  }
});
