export class CommonResponseCode {
  ////
  // Http Code
  ////
  static readonly SUCCESS = {
    code: 200,
    message: 'Success.',
  }
  static readonly BAD_REQUEST = {
    code: 400,
    message: 'Bad request.',
  }
  static readonly UNAUTHORIZED = {
    code: 401,
    message: 'Unauthorized error.',
  }

  static readonly ACCESS_DENIED = {
    code: 403,
    message: 'Access denied.',
  }
  static readonly NOT_FOUND = {
    code: 404,
    message: 'Not found.',
  }
  static readonly INTERNAL = {
    code: 500,
    message: 'Internal error.',
  }
}
