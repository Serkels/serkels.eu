//

import { OpenAPIRepository } from "@/app/api/v1";

//

export class ExchangeRepository extends OpenAPIRepository {
  readonly pageSize = 6;

  async load({
    category,
    page,
    search,
  }: {
    category?: string | undefined;
    page?: string | undefined;
    search?: string | undefined;
  }) {
    console.log("> ExchangeRepository.load\n", {
      category,
      page,
      search,
    });
    const data = [
      {
        id: 123,
        attributes: {
          done: false,
          type: "proposal",
          is_online: true,
          when: "2023-08-14T07:11:19.287Z",
          title: "Cours de français tout les niveau",
          slug: "cours-de-francais-tout-les-niveau",
          location: null,
          available_places: 2,
          places: 2,
          in_exchange_of: null,
          description:
            "Dans une licence LEA, vous étudiez deux langues los fige à un niveau égal, le plus souvent l’anglais et une autre langue, mais aussi des matières d’application. (Si vous vous inscrivez à une licence où vous apprenez deux langues autres que l’anglais, vous aurez des cours d’anglais en plus). Le but n’est pas seulement de perfectionner communication…",
          createdAt: "2023-07-26T06:48:56.766Z",
          updatedAt: "2023-08-14T07:11:19.287Z",
          profile: {
            data: {
              id: 8,
              attributes: {
                firstname: "Alexandre",
                lastname: "Mollet",
                university: "Université Paris 8",
              },
            },
          },
          category: {
            data: {
              id: 6,
              attributes: {
                name: "Cours de français",
                slug: "cours-de-francais",
              },
            },
          },
        },
      },
      {
        id: 456,
        attributes: {
          done: false,
          type: "research",
          is_online: false,
          when: "2023-08-14T07:11:19.287Z",
          title: "Cours de français tout les niveau",
          slug: "cours-de-francais-tout-les-niveau",
          location: "Paris",
          available_places: 3,
          places: 5,
          in_exchange_of: null,
          description:
            "Dans une licence LEA, vous étudiez deux langues los fige à un niveau égal, le plus souvent l’anglais et une autre langue, mais aussi des matières d’application. (Si vous vous inscrivez à une licence où vous apprenez deux langues autres que l’anglais, vous aurez des cours d’anglais en plus). Le but n’est pas seulement de perfectionner communication…",
          createdAt: "2023-07-26T06:48:56.766Z",
          updatedAt: "2023-08-14T07:11:19.287Z",
          profile: {
            data: {
              id: 8,
              attributes: {
                firstname: "Sophie",
                lastname: "Dedier",
                university: "Université Paris 11",
              },
            },
          },
          category: {
            data: {
              id: 6,
              attributes: {
                name: "Activités",
                slug: "activites",
              },
            },
          },
        },
      },
      {
        id: 789,
        attributes: {
          done: false,
          type: "proposal",
          is_online: false,
          when: "2023-08-14T07:11:19.287Z",
          title: "Cours d'Anglais niveau avancé",
          slug: "cours-d-anglais-niveau-avance",
          location: "Bordeaux",
          available_places: 1,
          places: 1,
          in_exchange_of: {
            data: {
              id: 6,
              attributes: {
                name: "Activités",
                slug: "activites",
              },
            },
          },
          description:
            "Dans une licence LEA, vous étudiez deux langues los fige à un niveau égal, le plus souvent l’anglais et une autre langue, mais aussi des matières d’application. (Si vous vous inscrivez à une licence où vous apprenez deux langues autres que l’anglais, vous aurez des cours d’anglais en plus). Le but n’est pas seulement de perfectionner communication…",
          createdAt: "2023-07-26T06:48:56.766Z",
          updatedAt: "2023-08-14T07:11:19.287Z",
          profile: {
            data: {
              id: 8,
              attributes: {
                firstname: "Mike",
                lastname: "Manson",
                university: "Université Bordeaux 2",
              },
            },
          },
          category: {
            data: {
              id: 6,
              attributes: {
                name: "Cours de langes",
                slug: "cours-de-langes",
              },
            },
          },
        },
      },
    ];
    const meta = {
      pagination: {
        page: 1,
        pageSize: 6,
        pageCount: 2,
        total: 12,
      },
    };
    return { data, meta };
  }
}
