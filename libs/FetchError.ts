
export default class FetchError extends Error {

  public statusCode: number

  constructor(statusCode: number, message?: string) {

    super(message)

    Object.setPrototypeOf(this, FetchError.prototype)
    this.name = this.constructor.name
    this.statusCode = statusCode
  }
}
