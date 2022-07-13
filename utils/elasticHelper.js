const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: "http://localhost:9200",
});
/*
The bulk API makes it possible to perform many index/delete operations in a single API call. This can greatly increase the indexing speed.
 */
const bulkInsert = async (data) => {
  console.log("bulk insert: ", data);
  await client.indices.create(
    {
      index: "videos",
      body: {
        mappings: {
          properties: {
            id: { type: "string" },
            publishedAt: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            thumbnail: { type: "string" },
          },
        },
      },
    },
    { ignore: [400] }
  );

  const info = data.items
    .map((el) => {
      if (el.kind == "youtube#video")
        return {
          id: el.id,
          publishedAt: el.snippet.publishedAt,
          title: el.snippet.title,
          description: el.snippet.description,
          thumbnail: el.snippet.thumbnails.default.url,
        };
    }) // we need to remove the nulls, returned from map
    .filter((data) => data);
  //save info as json
  const body = info.flatMap((doc) => [{ index: { _index: "videos" } }, doc]);
  const res = await client.bulk({ refresh: true, body });
  console.log(res);
  if (!res.errors) {
    const erroredDocuments = [];
    // The items array has the same order of the dataset we just indexed.
    // The presence of the `error` key indicates that the operation
    // that we did for the document has failed.
    res.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        erroredDocuments.push({
          // If the status is 429 it means that you can retry the document,
          // otherwise it's very likely a mapping error, and you should
          // fix the document before to try it again.
          status: action[operation].status,
          error: action[operation].error,
          operation: body[i * 2],
          document: body[i * 2 + 1],
        });
      }
    });
    // console.trace(erroredDocuments);
  }

  const count = await client.count({ index: "videos" });
  console.log("Insert Count: ", count.count);
};

// Search Using Elastic Search

const search = async (query, pageNumber, pageSize) => {
  pageNumber = parseInt(pageNumber);
  pageNumber = pageNumber || 0;

  pageSize = parseInt(pageSize);
  pageSize = pageSize || 10;

  const result = await client.search({
    index: "videos",
    from: pageSize * (pageNumber - 1),
    size: pageSize,
    sort: "publishedAt:desc",
    body: {
      query: {
        multi_match: {
          query: query,
          fields: ["title", "description"],
          type: "best_fields",
        },
      },
    },
  });
  return result;
  // return { hits: body.hits.hits, total: body.hits.total.value };
};

//
const getPage = async (pageNumber, pageSize) => {
  const response = await client.search({
    index: "videos",
    from: (pageNumber - 1) * pageSize,
    size: pageSize,
    body: {
      query: {
        match_all: {},
      },
    },
  });
  return { hits: response.hits.hits };
};
module.exports = {
  bulkInsert,
  search,
  getPage,
};
