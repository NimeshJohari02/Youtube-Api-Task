const router = require("express").Router();
const fetchFromYt = require("../controller/fetchFromYt");
const elasticHelper = require("../utils/elasticHelper");
const { search, getPage, bulkInsert } = elasticHelper;
router.get("/", (req, res) => {
  res.send("API is working");
});

let currTime = "2022-07-12T02:00:00Z";

router.get("/addInfo", async (req, res) => {
  const [data, err] = await fetchFromYt(currTime);
  if (err) {
    res.status(500).send(err);
  }
  bulkInsert(data);
  res.send(data);
});
router.get("/getAllInformationFromElastic", async (req, res) => {
  const data = await getPage(1, 10);
  res.send(data);
});
router.get("/query", async (req, res) => {
  const { query, pageNumber, pageSize } = req.query;
  const { hits, total } = await search(query, pageNumber, pageSize);
  res.send({ hits, total });
});

// For GUI Routes only
router.get("/page", async (req, res) => {
  // getPage
  const result = await getPage(req.pageNumber, req.pageSize);
  res.send(result);
});

module.exports = router;
