//

import path from "path";

//

const root = path.resolve(__dirname, "..", "..", "..");

export default ({ env }) => ({
  connection: {
    client: "sqlite",
    connection: {
      filename: path.resolve(root, env("DATABASE_FILENAME", ".tmp/data.db")),
    },
    useNullAsDefault: true,
  },
});
