import { Profile } from "../../domain";
export class Profile_Schema_ToDomain {
    build({ id, attributes }) {
        return Profile.create({
            ...attributes,
            id: Number(id),
        });
    }
}
