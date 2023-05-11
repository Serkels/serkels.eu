//

import { test } from "vitest";
import { given_a_mocked_server, type Ctx } from ".";
import { createApiClient } from "..";

//

const { baseUrl } = given_a_mocked_server();

export const client = createApiClient(baseUrl);

//

test<Ctx>("GET /opportunities", async ({ expect }) => {
  const data = await client.opportunities.all.query();

  await expect(data).toMatchInlineSnapshot(`
    [
      {
        "createdAt": "1969-08-10T03:09:21.422Z",
        "description": "alias",
        "id": 8981842260656128,
        "slug": "accusamus",
        "title": "nam",
        "updatedAt": "1969-12-13T09:37:00.859Z",
      },
      {
        "createdAt": "1969-12-12T18:55:48.339Z",
        "description": "accusamus",
        "id": 4004346394050560,
        "slug": "blanditiis",
        "title": "placeat",
        "updatedAt": "1969-11-29T05:54:02.869Z",
      },
      {
        "createdAt": "1969-11-03T17:41:29.411Z",
        "description": "eius",
        "id": 1452792336089088,
        "slug": "ea",
        "title": "corrupti",
        "updatedAt": "1969-08-27T09:24:37.092Z",
      },
      {
        "createdAt": "1969-10-18T14:56:28.023Z",
        "description": "distinctio",
        "id": 6258989283147776,
        "slug": "temporibus",
        "title": "voluptas",
        "updatedAt": "1969-08-01T08:47:41.116Z",
      },
      {
        "createdAt": "1969-03-08T16:39:10.127Z",
        "description": "error",
        "id": 4647430440091648,
        "slug": "ullam",
        "title": "sequi",
        "updatedAt": "1969-08-27T23:34:10.984Z",
      },
      {
        "createdAt": "1969-03-28T10:30:55.366Z",
        "description": "voluptas",
        "id": 5580889473941504,
        "slug": "non",
        "title": "ut",
        "updatedAt": "1969-06-14T22:23:31.915Z",
      },
      {
        "createdAt": "1969-12-12T02:22:07.474Z",
        "description": "facilis",
        "id": 6974210169634816,
        "slug": "delectus",
        "title": "rem",
        "updatedAt": "1969-11-13T18:31:35.687Z",
      },
      {
        "createdAt": "1969-11-16T01:45:49.224Z",
        "description": "et",
        "id": 5584357758599168,
        "slug": "quas",
        "title": "animi",
        "updatedAt": "1969-12-15T11:41:51.886Z",
      },
      {
        "createdAt": "1969-02-25T07:20:08.173Z",
        "description": "distinctio",
        "id": 8293711167356928,
        "slug": "ducimus",
        "title": "quis",
        "updatedAt": "1969-07-16T02:49:02.467Z",
      },
    ]
  `);
});

//
