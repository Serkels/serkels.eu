//
debugger;
export default ({ env }) => ({
  connection: {
    client: "sqlite",
    connection: {
      filename: env("DATABASE_FILENAME", ".tmp/test.db"),
    },
    useNullAsDefault: true,
    debug: false,
  },
});
