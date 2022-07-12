const axios = require("axios");
let idx = 0;
const keyCollection = process.env.YT_KEY.split(",");

const apiKey = keyCollection[idx];

const fetchInfo = async (lastTime) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/search`,
      {
        params: {
          part: "snippet",
          type: "video",
          maxResults: 50,
          publishedAfter: lastTime,
          order: "date",
          q: "official",
          apiKey,
        },
      }
    );
    return [response.data, null];
  } catch (err) {
    apiKey = keyCollection[++idx];
    if (idx >= keyCollection.length) {
      idx = 0;
    }
    console.log(err);
    return [null, err];
  }
};