import { User } from './../../entity/User'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { redis } from '../../redis'
import bcrypt from 'bcryptjs'
import { forgotPasswordPrefix } from '../constants/redisPrefixes'
import { ChangePasswordInput } from './changePassword/ChangePasswordInput'
import { MyContext } from 'src/types/MyContext'

// Decorator
@Resolver()
export class ChangePasswordResolver {

    @Mutation(() => User, { nullable:true })
    async changePassword(
        // Take token and new password
        @Arg("data") { token, password }:ChangePasswordInput,
        @Ctx() ctx: MyContext
    ):Promise<User | null>{
        // Check if user exists in db
        const userId = await redis.get(forgotPasswordPrefix + token)
        if (!userId) return null
        
        const user = await User.findOne(userId)
        if (!user) return null

        await redis.del(forgotPasswordPrefix + token)
        user.password = await bcrypt.hash(password, 12)
        user.save()

        ctx.req.session.userId = user.id

        return user
    }
}