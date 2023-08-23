//

import ModernError from "modern-errors";
export type { ErrorInstance } from "modern-errors";

//

//

export const BaseError = ModernError.subclass("BaseError");

//

export const UnknownError = BaseError.subclass("UnknownError");
export const InputError = BaseError.subclass("InputError");
export const AuthError = BaseError.subclass("AuthError");
export const DatabaseError = BaseError.subclass("DatabaseError");
export const HTTPError = BaseError.subclass("HTTPError");
export const IllegalArgs = BaseError.subclass("IllegalArgsError");

//

export const ViewModelError = BaseError.subclass("ViewModelError");
