import { createClient } from '../src/create-api-client'

describe('#createClient', () => {
  it('build api client', () => {
    const mockCallback = jest.fn()
    const path = '/foo/:id'
    const getFoo = createClient(path, { fetchClient: mockCallback })

    getFoo({ id: 100 })

    const [url, parmas] = mockCallback.mock.calls[0]

    expect(url).toBe('/foo/100')
    expect(parmas.method).toBe('GET')
  })

  it('use native fetch by default', () => {
    const mockCallback = jest.fn()
    const path = '/foo/:id'
    const getFoo = createClient(path)

    // global.fetch is mocked to throw
    expect(() => {
      getFoo({ id: 100 })
    }).toThrow()
  })

  describe('#config', () => {
    it('return a client creator with config set', () => {
      const mockCallback = jest.fn()
      const createMockClient = createClient.config({
        fetchClient: mockCallback
      })
      const path = 'PUT /bar/:id'
      const getFoo = createMockClient(path)
      getFoo({ id: 200 })

      const [url, parmas] = mockCallback.mock.calls[0]

      expect(url).toBe('/bar/200')
      expect(parmas.method).toBe('PUT')
    })
  })
  describe('#map', () => {
    it('return map of client creator to endpoint', () => {
      const mockCallback = jest.fn()
      const pathMapping = { getFoo: 'PUT /bar/:id', removeBar: 'DELETE /foo/:id' }
      const apiClient = createClient.map(pathMapping, {
        fetchClient: mockCallback
      })
      apiClient.getFoo({ id: 200 })
      apiClient.removeBar({ id: 300 })
      {
        const [url, parmas] = mockCallback.mock.calls[0]

        expect(url).toBe('/bar/200')
        expect(parmas.method).toBe('PUT')
      }
      {
        const [url, parmas] = mockCallback.mock.calls[1]

        expect(url).toBe('/foo/300')
        expect(parmas.method).toBe('DELETE')
      }
    })
  })
})
