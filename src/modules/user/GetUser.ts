import { Ctx, Query, Resolver } from 'type-graphql'
import { User } from '../../entity/User'
import { MyContext } from 'src/types/MyContext'

// Decorator
@Resolver()
export class GetUser {
    // max_complexity = 8, default_complexity = 1, so remaining complexity = 3
    @Query (() => User, {nullable:true, complexity:5})
    async getUser(@Ctx() ctx: MyContext) : Promise<User | undefined>{
        if (!ctx.req.session.userId) return undefined

        const user = User.findOne(ctx.req.session.userId)
        return user
    }
}