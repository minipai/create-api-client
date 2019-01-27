declare type ApiClient = (params: Object) => any;
declare type FetchMapping = {
    [endpoint: string]: ApiClient;
};
declare type PathMapping = {
    [endpoint: string]: string;
};
declare type Config = {
    fetchClient: (url: string, params: Object) => any;
    fetchParams: (params: Object) => Object;
};
declare type UserConfig = {
    fetchClient?: Config['fetchClient'];
    fetchParams?: Config['fetchParams'];
};
interface CreateClient {
    (path: string, config?: UserConfig): ApiClient;
    config(config: UserConfig): CreateClient;
    map(pathMapping: PathMapping, config?: UserConfig): FetchMapping;
}
declare const createClient: CreateClient;
export { createClient };
