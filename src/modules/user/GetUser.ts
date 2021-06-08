import { Ctx, Query, Resolver } from 'type-graphql'
import { User } from '../../entity/User'
import { MyContext } from 'src/types/MyContext'

// Decorator
@Resolver()
export class GetUser {
    @Query (() => User, {nullable:true})
    async getUser(@Ctx() ctx: MyContext) : Promise<User | undefined>{
        if (!ctx.req.session.userId) return undefined

        const user = User.findOne(ctx.req.session.userId)
        console.log(123)
        return user
    }
}