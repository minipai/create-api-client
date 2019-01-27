import { Params, Config, UserConfig, defaultConfig } from './config'
import { parse, compile } from 'path-to-regexp'

type Helper = (params: Object) => [string, Params]
type CreateHelper = (path: string, config: Config) => Helper

const createHelper: CreateHelper = (path, config = defaultConfig) => {
  const namedParams = parse(path)
    .map((p: any) => p.name)
    .filter(n => n)

  const methodRegex = new RegExp('^(GET|POST|PUT|PATCH|DELETE|HEAD)')
  const methodMatch = path.match(methodRegex)
  const method = (methodMatch && methodMatch[0]) || 'GET'
  const targetPath = path.replace(methodRegex, '').trim()
  const toPath = compile(targetPath)

  return (params: any = {}) => {
    let url = toPath(params)
    if (params.query) {
      url = url + '?' + new URLSearchParams(params.query).toString()
    }
    const newParams: Params = Object.keys(params).reduce<any>((acc, key) => {
      if (namedParams.includes(key)) return acc
      acc[key] = params[key]
      return acc
    }, {})

    newParams.query = params.query
    newParams.method = method

    return [url, config.fetchParams(newParams)]
  }
}

export { createHelper }
