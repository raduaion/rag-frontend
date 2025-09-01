import { ApprovalStatus } from "@/libs/ApprovalStatus"
import { compareDateFilter, DATE_FORMAT_STR, DEFAULT_NAV_PAGE, DEFAULT_NAV_SIZE, fillingZeroUtility } from "@/libs/helpers"
import { UserApproval } from "@/libs/UserApproval"
import { Alert, Button, Dropdown, DropdownItem, Spinner } from "flowbite-react"
import moment from "moment"
import { useCallback, useEffect, useState } from "react"
import Refresh from "@/components/fragments/icons/Refresh"
import DotVertical from "@/components/fragments/icons/DotVertical"
import Exclamation from "@/components/fragments/icons/Exclamation"
import CreateUser from "./Create"
import ConfirmDialog from "@/components/fragments/ConfirmDialog"
import UserApprovalFooter from "./Footer"
import ApiRequest from "@/libs/ApiRequest"
import { BadgeState, CustomBadge } from "@/components/fragments/CustomBadge"
import { connect } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { removeUser, resetUsersData, setOriginalUsers } from "@/redux/reducers/userSlice"
import ButtonRounded from "@/components/fragments/ButtonRounded"
import { Trash } from "@/components/fragments/icons/Trash"
import VerticalSeparator from "@/components/fragments/VerticalSeparator"
import Close from "@/components/fragments/icons/Close"
import { HiOutlineBan } from "react-icons/hi"
import { GoCheckCircle } from "react-icons/go"
import InputFilter from "@/components/fragments/InputFilter"
import DateFilter, { DateFilterType, initDateComp } from "@/components/fragments/DateFilter"
import { NumberComparatorType } from "@/components/NumberComparatorDropdown"
import QueryParams from "@/libs/QueryParams"
import { useRouter } from "next/router"
import { usePathname, useSearchParams } from "next/navigation"
import CustomPagination from "@/components/fragments/CustomPagination"
import { FiPlus } from "react-icons/fi"
import SpinnerIcon from "@/components/fragments/icons/SpinnerIcon"
import CheckboxLabelled from "@/components/fragments/CheckboxLabelled"
import { useAppDispatch } from "@/redux/hooks"

interface StateProps {
  originalUsers: UserApproval[]
}

interface DispatchProps {

  setOriginalUsers: (data: UserApproval[]) => void

  removeUser: (id: string) => void

  resetUsersData: () => void
}

interface StatusUpdate {
  id: string
  status: string
}

type Props = StateProps & DispatchProps

type StatusFilterType = 'ALL' | ApprovalStatus

const StatusFilters: StatusFilterType[] = [
  'ALL', 
  ApprovalStatus.APPROVED,
  ApprovalStatus.PENDING,
  ApprovalStatus.REJECTED
],

getItemStyle = (status: StatusFilterType): string => status === ApprovalStatus.PENDING 
  ? 'bg-gray-600'
  : status === ApprovalStatus.APPROVED
    ? 'bg-green-600'
    : status === ApprovalStatus.REJECTED
      ? 'bg-red-600'
      : status === 'ALL'
        ? 'bg-slate-800' 
        : 'bg-orange-400',

ManageUsers = ({ originalUsers, removeUser, setOriginalUsers }: Props) => {

  const router = useRouter(),

  pathname = usePathname(),

  searchParams = useSearchParams(),

  dispatch: AppDispatch = useAppDispatch(),

  [users, setUsers] = useState<UserApproval[]>([]),

  [error, setError] = useState<string | null>(null),

  [running, setRunning] = useState<boolean>(false),

  [runningId, setRunningId] = useState<string | null>(null),

  [fetching, setFetching] = useState<boolean>(false),

  [deleteId, setDeleteId] = useState<string | null>(null),

  [selectedUsers, setSelectedUsers] = useState<string[]>([]),

  [showCreateUser, setShowCreateUser] = useState<boolean>(false),

  [confirmDeletion, setConfirmDeletion] = useState<boolean>(false),

  [confirmUpdateStatus, setConfirmUpdateStatus] = useState<StatusUpdate | null>(null),

  [confirmUpdateStatuses, setConfirmUpdateStatuses] = useState<string | null>(null),

  [emailFilter, setEmailFilter] = useState<string>(''),

  [dateFilter, setDateFilter] = useState<DateFilterType>(initDateComp),

  [statusFilter, setStatusFilter] = useState<StatusFilterType>('ALL'),

  [navPage, setNavPage] = useState<number>(DEFAULT_NAV_PAGE),

  [navSize, setNavSize] = useState<number>(DEFAULT_NAV_SIZE),

  itemSelected = (id: string): boolean => selectedUsers.includes(id),

  selectAllClicked = (checked: boolean) => setSelectedUsers(checked ? users.map(item => item.id) : []),

  selectItemClicked = (checked: boolean, id: string) =>
    setSelectedUsers(prev => checked ? [...prev, id] : prev.filter(elt => elt !== id)),

  canCheckAll = (): boolean => users.length > 0 && selectedUsers.length === users.length,

  doFilterUsers = (originals: UserApproval[], emailFil: string, statusFil: StatusFilterType, dateFil: DateFilterType, isRefresh: boolean) => {

    let result: UserApproval[] = originals

    const emailT = emailFil.trim().toLowerCase(),
    dateT = dateFil.value.trim().toLowerCase(),
    dateComp = dateFil.comparator

    if (emailT || statusFil != 'ALL' || dateT) {

      result = result.filter(({ email, status, updatedOn }) => {

        let emailOk = true
        if (emailT) {
          emailOk = email.toLowerCase().includes(emailT)
        }

        let statusOk = true
        if (statusFil !== 'ALL') {
          statusOk = status === statusFil
        }

        let dateOk = true
        if (dateT && dateComp !== 'NONE' && updatedOn) {
          dateOk = compareDateFilter(
            moment(updatedOn * 1000).startOf('D'),
            moment(dateT),
            dateComp
          )
        }

        return emailOk && statusOk && dateOk
      })
    }

    if (!isRefresh) { // Reset to the first page when the filters change
      setNavPage(DEFAULT_NAV_PAGE)
    }
    setUsers(result)
    setSelectedUsers(prev => prev.filter(elt => result.findIndex(item => item.id === elt) > -1))
  },

  fetchUsers = async () => {

    setFetching(true)
    setError(null)

    try {
      const data: UserApproval[] = await ApiRequest.listUsers(dispatch)
      setOriginalUsers(data)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setFetching(false)
    }
  },

  handleUpdateUserStatus = async (id: string, status: string) => {

    setRunning(true)
    setRunningId(id)
    setError(null)

    try {
      await ApiRequest.updateUserStatus(dispatch, id, status)
      fetchUsers()
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
      setRunningId(null)
    }
  },

  updateSelectedUserStatuses = async (status: string) => {

    if (!selectedUsers.length) {
      return 
    }

    setRunning(true)
    setError(null)

    try {

      for (let i = 0; i < selectedUsers.length; i++) {

        const item = users.find(elt => elt.id === selectedUsers[i])
        if (item && item.status === status) {
          continue
        }
        await ApiRequest.updateUserStatus(dispatch, selectedUsers[i], status)
      }

      fetchUsers()
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
    }
  },

  hanldeDeleteUser = async (id: string) => {

    setRunning(true)
    setRunningId(id)
    setError(null)

    try {

      await ApiRequest.deleteUser(dispatch, id)
      removeUser(id)
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
      setRunningId(null)
    }
  },

  hanldeDeleteSelectedUsers = async () => {

    if (!selectedUsers.length) {
      return 
    }

    setRunning(true)
    setError(null)

    try {

      for (let i = 0; i < selectedUsers.length; i++) {
        await ApiRequest.deleteUser(dispatch, selectedUsers[i])
        removeUser(selectedUsers[i])
      }
    }
    catch (e) {
      console.error(e)
      setError((e as Error).message)
    }
    finally {
      setRunning(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    doFilterUsers(originalUsers, emailFilter, statusFilter, dateFilter, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalUsers])

  useEffect(() => {
    doFilterUsers(originalUsers, emailFilter, statusFilter, dateFilter, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailFilter, statusFilter, dateFilter])

  useEffect(() => {

    const pageParam = searchParams.get('page'),
    sizeParam = searchParams.get('size')

    if (pageParam) {
      const pageP = Number(pageParam)
      if (pageP !== navPage) {
        setNavPage(pageP)
      }
    }

    if (sizeParam) {
      const sizeP = Number(sizeParam)
      if (sizeP !== navSize) {
        setNavSize(sizeP)
      }
    }

    const statusParam = searchParams.get('status')
    if (statusParam) {

      const upParam = statusParam.toUpperCase(),
      statusP = ['ALL', ApprovalStatus.APPROVED, ApprovalStatus.PENDING, ApprovalStatus.REJECTED].includes(upParam)
        ? upParam as StatusFilterType : null

      if (statusP && statusP !== statusFilter) {
        setStatusFilter(statusP)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const createQueryString = useCallback(
    (data: QueryParams[]) => {
      const params = new URLSearchParams(searchParams.toString())

      data.forEach(({ name, value }) => {
        params.set(name, value)
      })

      return params.toString()
    },
    [searchParams]
  ),

  goToFirstNavPage = () => {
    if (navPage !== DEFAULT_NAV_PAGE) {
      router.push(pathname + '?' + createQueryString([{ name: 'page', value: DEFAULT_NAV_PAGE.toString() }]))
    }
  },

  userCreated = () => {

    setShowCreateUser(false)
    fetchUsers()
    goToFirstNavPage()
  },

  emailFilterChanged = (email: string) => {
    setEmailFilter(email)
  },

  dateComparatorFilterChanged = (cmp: NumberComparatorType) => {
    setDateFilter({ comparator: cmp, value: dateFilter.value })
  },

  dateFilterChanged = (date: string) => {
    setDateFilter({ comparator: dateFilter.comparator, value: date })
  },

  resetFilters = () => {

    setEmailFilter('')
    setStatusFilter('ALL')
    setDateFilter(initDateComp)

    router.push(pathname + '?' + createQueryString([
      { name: 'status', value: 'ALL' },
      { name: 'page', value: DEFAULT_NAV_PAGE.toString() }
    ]))
  },

  statusFilterChanged = (status: StatusFilterType) => {
    router.push(pathname + '?' + createQueryString([{ name: 'status', value: status }]))
  },

  navPageChanged = (nb: number) => {
    router.push(pathname + '?' + createQueryString([{ name: 'page', value: nb.toString() }]))
  },

  navSizeChanged = (nb: number) => {
    router.push(pathname + '?' + createQueryString([
      { name: 'size', value: nb.toString() },
      { name: 'page', value: DEFAULT_NAV_PAGE.toString() }
    ]))
  },

  closeError = () => setError(null),

  getBadgeState = (status: ApprovalStatus) => status === ApprovalStatus.PENDING
    ? BadgeState.PENDING
    : status === ApprovalStatus.APPROVED
      ? BadgeState.COMPLETED
      : BadgeState.ERROR,

  renderHeader = () => (
    <div className='flex justify-between items-center mb-3 md:mb-4 gap-1 sm:gap-2'>

      <h2 className="sm:text-lg font-bold">Users</h2>

      <Button color="success" onClick={() => setShowCreateUser(true)} title="Add new user">
        <FiPlus className='size-5 me-1' /> Add user
      </Button>
    </div>
  ),

  renderStatus = () => <>
    <div className='flex items-center flex-wrap justify-between md:mb-4 mb-3 gap-2'>
      <div className='flex items-center flex-wrap gap-2'>

        <p className="text-gray-700 me-2">
          Total users: { fillingZeroUtility(users.length) }
        </p>

        <VerticalSeparator />

        <ButtonRounded onClick={ fetchUsers } title='Refresh list'
          disabled={ running || fetching }>
          <Refresh className='size-4' />
        </ButtonRounded>

        { !!selectedUsers.length &&
        <>
          <VerticalSeparator />

          <span>Selected: { fillingZeroUtility(selectedUsers.length) }</span>

          <VerticalSeparator />

          <ButtonRounded disabled={ running || fetching } onClick={() => setConfirmDeletion(true)}
            title='Delete selected'>
            <Trash className='size-4' />
          </ButtonRounded>

          <VerticalSeparator />

          <Dropdown label="Update status" size="sm" color="gray" disabled={ running } title="Update status">
            <Dropdown.Item onClick={() => setConfirmUpdateStatuses(ApprovalStatus.APPROVED)}>
              <GoCheckCircle className="me-2 size-5" /> Approve
            </Dropdown.Item>

            <Dropdown.Item onClick={() => setConfirmUpdateStatuses(ApprovalStatus.REJECTED)}>
              <HiOutlineBan className="me-2 size-5" /> Reject
            </Dropdown.Item>
          </Dropdown>
      
          <VerticalSeparator />

          <ButtonRounded onClick={() => setSelectedUsers([])} title='Cancel selection'
            disabled={ running || fetching }>
            <Close className='size-4' />
          </ButtonRounded>
        </>}

        { fetching && <p className="text-blue-600">
          <SpinnerIcon className='inline size-4 animate-spin' /> Fetching...</p>}

        { (running || !!runningId) && <p className="text-blue-600">
          <SpinnerIcon className='inline size-4 animate-spin' /> Running...</p>}
      </div>

      { <Button color='gray' onClick={ resetFilters }>
        <span className='text-xs uppercase'>Clear Filters</span>
      </Button>}
    </div>

    { error && <Alert color="failure" icon={() => <Exclamation className="size-6" /> }
      onDismiss={ closeError } className="mb-3">&nbsp; { error }
    </Alert>}
  </>,

  renderData = (data: UserApproval[]) => data.map(user => {

    const { id, email, status, comment, updatedOn, createdOn } = user,

    date = updatedOn ?? createdOn,
  
    itemChecked = itemSelected(id),
  
    onClick = () => selectItemClicked(!itemChecked, id),
  
    itemIsRunning = runningId === id,

    mDate = date ? moment(date * 1000) : null,

    titleDate = mDate ? mDate.format('lll') : '',

    dateText = mDate ? mDate.fromNow() : '',

    isApproved = status === ApprovalStatus.APPROVED,

    isRejected = status === ApprovalStatus.REJECTED

    return (
      <tr key={id} className={`border-b ${ itemChecked ? 'bg-orange-50' : 'odd:bg-white even:bg-gray-50 hover:bg-gray-50' }`}
        onClick={ onClick }>

        <td className="p-3">

          <CheckboxLabelled
            checked={ itemChecked }
            itemSelected={v => selectItemClicked(v, id)}
            title='Select'
          />
        </td>

        <td className="p-4 whitespace-nowrap">
          { email }
        </td>

        <td className="p-4 whitespace-nowrap text-center">
          <CustomBadge statusText={ status } state={ getBadgeState(status) } />
        </td>

        <td className="p-4">
          { comment }
        </td>

        <td className="p-4 text-stone-500 whitespace-nowrap text-center" title={ titleDate }>
          { dateText }
        </td>

        <td className="p-4 whitespace-nowrap">
          <div className="inline-flex items-center gap-2">

            <ButtonRounded onClick={() => setDeleteId(id)} disabled={ itemIsRunning || running }>
              { itemIsRunning ? <Spinner aria-label="Deleting entry" /> : <Trash className='size-4' /> }
            </ButtonRounded>

            <div onClick={e => e.stopPropagation()}>
              <Dropdown label="" size="sm" color="gray" disabled={ itemIsRunning || running } isProcessing={ itemIsRunning }
                renderTrigger={() =>
                  <span className="rounded-full block hover:bg-gray-200 p-2 cursor-pointer">
                    <DotVertical className="size-5" />
                  </span>
                }>

                <Dropdown.Item disabled={ itemIsRunning || running || isApproved }
                  className={ isApproved ? 'text-gray-400 cursor-not-allowed' : ''}
                  onClick={() => setConfirmUpdateStatus({ id, status: ApprovalStatus.APPROVED })}>
                  <GoCheckCircle className="me-2 size-5" /> Approve
                </Dropdown.Item>

                <Dropdown.Item disabled={ itemIsRunning || running || isRejected }
                  className={ isRejected ? 'text-gray-400 cursor-not-allowed' : ''}
                  onClick={() => setConfirmUpdateStatus({ id, status: ApprovalStatus.REJECTED })}>
                  <HiOutlineBan className="me-2 size-5" /> Reject
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
        </td>
      </tr>
    )
  }),

  renderNoData = () => (
    <tr>
      <td colSpan={6} className="text-center p-4">No data</td>
    </tr>
  ),

  renderTable = () => (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg min-h-72">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>

            <th className="p-3">

              <CheckboxLabelled
                checked={ canCheckAll() }
                itemSelected={ selectAllClicked }
                title='Select all'
              />
            </th>

            <th scope="col" className="p-4">

              Email

              <InputFilter
                value={ emailFilter }
                placeholder="Enter email"
                onChange={ emailFilterChanged }
                className='mt-1'
              />
            </th>

            <th scope="col" className="p-4 text-center">

              Status

              <div className='font-normal mt-1 flex justify-center'>
                <Dropdown label={<span className="min-w-24">{ statusFilter }</span>} color='gray'>
                  { StatusFilters.map((item, index) => 
                    <DropdownItem key={ index } onClick={() => statusFilterChanged(item)}>
                      <span className={`size-3 rounded-full me-2 ${ getItemStyle(item) }`}></span>
                      <CustomBadge statusText={ item } state={ item === 'ALL' ? BadgeState.OTHER : getBadgeState(item) } />
                    </DropdownItem>
                  )}
                </Dropdown>
              </div>
            </th>

            <th scope="col" className="p-4">Comment</th>

            <th scope="col" className="p-4">

              Last Update

              <DateFilter
                compValue={ dateFilter.comparator }
                compOnChange={ dateComparatorFilterChanged }
                inputValue={ dateFilter.value }
                inputOnchange={ dateFilterChanged }
                max={ moment().format(DATE_FORMAT_STR) }
                className='mt-1'
              />
            </th>

            <th scope="col" className="p-4"></th>
          </tr>
        </thead>

        <tbody>
          { renderData(users.slice((navPage - 1) * navSize, ((navPage - 1) * navSize) + navSize)) }
          { !users.length && renderNoData() }
        </tbody>
      </table>
    </div>
  )

  return (
    <section className="bg-white shadow p-3 sm:p-6 sm:my-3 rounded max-w-screen-xl mx-auto">

      { renderHeader() }

      { renderStatus() }

      { renderTable() }

      <CustomPagination
        page={ navPage }
        size={ navSize }
        totalItem={ users.length }
        onPageChange={ navPageChanged }
        onSizeChange={ navSizeChanged }
      />

      <UserApprovalFooter users={ users } />

      <CreateUser
        open={ showCreateUser }
        close={() => setShowCreateUser(false)}
        userCreated={ userCreated }
        dispatch={ dispatch }
      />

      <ConfirmDialog
        open={ confirmDeletion }
        close={() => setConfirmDeletion(false)}
        text={`Are you sure you want to delete the selected entries?`}
        proceed={() => {
          setConfirmDeletion(false)
          hanldeDeleteSelectedUsers() 
        }}
      />

      { !!deleteId &&
      <ConfirmDialog
        open={ !!deleteId }
        close={() => setDeleteId(null)}
        text={`Are you sure you want to delete this entry?`}
        proceed={() => {
          hanldeDeleteUser(deleteId)
          setDeleteId(null)
        }}
      />}

      { !!confirmUpdateStatus &&
      <ConfirmDialog
        open={ !!confirmUpdateStatus }
        close={() => setConfirmUpdateStatus(null)}
        text={`Are you sure you want to update this entry?`}
        proceed={() => {
          setConfirmUpdateStatus(null)
          handleUpdateUserStatus(confirmUpdateStatus.id, confirmUpdateStatus.status) 
        }}
      />}

      { !!confirmUpdateStatuses &&
      <ConfirmDialog
        open={ !!confirmUpdateStatuses }
        close={() => setConfirmUpdateStatuses(null)}
        text={`Are you sure you want to update the selected entries?`}
        proceed={() => {
          setConfirmUpdateStatuses(null)
          updateSelectedUserStatuses(confirmUpdateStatuses) 
        }}
      />}
    </section>
  )
}

const mapStateToProps = (state: RootState) => {

  const { users: originalUsers } = state
  return { originalUsers }
},

mapDispatchToProps = (dispatch: AppDispatch) =>({

  setOriginalUsers: (data: UserApproval[]) => dispatch(setOriginalUsers(data)),

  removeUser: (id: string) => dispatch(removeUser(id)),

  resetUsersData: () => dispatch(resetUsersData()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers)
