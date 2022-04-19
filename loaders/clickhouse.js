const ClickHouse = require("@posthog/clickhouse");

const createClickhouseClient = () => {
  return new ClickHouse({
    host: process.env.CLICKHOUSE_HOST,
    port: process.env.CLICKHOUSE_PORT,
  });
};

module.exports = {
  createClickhouseClient,
};
