declare type FetchClient = (params: Object) => any;
declare type FetchMapping = {
    [endpoint: string]: FetchClient;
};
declare type PathMapping = {
    [endpoint: string]: string;
};
declare type WhatwgFetch = (url: string, params: Object) => any;
declare type Config = {
    fetch: WhatwgFetch;
};
interface CreateClient {
    (path: string, config?: Config): FetchClient;
    config(config: Config): CreateClient;
    map(pathMapping: PathMapping, config?: Config): FetchMapping;
}
declare const createClient: CreateClient;
export { createClient };
