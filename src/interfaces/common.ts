export type AnyFunction<T extends any = any> = (...args: Array<any>) => T;
export type AnyFunctionAsync<T extends any = any> = (...args: Array<any>) => Promise<T>;