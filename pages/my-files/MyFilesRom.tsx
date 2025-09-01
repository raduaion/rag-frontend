import { NumberComparatorType } from "@/components/NumberComparatorDropdown"
import { FileDetails } from "@/libs/FileDetails"
import { FileStatus } from "@/libs/FileStatus"
import { removeFile, resetFilesData, setOriginalFiles, updateFile } from "@/redux/reducers/fileSlice"
import { AppDispatch, RootState } from "@/redux/store"
import { connect } from "react-redux"
import AddFilesToCollection from "./AddFilesToCollection"
import FileDetailsCard from "./FileDetailsCard"
import ConfirmationDialog from "../utils/ConfirmationDialog"
import CustomPagination from "@/components/fragments/CustomPagination"
import NoData from "../collections/NoData"
import FileHeaderSection from "./FileHeaderSection"
import FileListSkeleton from "./FileListSkeleton"
import SearchBar from "@/components/fragments/SearchBar"
import GenericButton from "@/components/fragments/GenericButton"
import FileListItem from "./FileListItem"
import PagedResult from "@/libs/PagedResult"
import { useRouter } from "next/router"
import { usePathname, useSearchParams } from "next/navigation"
import { useAppDispatch } from "@/redux/hooks"
import { useEffect, useRef, useState } from "react"
import useDebounce from "@/hooks/useDebounce"
import ApiRequest from "@/libs/ApiRequest"
import { DEFAULT_NAV_PAGE, DEFAULT_NAV_SIZE_25, fillingZeroUtility } from "@/libs/helpers"
import { DateFilterType, initDateComp } from "@/components/fragments/DateFilter"
import { Alert, Progress } from "flowbite-react"
import { FaExclamationTriangle } from "react-icons/fa"
import FileLeftMenu from "./FileLeftMenu"
import { RiMenu2Line } from "react-icons/ri"
import ConfirmDialog from "@/components/fragments/ConfirmDialog"
import FilterDrawer from "../collections/FilterDrawer"
import { SortDirType } from "./FileSortingComponent"

interface StateProps {
  files: PagedResult<FileDetails>
}

interface DispatchProps {

  doSetFileStore: (data: PagedResult<FileDetails>) => void

  doRemoveFileStore: (name: string) => void

  doResetFilesData: () => void

  doUpdateFileStore: (file: FileDetails) => void
}

type Props = StateProps & DispatchProps

export type FileStatusType = FileStatus | 'ALL'

export const FileStatusFilters: FileStatusType[] = [
  'ALL',
  FileStatus.PENDING,
  FileStatus.PROCESSING,
  FileStatus.PROCESSED,
  FileStatus.ERROR
]

const DEFAULT_SORT_BY_NAME = 'createTime'

const MyFilesRom = ({ files, doSetFileStore, doRemoveFileStore, doUpdateFileStore }: Props) => {

  const router = useRouter(),

  pathname = usePathname(),
  
  searchParams = useSearchParams(),

  fileInputRef = useRef<HTMLInputElement>(null),

  dispatch: AppDispatch = useAppDispatch(),

  [loading, setLoading] = useState(false),

  [runningItem, setRunningItem] = useState<string | null>(null),

  [error, setError] = useState<string | null>(null),

  [running, setRunning] = useState<boolean>(false),

  [uploading, setUploading] = useState(false),

  [uploadProgress, setUploadProgress] = useState<number>(0),

  [showConfirmDialog, setShowConfirmDialog] = useState(false),

  [confirmDeleteMany, setConfirmDeleteMany] = useState(false),

  [selectedFiles, setSelectedFiles] = useState<string[]>([]),

  [actionToConfirm, setActionToConfirm] = useState<null | (() => void)>(null),

  [searchText, setSearchText] = useState<string>(''),

  debouncedSearchText = useDebounce(searchText, 800),

  [showFileCard, setShowFileCard] = useState<string | null>(null),

  [sortByFilter, setSortByFilter] = useState<string>(DEFAULT_SORT_BY_NAME),

  [sortDirFilter, setSortDirFilter] = useState<SortDirType>('DESC'),

  [showLeftMenu, setShowLeftMenu] = useState(false),

  [shouldAddFilesToCollection, setShouldAddFilesToCollection] = useState(false),

  [addFileToCollection, setAddFileToCollection] = useState<string | null>(null),

  [dateFilter, setDateFilter] = useState<DateFilterType>(initDateComp),

  debouncedDateFilter = useDebounce(dateFilter.value, 1000),

  [statusFilter, setStatusFilter] = useState<FileStatusType>('ALL'),

  selectAllClicked = (checked: boolean) => setSelectedFiles(prev => {

    let arrCopy = [...prev]
    arrCopy = arrCopy.filter(item => files.content.findIndex(elt => elt.name === item) === -1)

    if (checked) {
      arrCopy.push(...files.content.map(item => item.name))
    }

    return arrCopy
  }),

  selectItemClicked = (checked: boolean, fileId: string) =>
    setSelectedFiles(prev => checked ? [...prev, fileId] : prev.filter(id => id !== fileId)),

  isItemSelected = (indexId: string): boolean => selectedFiles.includes(indexId),

  canCheckAll = (): boolean => !!files.content.length && 
    files.content.every(item => selectedFiles.findIndex(elt => elt === item.name) > -1),

  resetSelectedFiles = () => setSelectedFiles([]),

  fetchFiles = async (page: number, size: number, status: FileStatusType,
    q: string, date?: string, dateCmp?: string, sortBy?: string, sortDir?: string) => {

    setLoading(true)
    setError(null)

    try {

      const data: PagedResult<FileDetails> = await ApiRequest.filterFiles(
        dispatch, page - 1, size, q, date, dateCmp, status, sortBy, sortDir
      )
      doSetFileStore(data)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setLoading(false)
    }
  },

  doReloadFile = async (fileId: string) => {
  
    setRunningItem(fileId)
    setError(null)

    try {
      const data = await ApiRequest.loadFile(dispatch, fileId)
      doUpdateFileStore(data)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunningItem(null)
    }
  },

  handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  
    if (!event.target.files) return

    const formData = new FormData()
    Array.from(event.target.files).forEach(file => {
      formData.append('files', file)
    })

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {

      await ApiRequest.uploadFilesAxios(dispatch, formData, setUploadProgress)
      refreshRoute()
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {

      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  },

  handleDelete = async (fileId: string) => {
  
    setActionToConfirm(() => async () => {

      setRunningItem(fileId)
      setError(null)

      try {
        await ApiRequest.deleteFile(dispatch, fileId)
        afterFileDeletion(fileId)
      }
      catch (e) {
        console.error(e)
        setError((e as Error).message)
      }
      finally {
        setRunningItem(null)
      }
    })
    setShowConfirmDialog(true)
  },

  handleDeleteFiles = async () => {
  
    setConfirmDeleteMany(false)

    try {

      setRunning(true)
      setError(null)

      for (const i in selectedFiles) {
        await ApiRequest.deleteFile(dispatch, selectedFiles[i])
        doRemoveFileStore(selectedFiles[i])
      }

      // Remove from selection
      resetSelectedFiles()
      navPageChanged(1)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
    }
  },

  // After files deletion
  afterFileDeletion = (fileId: string) => {

    doRemoveFileStore(fileId)
    selectItemClicked(false, fileId)
    navPageChanged(1)
  },

  /**
   * Only update route if the value is different from the current URL param
   * This prevents unnecessary router.push calls on initial load or if user chooses same value
   */
  checkAndRoute = (paramName: string, currentValue: string, shouldReset: boolean, shouldSet: boolean) => {

    const currentParam = searchParams.get(paramName) || ''
    if (currentParam.toLowerCase() !== currentValue.toLowerCase()) {

      const newSearchParams = new URLSearchParams(searchParams.toString())
      if (shouldSet) {
        newSearchParams.set(paramName, currentValue)
      }
      else {
        newSearchParams.delete(paramName)
      }

      if (shouldReset) {
        newSearchParams.delete('page')
      }

      router.push(`${ pathname }${ newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`)
    }
  }

  useEffect(() => {

    if (!router.isReady) {
      return
    }

    const { page: pageParam, size: sizeParam,
      status: statusParam, q: searchParam, 
      date: dateParam, datecmp: dateCmpParam,
      sortby: sortByParam, dir: sortDirParam } = router.query,

    // Page param
    _page = typeof pageParam === 'string' ? Number(pageParam) : DEFAULT_NAV_PAGE,

    // Size param
    _size = typeof sizeParam === 'string' ? Number(sizeParam) : DEFAULT_NAV_SIZE_25

    // Status
    let _status: FileStatusType = 'ALL'
    if (typeof statusParam === 'string') {

      const upParam = statusParam.toUpperCase(),
      statusP = FileStatusFilters.includes(upParam as FileStatusType) ? upParam as FileStatusType : null

      if (statusP) {
        _status = statusP
      }
    }

    if (_status !== statusFilter) {
      setStatusFilter(_status)
    }

    // Search Text
    const _q = typeof searchParam === 'string' ? searchParam : ''
    if (_q !== searchText) {
      setSearchText(_q)
    }

    // SortBy
    const _sortBy = typeof sortByParam === 'string' ? sortByParam : DEFAULT_SORT_BY_NAME
    if (_sortBy !== sortByFilter) {
      setSortByFilter(_sortBy)
    }

    // SortDir
    let _sortDir: SortDirType = 'DESC'
    if (typeof sortDirParam === 'string') {

      const upParam = sortDirParam.toUpperCase(),
      sortDirP = ['ASC', 'DESC'].includes(upParam) ? upParam as SortDirType : null

      if (sortDirP) {
        _sortDir = sortDirP
      }
    }

    if (_sortDir !== sortDirFilter) {
      setSortDirFilter(_sortDir)
    }

    // Date
    let _dateCmp: NumberComparatorType = 'NONE'
    if (typeof dateCmpParam === 'string') {

      const dateCmpP = dateCmpParam.toUpperCase() as NumberComparatorType
      if (dateCmpP) {
        _dateCmp = dateCmpP
      }
    }

    const _date = typeof dateParam === 'string' ? dateParam : ''

    if (_dateCmp !== dateFilter.comparator || _date !== dateFilter.value) {
      setDateFilter({
        value: _date,
        comparator: _dateCmp
      })
    }

    fetchFiles(_page, _size, _status, _q, _date, _dateCmp, _sortBy, _sortDir)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, router.isReady])

  useEffect(() => {

    /** Check debouncedSearchText and update the router */
    checkAndRoute('q', debouncedSearchText, true, !!debouncedSearchText)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText])

  useEffect(() => {

    /** Check debouncedDateFilter and update the router */
    checkAndRoute('date', debouncedDateFilter, true, !!debouncedDateFilter)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDateFilter])

  const closeError = () => setError(null),

  refreshRoute = () => router.push(router.asPath),

  doSearchText = (val: string) => {
    setSearchText(val)
  },

  // Reset all filters
  resetFilters = () => {

    setSearchText('')
    setDateFilter(initDateComp)
    setStatusFilter('ALL')
    setSortByFilter(DEFAULT_SORT_BY_NAME)
    setSortDirFilter('DESC')

    router.push(pathname)
  },

  // Filters
  navPageChanged = (nb: number) => {
    if (loading || running) return
    checkAndRoute('page', nb.toString(), false, nb !== DEFAULT_NAV_PAGE)
  },

  navSizeChanged = (nb: number) => {
    checkAndRoute('size', nb.toString(), true, nb !== DEFAULT_NAV_SIZE_25)
  },
  
  sortByChanged = (val: string) => {

    setSortByFilter(val)
    checkAndRoute('sortby', val.toString(), true, val !== DEFAULT_SORT_BY_NAME)
  },

  sortDirChanged = (val: SortDirType) => {

    setSortDirFilter(val)
    checkAndRoute('dir', val.toLowerCase(), true, val !== 'DESC')
  },

  statusFilterChanged = (val: FileStatusType) => {

    setStatusFilter(val)
    checkAndRoute('status', val.toLowerCase(), true, val !== 'ALL')
  },

  dateComparatorFilterChanged = (cmp: NumberComparatorType) => {

    const tmp = { comparator: cmp, value: dateFilter.value }
    setDateFilter(tmp)
    checkAndRoute('datecmp', cmp.toLowerCase(), true, cmp !== 'NONE')
  },

  dateFilterChanged = (date: string) => {

    const tmp = { comparator: dateFilter.comparator, value: date }
    setDateFilter(tmp)
  },

  closeLeftDrawer = () => setShowLeftMenu(false),

  renderUploadProgress = () => (
    <Progress progress={ uploadProgress } size="xl"
      progressLabelPosition='inside'
      textLabelPosition='inside'
      textLabel='Uploaded'
      labelText
      labelProgress
      className='md:mb-4 mb-3'
    />
  ),

  renderSubHeader = () => <>

    { uploading && renderUploadProgress() }

    { searchText && <p className="text-gray-600 mb-3 md:mb-4">
      Search results for <span className='text-blue-700 font-semibold'>&#171; { searchText } &#187;</span>
    </p>}

    { error && <Alert color="failure" icon={() => <FaExclamationTriangle className="size-5" />}
      onDismiss={ closeError } className="mb-3">&nbsp; { error }
    </Alert>}
  </>,

  leftMenu = <FileLeftMenu
    handleUpload={(event: React.ChangeEvent<HTMLInputElement>) => {
      closeLeftDrawer()
      handleUpload(event)
    }}
    dateComparatorFilterChanged={(v: NumberComparatorType) => {
      closeLeftDrawer()
      dateComparatorFilterChanged(v)
    }}
    dateFilter={ dateFilter }
    dateFilterChanged={(v: string) => {
      closeLeftDrawer()
      dateFilterChanged(v)
    }}
    refresh={() => {
      closeLeftDrawer()
      refreshRoute()
    }}
    resetFilterClicked={() => {
      closeLeftDrawer()
      resetFilters()
    }}
    running={ running || loading }
    statusFilter={ statusFilter }
    statusFilterChanged={(v: FileStatusType) => {
      closeLeftDrawer()
      statusFilterChanged(v)
    }}
    fileInputRef={ fileInputRef }
    uploading={ uploading }
  />,

  fileToShow = showFileCard ? files.content.find(item => item.name === showFileCard) : null

  return (
    <section className="bg-white shadow xl:my-2 rounded max-w-screen-xl mx-auto">

      <div className='lg:flex'>

        <div className='w-60 hidden lg:block flex-shrink-0 pl-4 pr-0.5 py-3 space-y-4'>
          { leftMenu }
        </div>

        <div className='w-full p-3 sm:p-6 sm:pt-4 xl:max-w-[calc(1280px-240px)] lg:max-w-[calc(100vw-240px)]'>

          <div className='w-full inline-flex items-center gap-1'>

            <GenericButton className='lg:hidden p-2 rounded-full hover:bg-gray-200'
              onClick={() => setShowLeftMenu(true)}>
              <RiMenu2Line className='size-6 text-gray-500' />
            </GenericButton>

            <SearchBar text={ searchText } onChange={ doSearchText }
              submit={() => doSearchText(searchText)}
              placeholder='Find by name, keywords...'
              disabled={ uploading }
            />
          </div>

          <FileHeaderSection
            canCheckAll={ canCheckAll }
            loading={ loading }
            refreshRoute={ refreshRoute }
            resetSelectedFiles={ resetSelectedFiles }
            running={ running }
            runningItem={ runningItem }
            uploading={ uploading }
            selectAllClicked={ selectAllClicked }
            selectedFiles={ selectedFiles }
            setConfirmDeleteMany={ setConfirmDeleteMany }
            setShouldAddFilesToCollection={ setShouldAddFilesToCollection }
            sortBy={ sortByFilter }
            sortDir={ sortDirFilter }
            sortByChanged={ sortByChanged }
            sortDirChanged={ sortDirChanged }
          />

          { renderSubHeader() }

          <div className="min-h-96">
            { loading
            ? <FileListSkeleton />
            : !files.content.length 
            ? <NoData />
            : files.content.map(file => (
              <FileListItem
                key={ file.name }
                file={ file }
                handleDeleteItem={ handleDelete }
                isItemSelected={ isItemSelected }
                running={ running }
                runningItem={ runningItem }
                selectItemClicked={ selectItemClicked }
                doReloadFile={ doReloadFile }
                setAddFileToCollection={ setAddFileToCollection }
                setShowFileCard={ setShowFileCard }
            />))}
          </div>

          <CustomPagination
            page={ files.currentPage + 1 }
            size={ files.pageSize }
            totalItem={ files.totalElements }
            onPageChange={ navPageChanged }
            onSizeChange={ navSizeChanged }
            disabled={ loading || running }
          />
        </div>
      </div>

      <ConfirmDialog
        open={ confirmDeleteMany }
        close={() => setConfirmDeleteMany(false)}
        text={`Are you sure you want to delete ${
          selectedFiles.length < 2 ? 'this file' : fillingZeroUtility(selectedFiles.length) + ' files' }?`}
        proceed={ handleDeleteFiles }
      />

      { showConfirmDialog && (
        <ConfirmationDialog
          message="Are you sure you want to delete this file? This action cannot be undone."
          onConfirm={() => {
            if (actionToConfirm) actionToConfirm()
            setShowConfirmDialog(false)
          }}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}

      { !!fileToShow &&
      <FileDetailsCard
        open={ !!fileToShow }
        close={() => setShowFileCard(null)}
        file={ fileToShow }
        doDelete={() => {
          setShowFileCard(null)
          handleDelete(fileToShow.name)
        }}
        doReloadFile={() => doReloadFile(fileToShow.name)}
        running={ runningItem === showFileCard }
      />}

      <AddFilesToCollection
        open={ shouldAddFilesToCollection || !!addFileToCollection }
        close={() => {
          setShouldAddFilesToCollection(false)
          setAddFileToCollection(null)
        }}
        files={ files.content.filter(({ name }) => 
          !!addFileToCollection ? name === addFileToCollection : selectedFiles.includes(name)) }
        dispatch={ dispatch }
      />

      <FilterDrawer
        isOpen={ showLeftMenu }
        handleClose={ closeLeftDrawer }
        content={ leftMenu }
      />
    </section>
  )
}

const mapStateToProps = (state: RootState) => {

  let { files } = state

  if (!files.content) {
    files = {

      content: [],

      currentPage: DEFAULT_NAV_PAGE,

      pageSize: DEFAULT_NAV_SIZE_25,

      hasNext: false,

      totalElements: 0
    }
  }

  return { files }
},

mapDispatchToProps = (dispatch: AppDispatch) =>({

  doSetFileStore: (data: PagedResult<FileDetails>) => dispatch(setOriginalFiles(data)),

  doRemoveFileStore: (name: string) => dispatch(removeFile(name)),

  doResetFilesData: () => dispatch(resetFilesData()),

  doUpdateFileStore: (file: FileDetails) => dispatch(updateFile(file)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MyFilesRom)
