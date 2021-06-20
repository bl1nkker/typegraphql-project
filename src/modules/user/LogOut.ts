import { MyContext } from "src/types/MyContext";
import { Ctx, Mutation, Resolver } from "type-graphql";

@Resolver()
export class LogOutResolver{
  @Mutation(() => Boolean)
  async logOut(@Ctx() ctx: MyContext): Promise<boolean> {
      // Clean session
      return new Promise( (res, rej) => ctx.req.session.destroy( (err) =>{
          if (err) {
              console.log(err)
              rej(false)
          }
          // Clear cookies
          ctx.res.clearCookie("qid")
          res(true)
      } ))
  }
}