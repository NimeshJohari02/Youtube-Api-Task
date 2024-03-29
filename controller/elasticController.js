const { search } = require("../utils/elasticHelper");
const searchVideos = async (req, res) => {
  const searchQuery = req.q;
  const pageNumber = req.p;
  const pageSize = req.s;

  try {
    const { hits, total } = await search(searchQuery, pageNumber, pageSize);

    const data = hits.map((doc) => doc._source);
    const hasNext = pageNumber * pageSize < total;
    res
      .status(200)
      .json({ success: true, pageNumber, pageSize, hasNext, total, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
};
module.exports = searchVideos;
