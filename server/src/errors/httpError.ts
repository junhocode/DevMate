class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = '잘못된 요청입니다.') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = '인증에 실패했습니다.') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = '권한이 없습니다.') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = '리소스를 찾을 수 없습니다.') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = '서버 내부 에러') {
    super(message, 500);
    this.name = 'InternalServerError';
  }
}
