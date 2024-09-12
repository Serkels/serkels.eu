//
import { faker } from "@faker-js/faker";

//

export function faker_image_avatar() {
  return faker.helpers.arrayElement([
    faker.image.avatarGitHub,
    faker.image.urlLoremFlickr,
    faker.image.urlPicsumPhotos,
    () =>
      faker.image.urlPlaceholder({
        width: 256,
        height: 256,
      }),
  ])();
}
