import { tinyMiddleware } from "./tiny.middle.ware";

export enum ROUTER_TYPE {
    SSE = 1,
    HTTP = 2
}

export class Router {
    path: string = '';
    type: ROUTER_TYPE = ROUTER_TYPE.HTTP; // 0 http, 1 server-side-event
    middles: Function[] = []
}
export const Routers: Router[] = [
    { path: '/stream', type: ROUTER_TYPE.SSE, middles: [ tinyMiddleware.ServerSideEvent ] },
    { path: '/get_data', type: ROUTER_TYPE.HTTP, middles: [ tinyMiddleware.HttpJsonResponse ] }
];