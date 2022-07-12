const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: "http://localhost:9200",
});
const insertIntoElastic = async (data) => {};
