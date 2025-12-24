import {
    Config,
    RouteParam,
    RouteParamsWithQueryOverload,
    Router,
} from "ziggy-js";

declare global {
    function route(
        name?: string,
        params?: RouteParamsWithQueryOverload | RouteParam,
        absolute?: boolean,
        config?: Config
    ): string | Router;

    interface Window {
        __LINKEA_APP_NAME__: string;
    }
}
