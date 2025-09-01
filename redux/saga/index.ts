import { all, fork } from 'redux-saga/effects'
import accountSaga from './accountSaga'

const rootSaga = function*() {
  yield all([fork(accountSaga)])
}

export default rootSaga
