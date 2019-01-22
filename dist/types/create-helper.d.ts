declare type Params = {
    method?: string;
    [key: string]: any;
};
declare type Helper = (params: Object) => [string, Params];
declare const createHelper: (path: string) => Helper;
export { createHelper };
