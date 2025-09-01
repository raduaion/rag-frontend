import { useState, useEffect } from 'react'
import {
  DEFAULT_NAV_PAGE,
  DEFAULT_NAV_SIZE,
  fillingZeroUtility,
} from '../../libs/helpers'
import { IndexDetails } from '../../libs/IndexDetails'
import ConfirmationDialog from '../utils/ConfirmationDialog'
import { Alert } from 'flowbite-react'
import SearchBar from '@/components/fragments/SearchBar'
import ConfirmDialog from '@/components/fragments/ConfirmDialog'
import CreateCollection from './Create'
import { AppDispatch, RootState } from '@/redux/store'
import {
  addFileForCollections,
  removeCollection,
  resetCollections,
  setCollections,
  updateCollection
} from '@/redux/reducers/collectionSlice'
import { connect } from 'react-redux'
import Exclamation from '@/components/fragments/icons/Exclamation'
import ApiRequest from '@/libs/ApiRequest'
import CollectionDetailsCard from './CollectionDetailsCard'
import { COLLECTION_STATE_TYPE } from './CollectionTableHead'
import { DateFilterType, initDateComp } from '@/components/fragments/DateFilter'
import { NumberComparatorType } from '@/components/NumberComparatorDropdown'
import { useRouter } from 'next/router'
import { usePathname, useSearchParams } from 'next/navigation'
import CustomPagination from '@/components/fragments/CustomPagination'
import { useAppDispatch } from '@/redux/hooks'
import useDebounce from '@/hooks/useDebounce'
import LeftMenu from './LeftMenu'
import CollectionListItem from './CollectionListItem'
import NoData from './NoData'
import HeaderSection from './HeaderSection'
import CollectionListSkeleton from './CollectionListSkeleton'
import CollectionPagedResult from '@/libs/CollectionPagedResult'
import { RiMenu2Line } from "react-icons/ri"
import GenericButton from '@/components/fragments/GenericButton'
import FilterDrawer from './FilterDrawer'
import { setPublicCollections } from '@/redux/reducers/publicCollectionSlice'
import { FileDetails } from '@/libs/FileDetails'

interface StateProps {
  collections: CollectionPagedResult<IndexDetails>
}

interface DispatchProps {

  doSetCollectionStore: (data: CollectionPagedResult<IndexDetails>) => void

  doUpdateCollectionStore: (data: IndexDetails) => void

  doRemoveCollectionStore: (id: string) => void

  doResetCollectionStore: () => void

  doSetPublicCollectionStore: (data: CollectionPagedResult<IndexDetails>) => void

  doAddFileForCollections: (data: FileDetails[]) => void
}

interface OwnProps {
  isPublicPath: boolean
}

type Props = OwnProps & StateProps & DispatchProps

export interface UpdateDetails {
  id: string
  shared: boolean
}

const Collections = ({ isPublicPath, collections, doSetCollectionStore, doUpdateCollectionStore,
  doRemoveCollectionStore, doSetPublicCollectionStore, doAddFileForCollections }: Props) => {

  const router = useRouter(),

  pathname = usePathname(),

  searchParams = useSearchParams(),

  dispatch: AppDispatch = useAppDispatch(),

  [loadingIndexes, setLoadingIndexes] = useState(false),

  [runningItem, setRunningItem] = useState<string | null>(null),

  [error, setError] = useState<string | null>(null),

  [showFilePopup, setShowFilePopup] = useState(false),

  [showConfirmDialog, setShowConfirmDialog] = useState(false),

  [running, setRunning] = useState<boolean>(false),

  [actionToConfirm, setActionToConfirm] = useState<null | (() => void)>(null),

  [selectedIndexes, setSelectedIndexes] = useState<string[]>([]),

  [searchText, setSearchText] = useState<string>(''),

  debouncedSearchText = useDebounce(searchText, 800),

  [confirmDeleteMany, setConfirmDeleteMany] = useState(false),

  [shareState, setShareState] = useState<boolean | null>(null),

  [collectionToUpdate, setCollectionToUpdate] = useState<UpdateDetails | null>(null),

  [showCollectionCard, setshowCollectionCard] = useState<string | null>(null),

  [showLeftMenu, setShowLeftMenu] = useState(false),

  [dateFilter, setDateFilter] = useState<DateFilterType>(initDateComp),

  [stateFilter, setStateFilter] = useState<COLLECTION_STATE_TYPE>('ALL'),

  debouncedDateFilter = useDebounce(dateFilter.value, 1000),

  selectAllClicked = (checked: boolean) => setSelectedIndexes(prev => {

    let arrCopy = [...prev]
    arrCopy = arrCopy.filter(item => collections.content.findIndex(elt => elt.id === item) === -1)

    if (checked) {
      arrCopy.push(...collections.content.map(item => item.id))
    }

    return arrCopy
  }),

  selectItemClicked = (checked: boolean, indexId: string) =>
    setSelectedIndexes(prev => checked ? [...prev, indexId] : prev.filter(id => id !== indexId)),

  isItemSelected = (indexId: string): boolean => selectedIndexes.includes(indexId),

  canCheckAll = (): boolean => !!collections.content.length && 
    collections.content.every(item => selectedIndexes.findIndex(elt => elt === item.id) > -1),

  resetSelectedCollections = () => setSelectedIndexes([]),

  fetchIndexes = async (page: number, size: number, state: COLLECTION_STATE_TYPE,
    q: string, date?: string, dateCmp?: string) => {

    setLoadingIndexes(true)
    setError(null)

    try {

      if (isPublicPath) {
        const data: CollectionPagedResult<IndexDetails> = await ApiRequest.filterIndexes(
          dispatch, page - 1, size, true, q, date, dateCmp
        )
        doSetPublicCollectionStore(data)
      }
      else {
        const data: CollectionPagedResult<IndexDetails> = await ApiRequest.filterIndexes(
          dispatch, page - 1, size, false, q, date, dateCmp, state ?? undefined
        )
        doSetCollectionStore(data)
      }
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setLoadingIndexes(false)
    }
  },

  handleDeleteIndexes = async () => {

    setConfirmDeleteMany(false)
    setRunning(true)
    setError(null)

    try {

      for (const i in selectedIndexes) {
        await ApiRequest.deleteIndex(dispatch, selectedIndexes[i])
        doRemoveCollectionStore(selectedIndexes[i])
      }

      // Remove from selection
      resetSelectedCollections()
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

  // After collection deletion
  afterCollectionDeletion = (collectionId: string) => {

    doRemoveCollectionStore(collectionId)
    selectItemClicked(false, collectionId)
    navPageChanged(1)
  },

  handleDeleteIndex = (indexId: string) => {

    setActionToConfirm(() => async () => {

      setRunningItem(indexId)
      setError(null)

      try {

        await ApiRequest.deleteIndex(dispatch, indexId)
        afterCollectionDeletion(indexId)
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

  doShareCollections = async () => {

    if (shareState == null) 
      return

    const selectedState: boolean = shareState

    setShareState(null)
    setRunning(true)
    setError(null)

    try {

      for (const i in selectedIndexes) {
        const resp = await ApiRequest.updateCollectionState(dispatch, selectedIndexes[i], selectedState)
        doUpdateCollectionStore(resp)
      }
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
    }
  },

  doShareCollection = async ({ id, shared }: UpdateDetails) => {

    setRunningItem(id)
    setError(null)

    try {
      const resp = await ApiRequest.updateCollectionState(dispatch, id, shared)
      doUpdateCollectionStore(resp)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunningItem(null)
    }
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
      state: stateParam, q: searchParam, 
      date: dateParam, datecmp: dateCmpParam } = router.query,

    // Page param
    _page = typeof pageParam === 'string' ? Number(pageParam) : DEFAULT_NAV_PAGE,

    // Size param
    _size = typeof sizeParam === 'string' ? Number(sizeParam) : DEFAULT_NAV_SIZE

    // State
    let _state: COLLECTION_STATE_TYPE = 'ALL'
    if (typeof stateParam === 'string') {

      const upParam = stateParam.toUpperCase(),
      stateP = ['ALL', 'PUBLIC', 'PRIVATE'].includes(upParam) ? upParam as COLLECTION_STATE_TYPE : null

      if (stateP) {
        _state = stateP
      }
    }

    if (_state !== stateFilter) {
      setStateFilter(_state)
    }

    // search Text
    const _q = typeof searchParam === 'string' ? searchParam : ''
    if (_q !== searchText) {
      setSearchText(_q)
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

    fetchIndexes(_page, _size, _state, _q, _date, _dateCmp)

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

  collectionCreated = () => {
    setShowFilePopup(false)
    refreshRoute()
  },

  closeCreateCollection = () => {
    setShowFilePopup(false)
  },

  doSearchText = (val: string) => {
    setSearchText(val)
  },

  // Reset all filters
  resetFilters = () => {

    setSearchText('')
    setDateFilter(initDateComp)
    setStateFilter('ALL')

    router.push(pathname)
  },

  navPageChanged = (nb: number) => {
    if (loadingIndexes || running) return
    checkAndRoute('page', nb.toString(), false, nb !== DEFAULT_NAV_PAGE)
  },

  navSizeChanged = (nb: number) => {
    checkAndRoute('size', nb.toString(), true, nb !== DEFAULT_NAV_SIZE)
  },

  stateFilterChanged = (val: COLLECTION_STATE_TYPE) => {

    setStateFilter(val)
    checkAndRoute('state', val.toLowerCase(), true, val !== 'ALL')
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

  renderSubHeader = () => <>
    { searchText && <p className="text-gray-600 mb-3 md:mb-4">
      Search results for <span className='text-blue-700 font-semibold'>&#171; { searchText } &#187;</span>
    </p>}

    { error && <Alert color="failure" icon={() => <Exclamation className="size-6" />}
      onDismiss={ closeError } className="mb-3">&nbsp; { error }
    </Alert>}
  </>,

  collectionToShow = showCollectionCard
    ? collections.content.find(item => item.id === showCollectionCard)
    : null,

  leftMenu = <LeftMenu
    isPublicPath={ isPublicPath }
    createClicked={() => {
      closeLeftDrawer()
      setShowFilePopup(true)
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
    running={ running || loadingIndexes }
    stateFilter={ stateFilter }
    stateFilterChanged={(v: COLLECTION_STATE_TYPE) => {
      closeLeftDrawer()
      stateFilterChanged(v)
    }}
  />

  return (
    <section className="bg-white shadow rounded max-w-screen-xl mx-auto xl:my-2">

      <div className='lg:flex'>

        <div className='w-60 hidden lg:block flex-shrink-0 pl-4 pr-0.5 py-3 space-y-4'>
          { leftMenu }
        </div>

        <div className='flex-grow p-3 sm:p-6 sm:pt-4'>

          <div className='w-full inline-flex items-center gap-1'>

            <GenericButton className='lg:hidden p-2 rounded-full hover:bg-gray-200'
              onClick={() => setShowLeftMenu(true)}>
              <RiMenu2Line className='size-6 text-gray-500' />
            </GenericButton>

            <SearchBar text={ searchText } onChange={ doSearchText }
              submit={() => doSearchText(searchText)}
              placeholder='Find collections by name, keywords, ..'
              disabled // TODO: Should be removed once implemented in the backend
            />
          </div>

          <HeaderSection
            isPublicPath={ isPublicPath }
            canCheckAll={ canCheckAll }
            loadingIndexes={ loadingIndexes }
            refreshRoute={ refreshRoute }
            resetSelectedCollections={ resetSelectedCollections }
            running={ running }
            runningItem={ runningItem }
            selectAllClicked={ selectAllClicked }
            selectedIndexes={ selectedIndexes }
            setConfirmDeleteMany={ setConfirmDeleteMany }
            setShareState={ setShareState }
          />

          { renderSubHeader() }

          <div className="min-h-96">
            { loadingIndexes 
            ? <CollectionListSkeleton />
            : !collections.content.length 
            ? <NoData />
            : collections.content.map(collection => (
              <CollectionListItem
                key={ collection.id }
                isPublicPath={ isPublicPath }
                collection={ collection }
                files={ collections.files }
                handleDeleteIndex={ handleDeleteIndex }
                isItemSelected={ isItemSelected }
                running={ running }
                runningItem={ runningItem }
                selectItemClicked={ selectItemClicked }
                setUpdateCollection={ setCollectionToUpdate }
                setshowCollectionCard={ setshowCollectionCard }
            />))}
          </div>

          <CustomPagination
            page={ collections.currentPage + 1 }
            size={ collections.pageSize }
            totalItem={ collections.totalElements }
            onPageChange={ navPageChanged }
            onSizeChange={ navSizeChanged }
            disabled={ loadingIndexes || running }
          />
        </div>
      </div>

      { showConfirmDialog && actionToConfirm && (
        <ConfirmationDialog
          message="Are you sure you want to delete this collection? This action cannot be reverted."
          onConfirm={() => {
            actionToConfirm()
            setShowConfirmDialog(false)
          }}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}

      <ConfirmDialog
        open={ confirmDeleteMany }
        close={() => setConfirmDeleteMany(false)}
        text={`Are you sure you want to delete ${ selectedIndexes.length < 2
          ? 'this collection' : fillingZeroUtility(selectedIndexes.length) + ' collections' }?`}
        proceed={ handleDeleteIndexes }
      />

      <ConfirmDialog
        open={ shareState !== null }
        close={() => setShareState(null)}
        text={`Make the selected collections ${ shareState ? 'public' : 'private' }?`}
        proceed={ doShareCollections }
      />

      { !!collectionToUpdate &&
      <ConfirmDialog
        open={ !!collectionToUpdate }
        close={() => setCollectionToUpdate(null)}
        text={`Make this collection ${ collectionToUpdate.shared ? 'public' : 'private' }?`}
        proceed={() => {
          doShareCollection(collectionToUpdate)
          setCollectionToUpdate(null)
        }}
      />}

      <CreateCollection
        open={ showFilePopup }
        collectionCreated={ collectionCreated }
        close={ closeCreateCollection }
        dispatch={ dispatch }
      />

      { !!collectionToShow &&
      <CollectionDetailsCard
        open={ !!collectionToShow }
        close={() => setshowCollectionCard(null)}
        collection={ collectionToShow }
        isPublicPath={ isPublicPath }
        doUpdateCollectionStore={ doUpdateCollectionStore }
        afterCollectionDeletion={ afterCollectionDeletion }
        doAddFileForCollections={ doAddFileForCollections }
      />}

      <FilterDrawer
        isOpen={ showLeftMenu }
        handleClose={ closeLeftDrawer }
        content={ leftMenu }
      />
    </section>
  )
},

mapStateToProps = (state: RootState, { isPublicPath }: OwnProps) => {

  const { collections: privateCollections, publicCollections } = state
  let collections = isPublicPath ? publicCollections : privateCollections

  if (!collections.content) {
    collections = {

      content: [],

      currentPage: DEFAULT_NAV_PAGE,

      pageSize: DEFAULT_NAV_SIZE,

      hasNext: false,

      totalElements: 0,

      files: [],
    }
  }

  return { collections }
},

mapDispatchToProps = (dispatch: AppDispatch) =>({

  doSetCollectionStore: (data: CollectionPagedResult<IndexDetails>) => dispatch(setCollections(data)),

  doUpdateCollectionStore: (data: IndexDetails) => dispatch(updateCollection(data)),

  doRemoveCollectionStore: (id: string) => dispatch(removeCollection(id)),

  doResetCollectionStore: () => dispatch(resetCollections()),

  doSetPublicCollectionStore: (data: CollectionPagedResult<IndexDetails>) => dispatch(setPublicCollections(data)),

  doAddFileForCollections: (data: FileDetails[]) => dispatch(addFileForCollections(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Collections)
