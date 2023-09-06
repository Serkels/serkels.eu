//

import ModernError from "modern-errors";
import modernErrorsSerialize from "modern-errors-serialize";
export type { ErrorInstance } from "modern-errors";

//

//

export const BaseError = ModernError.subclass("BaseError", {
  plugins: [modernErrorsSerialize],

  serialize: { shallow: true },
});

//

export const NotFoundError = BaseError.subclass("NotFoundError");
export const UnknownError = BaseError.subclass("UnknownError");
export const InputError = BaseError.subclass("InputError");
export const AuthError = BaseError.subclass("AuthError");
export const DatabaseError = BaseError.subclass("DatabaseError");
export const HTTPError = BaseError.subclass("HTTPError");
export const IllegalArgs = BaseError.subclass("IllegalArgsError");

//

export const ViewModelError = BaseError.subclass("ViewModelError");
