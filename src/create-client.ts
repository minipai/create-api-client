import { createHelper } from './create-helper'

type FetchClient = (params: Object) => any
type FetchMapping = { [endpoint: string]: FetchClient }
type PathMapping = { [endpoint: string]: string }
type IFetch = (url: string, params: Object) => any
type Config = {
  fetch: IFetch
}
type CreateFetchClient = (path: string, config?: Config) => FetchClient
type MapCreateClient = (pathMapping: PathMapping, config?: Config) => FetchMapping
type ConfigCreateClient = (defaultOptions: Object) => CreateClient

interface CreateClient {
  (path: string, config?: Config): FetchClient
  config(config: Config): CreateClient
  map(pathMapping: PathMapping, config?: Config): FetchMapping
}

const defaultConfig: Config = {
  fetch: fetch
}

const create: CreateFetchClient = (path, config = defaultConfig) => {
  const helper = createHelper(path)
  return (data: Object) => {
    const [url, params] = helper(data)

    return config.fetch(url, params)
  }
}

const map: MapCreateClient = (pathMapping, config) => {
  return Object.keys(pathMapping).reduce<FetchMapping>((acc, endpoint) => {
    acc[endpoint] = create(pathMapping[endpoint], config)
    return acc
  }, {})
}

const config: ConfigCreateClient = defaultOptions => {
  return Object.assign(
    (path: string, options?: Config) => {
      const newOptions = Object.assign({}, defaultOptions, options)
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
