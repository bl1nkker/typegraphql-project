import { Request, Response } from 'express'
import { createAuthorsLoader } from "../utils/authorsLoader";

export interface MyContext {
    req: Request & {
      session: {
        userId?: any;
      };
    };
    res: Response & {
      session: {
        userId?: any;
      };
    };
    authorsLoader: ReturnType<typeof createAuthorsLoader>;
  }