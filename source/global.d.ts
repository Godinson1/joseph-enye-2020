declare global {
  namespace Express {
    export interface Request {
      user: any; //requestUser | string
    }
  }
}

export {};
