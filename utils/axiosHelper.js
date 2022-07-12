const axios = require("axios");

const axiosHelper = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});
module.exports = axiosHelper;
