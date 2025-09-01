import { FileStatus } from "./FileStatus"
import User from "./User"
import DOMPurify from "dompurify"
import { IndexDetails } from "./IndexDetails"
import { Moment } from "moment"
import { FileDetails } from "./FileDetails"
import { NumberComparatorType } from "@/components/NumberComparatorDropdown"
import { MessageStatusEnum } from "./MessageStatusEnum"
import RecentQuestion from "./RecentQuestion"

/**
 * utility functions
 */
const mapToStatus = (status: string): FileStatus => FileStatus[status as keyof typeof FileStatus],

DATE_FORMAT_STR = 'YYYY-MM-DD',

USER_KEY = 'user',

DEFAULT_NAV_SIZE = 10,

DEFAULT_NAV_SIZE_25 = 25,

DEFAULT_NAV_PAGE = 1,

getUserInfo = () : User | null => {

  const data = localStorage.getItem(USER_KEY)

  let user: User | null = null

  if (data) {

    const json = JSON.parse(data)
    user = {
      name: json.name,
      email: json.email,
      link: json.link,
      picture: json.picture,
      status: json.status
    }
  }

  return user
},

/**
 * Fills a zero in front of numbers less than 10
 */
fillingZeroUtility = (nb: number) => (Number(nb) > 0 && Number(nb) < 10) ? `0${ Number(nb) }` : nb,

// ms timeout
delay = async (ms: number) => new Promise(resolve => setTimeout(() => resolve(true), ms)),

API_ENDPOINT = '/api/backend',

ACCEPTED_FILES = ['.pdf', '.docx', '.doc', '.odt', '.pptx', '.xlsx', '.xlsm', '.md', '.txt', '.json', '.png', '.jpg', '.jpeg'],

convertTimestampToLocalDate = (timestampSecond: number, longFormat: boolean) : string =>
  new Date(timestampSecond * 1000).toLocaleString('en-US', longFormat ? {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    } : {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  ),

formatChatMessage = (text?: string) => {

  if (!text) return ""

  // Convert `**bold text**` to `<strong>bold text</strong>`
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // Convert `\n` to `<br />` for line breaks
  formattedText = formattedText.replace(/\n/g, "<br />");

  return DOMPurify.sanitize(formattedText); //
},

publicPaths = [
  '/',
  '/login',
  '/how-it-works',
  '/about',
  '/help',
  '/contact',
  '/privacy-policy',
  '/test',
],

validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
},

/**
 * Remove duplicates from an Array
 */
removeDuplicates = (arr: string[]): string[] => Array.from(new Set(arr)),

getFileStatus = (data: Record<string, string> | null) =>
  mapToStatus((data && data.status ? data.status : 'PENDING').toUpperCase()),

getFileKeywords = (data: Record<string, string> | null ): string =>
  data && data.keywords ? data.keywords : '',

getCollectionKeywords = (data: Record<string, string>, files: FileDetails[]): string => {

  const fileKeys = Object.keys(data),

  keywords: string = files
    .filter(item => fileKeys.includes(item.name))
    .map(item => getFileKeywords(item.metadata))
    .filter(keyword => keyword)
    .join(', ')

  return keywords
},

getFileNameById = (fileId: string, files: FileDetails[]): string =>
  files.find(({ name }) => name === fileId)?.originalName ?? '',

compareDateFilter = (date: Moment, chosenDate: Moment, dateComp: NumberComparatorType) => {
  if (dateComp === 'DIFF') return date.isBefore(chosenDate) || date.isAfter(chosenDate)
  if (dateComp === 'GT') return date.isAfter(chosenDate)
  if (dateComp === 'GTE') return date.isSame(chosenDate) || date.isAfter(chosenDate)
  if (dateComp === 'LT') return date.isBefore(chosenDate)
  if (dateComp === 'LTE') return date.isSame(chosenDate) || date.isBefore(chosenDate)
  if (dateComp === 'EQ') return date.isSame(chosenDate)
  return false
},

/** This is a very long text => This is a very.. */
ellipsisText = (text: string, nb: number) => text.length <= nb ? text : text.substring(0, nb) + '..',

getMessageStatusText = (status: MessageStatusEnum) => {

  switch (status) {

    case MessageStatusEnum.STARTED:
      return 'Processing started'

    case MessageStatusEnum.REPHRASED:
      return 'Rephrased question'

    case MessageStatusEnum.RETRIEVING_INDEX:
      return 'Checking document collections availability'

    case MessageStatusEnum.SEARCHING:
      return 'Retrieved relevant context'

    case MessageStatusEnum.PARTIAL_ANSWER:
      return 'Answering question'

    default: return null
  }
},

filterCollections = (originals: IndexDetails[], searchTerm: string) => originals.filter(({ name }) => {

  const searchT = searchTerm.trim().toLowerCase()
  let searchTextOk = true
  if (searchT) {
    searchTextOk = name.toLowerCase().includes(searchT)
  }
  return searchTextOk
}),

filterRecentQuestions = (originals: RecentQuestion[], searchTerm: string) => originals.filter(({ text }) => {

  const searchT = searchTerm.trim().toLowerCase()
  let searchTextOk = true
  if (searchT) {
    searchTextOk = text.toLowerCase().includes(searchT)
  }
  return searchTextOk
}),

sortCollectionByName = (collections: IndexDetails[]) =>
  collections.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: "base" })),

getTotalSize = (files: FileDetails[]): string => {

  const totalSize = files.reduce((total, file) => total + file.sizeInBytes, 0)

  if (totalSize < 1024) return `${totalSize} Bytes`
  if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(2)} KB`
  if (totalSize < 1024 * 1024 * 1024) return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`
  return `${(totalSize / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export { mapToStatus, getUserInfo, fillingZeroUtility, delay, DEFAULT_NAV_SIZE, DEFAULT_NAV_SIZE_25, DEFAULT_NAV_PAGE,
  API_ENDPOINT, ACCEPTED_FILES, DATE_FORMAT_STR, formatChatMessage, publicPaths,
  validateEmail, removeDuplicates, getFileStatus, getCollectionKeywords, compareDateFilter,
  ellipsisText, getFileNameById, getMessageStatusText, filterCollections, filterRecentQuestions,
  sortCollectionByName, convertTimestampToLocalDate, getTotalSize,
}
