import { ValueObject } from "@1/core/domain";
export interface TypeProps {
    value: "proposal" | "research";
}
export declare class Type extends ValueObject<TypeProps> {
    static create(value: TypeProps["value"]): any;
}
//# sourceMappingURL=Type.value.d.ts.map