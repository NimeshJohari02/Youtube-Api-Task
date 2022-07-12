const router = require("express").Router();
const fetchFromYt = require("../controller/fetchFromYt");
router.get("/", (req, res) => {
  res.send("API is working");
});

let currTime = "2022-07-12T00:00:00Z";

router.get("/getInfo", async (req, res) => {
  const [data, err] = await fetchFromYt(currTime);
  if (err) {
    res.status(500).send(err);
  }
  //   console.log(data);
  //   get video title desc publishing date time and thumbnail
  res.send(data);
  data["items"].forEach((element) => {
    //Access Snippet data from element
    const { publishedAt, title, description } = element.snippet;
    const { url } = element.snippet.thumbnails.high;
    console.log(url);
  });
  currTime = data.items[data.items.length - 1].snippet.publishedAt;
});

module.exports = router;
