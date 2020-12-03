declare module '*.scss' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.gif' {
  const content: any;
  export default content;
}

declare module 'redux-create-action-types' {
  export type ValuesOf<T extends any[]> = T[number];

  function createTypes<T extends string[]>(
    ...types: T
  ): { [K in ValuesOf<T>]: K };

  export default createTypes;
}

declare module 'react-html-parser';
