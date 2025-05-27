import { URLPattern } from "next/server";
import { AnyFunction } from "@/interfaces/common";
import { Routers } from "@/constants/router";

export interface IRouter {
  pattern: string;
  private: boolean;
  role: Array<any> | undefined;
  router: string | AnyFunction<string>;
}

export type RouterNames = keyof Routers;
export type RouterResult<N extends RouterNames> = Routers[N]["router"];
export type ArgsRouterFunction<N extends RouterNames, A = RouterResult<N>> = 
  A extends AnyFunction<string> ? Parameters<A>: Array<any>;

export interface URLPatternRouter extends Omit<IRouter, "pattern"> {
  name: RouterNames,
  pattern: URLPattern,
}