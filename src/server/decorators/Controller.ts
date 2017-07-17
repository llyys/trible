import { createRouter, mapRequest } from "~/server/config/controllerManager";

export function Controller(baseUrl?: string | string[]) {
    return (target) => {
        if (baseUrl == null)
            createRouter(target, ["/"]);
        else if (typeof (baseUrl) == "string")
            createRouter(target, [baseUrl]);
        else
            createRouter(target, baseUrl);
    }
}

export function Get(path: string) {
    return (target, propertyName: string) => {
        mapRequest(target, propertyName, "get", path);
    }
}

export function Post(path: string) {
    return (target, propertyName: string) => {
        mapRequest(target, propertyName, "post", path);
    }
}