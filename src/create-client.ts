import { createHelper } from './create-helper'

type ApiClient = (params: Object) => any
type FetchMapping = { [endpoint: string]: ApiClient }
type PathMapping = { [endpoint: string]: string }

type Config = {
  fetchClient: (url: string, params: Object) => any
  fetchParams: (params: Object) => Object
}
type UserConfig = {
  fetchClient?: Config['fetchClient']
  fetchParams?: Config['fetchParams']
}
type CreateApiClient = (path: string, config?: UserConfig) => ApiClient
type MapCreateClient = (pathMapping: PathMapping, config?: UserConfig) => FetchMapping
type ConfigCreateClient = (userConfig: UserConfig) => CreateClient

interface CreateClient {
  (path: string, config?: UserConfig): ApiClient
  config(config: UserConfig): CreateClient
  map(pathMapping: PathMapping, config?: UserConfig): FetchMapping
}

const defaultConfig: Config = {
  fetchClient: fetch,
  fetchParams: params => params
}

const create: CreateApiClient = (path, _config) => {
  const config: Config = Object.assign({}, defaultConfig, _config)

  const helper = createHelper(path)
  return (data: Object) => {
    const [url, params] = helper(data)
    const { fetchClient, fetchParams } = config
    return fetchClient(url, fetchParams(params))
  }
}

const map: MapCreateClient = (pathMapping, config) => {
  return Object.keys(pathMapping).reduce<FetchMapping>((acc, endpoint) => {
    acc[endpoint] = create(pathMapping[endpoint], config)
    return acc
  }, {})
}

const config: ConfigCreateClient = userConfig => {
  return Object.assign(
    (path: string, options?: Object) => {
      const newOptions = Object.assign({}, userConfig, options)
      return create(path, newOptions)
    },
    {
      config: config,
      map: map
    }
  )
}

const createClient: CreateClient = Object.assign(create, {
  config: config,
  map: map
})

export { createClient }
