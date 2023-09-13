import { Entity, Result } from "@1/core/domain";
import type { Category } from "../../category/domain";
import type { Profile } from "../../profile/domain";
import type { Type, TypeProps } from "./Type.value";
export interface Exchange_Props {
    id: number;
    type: Type;
    is_online: boolean;
    when: Date;
    title: string;
    slug: string;
    location?: string;
    available_places: number;
    places: number;
    in_exchange_of: Category | undefined;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    profile: Profile;
    category: Category;
}
export declare class Exchange extends Entity<Exchange_Props> {
    private constructor();
    static create(props: Exchange_Props): Result<Exchange, Error>;
    get profile(): any;
    get updatedAt(): any;
    get title(): any;
    get description(): any;
    get type(): any;
    get is_online(): any;
    get location(): any;
    get category(): any;
    get in_exchange_of(): any;
}
export interface Exchange_CreateProps extends Pick<Exchange_Props, "available_places" | "description" | "is_online" | "location" | "places" | "title"> {
    category: string;
    in_exchange_of?: string | undefined;
    type: TypeProps["value"];
    when: string;
}
//# sourceMappingURL=index.d.ts.map