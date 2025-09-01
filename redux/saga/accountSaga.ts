import { all, put, takeEvery, delay } from 'redux-saga/effects'

import { REHYDRATE } from 'redux-persist'

import { SIGN_IN_PROCESS} from '../ProcessType'
import { CHECK_AUTHENTICATED_ACTION, LOGIN_ACTION, LOGOUT_ACTION } from '../ActionType'
import { startProcess, stopProcess } from '../reducers/processSlice'
import { initUserSession } from '../reducers/accountSlice'

const checkAuthentication = function*() {
  console.log('checking Authentication')
},

rehydrateSaga = function*() {},

loginSaga = function*() {

  yield put(startProcess(SIGN_IN_PROCESS))
  yield delay(2000)

  let success = false,
  error = null

  yield put(stopProcess({
    name: SIGN_IN_PROCESS,
    success,
    error
  }))
},

logoutSaga = function*() {

  yield put(initUserSession({
    authenticated: false,
    userData: {},
  }))
},

accountSaga = function*() {
  yield all([
    takeEvery(REHYDRATE, rehydrateSaga),
    takeEvery(CHECK_AUTHENTICATED_ACTION, checkAuthentication),
    takeEvery(LOGIN_ACTION, loginSaga),
    takeEvery(LOGOUT_ACTION, logoutSaga),
  ])
}

export default accountSaga
