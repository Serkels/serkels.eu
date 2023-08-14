//

// from https://stackoverflow.com/questions/57120625/typescript-data-object-class-with-object-assign-properties-from-constructor-ar
class _ViewModel<T> {
  constructor(props: T) {
    Object.assign(this, props);
  }
}

export type BasicOpenApiViewModel<T> = _ViewModel<T> & T;
export const BasicOpenApiViewModel = _ViewModel as new <T>(
  props: T,
) => BasicOpenApiViewModel<T>;
