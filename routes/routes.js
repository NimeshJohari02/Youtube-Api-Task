const router = require("express").Router();
const fetchFromYt = require("../controller/fetchFromYt");
const elasticHelper = require("../utils/elasticHelper");
const { search, getPage, bulkInsert } = elasticHelper;
const { searchVideos } = require("../controller/elasticController");
router.get("/", (req, res) => {
  res.send("API is working");
});

let currTime = "2022-07-12T02:00:00Z";

router.get("/getInfo", async (req, res) => {
  const [data, err] = await fetchFromYt(currTime);
  if (err) {
    res.status(500).send(err);
  }
  res.send(data);
  bulkInsert(data);
});

router.get("/query", async (req, res) => {
  const { query, pageNumber, pageSize } = req.query;
  const { hits, total } = await search(query, pageNumber, pageSize);
  res.send({ hits, total });
});

module.exports = router;
