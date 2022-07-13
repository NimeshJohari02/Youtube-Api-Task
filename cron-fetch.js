const fetchInfo = require("./controller/fetchFromYt");
const { bulkInsert } = require("./utils/elasticHelper");
const cron = require("node-cron");
let currTime = "2022-07-12T02:00:00Z";
cron.schedule("* * * * *", async () => {
  console.log("Inside Cron for ", ++occ);
  const [result, error] = await fetchInfo(currTime);
  if (result) {
    bulkInsert(result);
    currTime = res.items[0].snippet.publishedAt;
  }
  if (error) {
    task.stop();
    console.error(err);
  }
});
