interface Params {
  [key: string]: Object
  method: string
}
type Config = {
  fetchClient: (url: string, params: Object) => any
  fetchParams: (params: Params) => Params
}
type UserConfig = {
  fetchClient?: Config['fetchClient']
  fetchParams?: Config['fetchParams']
}

const defaultConfig: Config = {
  fetchClient: fetch,
  fetchParams: params => {
    delete params.query
    return params
  }
}

export { Params, Config, UserConfig, defaultConfig }
