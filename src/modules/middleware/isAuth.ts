import { MyContext } from "src/types/MyContext";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
    // Auth middleware, for resolvers, that requires authenticated users
    if (!context.req.session.userId) throw new Error("Not authenticated!")
    return next();
  };