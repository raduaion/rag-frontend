import axios, { AxiosProgressEvent } from "axios"
import { API_ENDPOINT } from "./helpers"
import HTTP_VERB from "./HttpMethod"
import FetchError from "./FetchError"
import { AppDispatch } from "@/redux/store"
import { handleFetchStatusCode } from "@/redux/reducers/accountSlice"
import { FileStatusType } from "@/pages/my-files/MyFilesRom"

/**
 * Content-type application/json
 */
const CONTENT_TYPE_APPLICATION_JSON = "application/json"

/**
 * Api Resquests facade
 *
 * @class ApiResquest
 */
export default class ApiRequest {

  private static parseError = (status: number, message: string) => {

    if (status >= 500) {
      return 'Internal Server Error'
    }
    else {

      let jsonError: any = {}
      try {
        jsonError = JSON.parse(message)
      }
      catch (e) {
        console.warn(e)
      }

      return jsonError.message ?? 'An error occurred!'
    }
  }

  private static fetchApi = async (dispatch: AppDispatch, url: string, method?: string, headers?: HeadersInit, body?: BodyInit | null): Promise<Response> => {

    const resp = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      body
    })

    if (resp.redirected) {
      dispatch(handleFetchStatusCode(302))
      throw new FetchError(302, 'User not authenticated!')
    }
    else if (resp.status === 401) {
      dispatch(handleFetchStatusCode(401))
    }

    if (!resp.ok) {
      const error = await resp.text()
      console.error(resp.status, error)
      throw new FetchError(resp.status, ApiRequest.parseError(resp.status, error))
    }

    return resp
  }

  private static fetchJSON = async (dispatch: AppDispatch, url: string, method: string, body: any, jsonContent: boolean): Promise<any> => {

    const headers: HeadersInit = {
      Accept: CONTENT_TYPE_APPLICATION_JSON
    }

    if (jsonContent) {
      headers['Content-Type'] = CONTENT_TYPE_APPLICATION_JSON
    }

    const resp = await ApiRequest.fetchApi(dispatch, url, method, headers, jsonContent ? JSON.stringify(body) : body)
    return resp.json()
  }

  static getUserInfo = async (dispatch: AppDispatch) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/users/info`,
    HTTP_VERB.GET,
    null,
    false
  )

  static createUser = async (dispatch: AppDispatch, data: any) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/userapproval`,
    HTTP_VERB.POST,
    data,
    true
  )

  static listUsers = async (dispatch: AppDispatch) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/userapproval`,
    HTTP_VERB.GET,
    null,
    false
  )

  static updateUserStatus = async (dispatch: AppDispatch, id: string, status: string) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/userapproval/${id}?status=${status}`,
    HTTP_VERB.POST,
    null,
    false
  )

  static deleteUser = async (dispatch: AppDispatch, id: string) => ApiRequest.fetchApi(
    dispatch,
    `${API_ENDPOINT}/api/userapproval/${id}`,
    HTTP_VERB.DELETE,
    {},
    null
  )

  static listConversations = async (dispatch: AppDispatch) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/conversations`,
    HTTP_VERB.GET,
    null,
    false
  )

  static getConversationById = async (dispatch: AppDispatch, id: string) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/conversations/${id}`,
    HTTP_VERB.GET,
    null,
    false
  )

  static deleteConversation = async (dispatch: AppDispatch, id: string) => ApiRequest.fetchApi(
    dispatch,
    `${API_ENDPOINT}/api/conversations/${id}`,
    HTTP_VERB.DELETE,
    {},
    null
  )

  static addCollections = async (dispatch: AppDispatch, conversationId: string, collectionIds: string[]) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/conversations/${conversationId}/addcollections`,
    HTTP_VERB.POST,
    collectionIds,
    true
  )

  static removeCollection = async (dispatch: AppDispatch, conversationId: string, collectionId: string) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/conversations/${conversationId}/removecollection?collectionId=${collectionId}`,
    HTTP_VERB.POST,
    null,
    false
  )

  static removeAllConversationCollections = async (dispatch: AppDispatch, conversationId: string) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/conversations/${conversationId}/deleteallcollections`,
    HTTP_VERB.POST,
    null,
    false
  )

  static updateConversationTitle = async (dispatch: AppDispatch, conversationId: string, title: string) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/conversations/${conversationId}/updatetitle?title=${encodeURIComponent(title)}`,
    HTTP_VERB.POST,
    null,
    false
  )

  static clearConversationHistory = async (dispatch: AppDispatch, conversationId: string) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/conversations/${conversationId}/clearhistory`,
    HTTP_VERB.POST,
    null,
    false
  )

  static getConversationCollections = async (dispatch: AppDispatch, conversationId: string) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/conversations/${conversationId}/collections`,
    HTTP_VERB.GET,
    null,
    false
  )

  static listIndexes = async (dispatch: AppDispatch, page: number, size: number) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/indexes?page=${page}&size=${size}`,
    HTTP_VERB.GET,
    null,
    false
  )

  static filterIndexes = async (dispatch: AppDispatch, page: number, size: number, isPublicPath: boolean, q?: string, 
  date?: string, dateCmp?: string, state?: string) => {

    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('size', size.toString())
    params.set('publicpath', isPublicPath.toString())

    if (q) {
      params.set('q', q)
    }

    if (date) {
      params.set('date', date)
    }

    if (dateCmp && dateCmp !== 'NONE') {
      params.set('datecmp', dateCmp)
    }

    if (state) {
      params.set('state', state)
    }
 
    return ApiRequest.fetchJSON(
      dispatch,
      `${API_ENDPOINT}/api/indexes/filter?${params.toString()}`,
      HTTP_VERB.GET,
      null,
      false
    )
  }

  static createIndex = async (dispatch: AppDispatch, name: string, files: string[]) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/indexes/create?name=${encodeURIComponent(name)}`,
    HTTP_VERB.POST,
    files,
    true
  )

  static deleteIndex = async (dispatch: AppDispatch, id: string) => ApiRequest.fetchApi(
    dispatch,
    `${API_ENDPOINT}/api/indexes/${id}`,
    HTTP_VERB.DELETE,
    {},
    null
  )

  static publicCollections = async (dispatch: AppDispatch, shared: boolean, page: number, size: number) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/indexes/filter?shared=${shared}&page=${page}&size=${size}`,
    HTTP_VERB.GET,
    null,
    false
  )

  static updateCollectionState = async (dispatch: AppDispatch, indexId: string, shared: boolean) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/indexes/${indexId}/updatestate?shared=${shared}`,
    HTTP_VERB.POST,
    null,
    false
  )

  static deleteCollectionFile = async (dispatch: AppDispatch, indexId: string, fileId: string) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/indexes/${indexId}/files/${fileId}`,
    HTTP_VERB.DELETE,
    null,
    false
  )

  static addCollectionFiles = async (dispatch: AppDispatch, indexId: string, files: string[]) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/indexes/${indexId}/addfiles`,
    HTTP_VERB.POST,
    files,
    true
  )

  static getIndexFiles = async (dispatch: AppDispatch, indexId: string) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/indexes/${indexId}/getfiles`,
    HTTP_VERB.GET,
    null,
    false
  )

  static listFiles = async (dispatch: AppDispatch) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/files/list`,
    HTTP_VERB.GET,
    null,
    false
  )

  static filterFiles = async (dispatch: AppDispatch, page: number, size: number, q?: string, 
  date?: string, dateCmp?: string, status?: FileStatusType, sortBy?: string, sortDir?: string) => {

    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('size', size.toString())

    if (q) {
      params.set('q', q)
    }

    if (date) {
      params.set('date', date)
    }

    if (dateCmp && dateCmp !== 'NONE') {
      params.set('datecmp', dateCmp)
    }

    if (status) {
      params.set('status', status)
    }

    params.set('sortby', sortBy || 'createTime')
    params.set('direction', sortDir || 'DESC')

    return ApiRequest.fetchJSON(
      dispatch,
      `${API_ENDPOINT}/api/files/filter?${params.toString()}`,
      HTTP_VERB.GET,
      null,
      false
    )
  }

  static loadFile = async (dispatch: AppDispatch, name: string) => ApiRequest.fetchJSON(
    dispatch,
    `${API_ENDPOINT}/api/files/${name}`,
    HTTP_VERB.GET,
    null,
    false
  )

  static uploadFiles = async (dispatch: AppDispatch, data: FormData) => ApiRequest.fetchApi(
    dispatch,
    `${API_ENDPOINT}/api/files/upload`,
    HTTP_VERB.POST,
    {},
    data
  )

  static deleteFile = async (dispatch: AppDispatch, id: string) => ApiRequest.fetchApi(
    dispatch,
    `${API_ENDPOINT}/api/files/${id}`,
    HTTP_VERB.DELETE,
    {},
    null
  )

  static submitQuestion = async (dispatch: AppDispatch, data: any) => {

    const resp = await ApiRequest.fetchApi(
      dispatch,
      `${API_ENDPOINT}/api/hermes/query`,
      HTTP_VERB.POST,
      { "Content-Type": CONTENT_TYPE_APPLICATION_JSON },
      JSON.stringify(data)
    )

    if (!resp.body) {
      throw new Error("Readable stream not found in response")
    }

    return resp.body
  }

  /**
   * 
   * The maxRedirects option only works in Node.js
   * @see https://github.com/axios/axios/issues/674#issuecomment-279225530
   * 
   * @param formData 
   * @param setUploadProgress 
   */
  static uploadFilesAxios = async (dispatch: AppDispatch, formData: FormData, setUploadProgress: (p: number) => void) => {

    const originalPathname = `${API_ENDPOINT}/api/files/upload`,

    resp = await axios.post(originalPathname, formData, {
      onUploadProgress: ({ loaded, total = 1 }: AxiosProgressEvent) => {

        const percentCompleted = Math.round((loaded * 100) / total)
        setUploadProgress(percentCompleted)
      },

      withCredentials: true,

      maxRedirects: 0
    })

    if (new URL(resp.request.responseURL).pathname !== originalPathname) {
      dispatch(handleFetchStatusCode(302))
      throw new FetchError(302, 'User not authenticated!')
    }
  }
}
