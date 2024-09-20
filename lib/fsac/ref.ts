export type Ref<T> = { current: T };

export const ref = <T>(current: T): Ref<T> => ({ current });
