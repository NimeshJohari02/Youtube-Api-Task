require("dotenv").config();
let idx = 0;
const keyCollection = process.env.YT_KEY.split(",");
const axiosHelper = require("../utils/axiosHelper");
let apiKey = keyCollection[idx];
const fetchInfo = async (lastTime) => {
  try {
    const response = await axiosHelper.get(
      `videos?part=snippet&chart=mostPopular&maxResults=50&regionCode=US&key=${apiKey}&publishedAfter=${lastTime}`
    );
    return [response.data, null];
  } catch (err) {
    apiKey = keyCollection[++idx];
    if (idx <= keyCollection.length) {
      return await fetchInfo();
    } else return [null, err];
  }
};

module.exports = fetchInfo;
