import { RootState } from "./store"

/**
 * Select Process State in the store
 */
class Selectors {

  static selectProcessRunning = (state: RootState, ProcessType: string) => state?.process?.[ProcessType]?.running

  static selectProcessSuccess = (state: RootState, ProcessType: string) => state?.process?.[ProcessType]?.success

  static selectProcessError = (state: RootState, ProcessType: string) => state?.process?.[ProcessType]?.error

  static selectProcessAll= (state: RootState, ProcessType: string) => ({
    running: Selectors.selectProcessRunning(state, ProcessType),
    success: Selectors.selectProcessSuccess(state, ProcessType),
    error: Selectors.selectProcessError(state, ProcessType)
  })
}

export default Selectors
