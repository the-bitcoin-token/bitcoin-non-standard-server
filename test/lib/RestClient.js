// @flow
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true, "allow": ["_unwrap", "_get", "_post", "_options"] }] */
import axios from 'axios'

require('dotenv').config()

declare var process: {
  env: {
    PORT: string
  }
}

const UN_P2SH_URL = `http://localhost:${process.env.PORT}`

type DataOutputsType = {|
  txId: string,
  outputData: string
|}

/**
 * Executes an axios request and unwraps either the resulting response or error.
 * Throws an Error if communication with the server fails or if the
 * request results in an error status code.
 *
 * @throws {Error}
 */
export const _unwrap = async (request: Promise<any>): Promise<any> => {
  try {
    const response = await request
    return response
  } catch (error) {
    if (error.response) {
      const { status, statusText, data } = error.response
      const message =
        data.error || (data.indexOf('Code:') !== -1 ? data : statusText)
      throw new Error(
        `${statusText}. Failed with status ${status}. Txo: ${message}.`
      )
    } else {
      throw new Error('Service unavailable.')
    }
  }
}

/**
 * Executes a get request to the given route. Throws an Error if the
 * request or the communication fails.
 *
 * @throws {Error}
 */
export const _get = async (route: string, baseUrl: string): Promise<any> =>
  _unwrap(axios.get(`${baseUrl}${route}`))

/**
 * Executes an options request to the given route. Throws an Error if the
 * request or the communication fails.
 *
 * @throws {Error}
 */
export const _options = async (route: string, baseUrl: string): Promise<any> =>
  _unwrap(axios.options(`${baseUrl}${route}`))

/**
 * Executes a post request to the given route with the given data as body.
 * Throws an Error if the request or the communication fails.
 *
 * @returns {*}
 * @throws {Error}
 */
export const _post = async (
  route: string,
  data: Object,
  baseUrl: string
): Promise<any> => _unwrap(axios.post(`${baseUrl}${route}`, data))

export const getOptions = async (route: string) => _options(route, UN_P2SH_URL)

export const postDataOutputs = async (data: DataOutputsType) =>
  _post('/', data, UN_P2SH_URL)

export const getDataOutputs = async (txId: string) =>
  _get(`/un-p2sh/${txId}`, UN_P2SH_URL)

export const getTokenUtxos = async (publicKey: string) =>
  _get(`/txos/${publicKey}`, UN_P2SH_URL)

export const setTxoSpent = async (txId: string, vOut: number) =>
  _post(`/txos/set-spent/`, { txId, vOut }, UN_P2SH_URL)
