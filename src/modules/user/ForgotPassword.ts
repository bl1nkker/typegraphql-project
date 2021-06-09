import { User } from './../../entity/User'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { redis } from './../../redis'
import { v4 } from 'uuid'
import { sendEmail } from '../utils/sendEmail'
import { forgotPasswordPrefix } from '../constants/redisPrefixes'

// Decorator
@Resolver()
export class ForgotPasswordResolver {

    @Mutation(() => Boolean)
    async forgotPassword(
        // Take an forbidden user email
        @Arg("email") email:string
    ):Promise<boolean>{
        // Check if user exists in db
        const user = await User.findOne({where: { email }})
        if (!user) return true
        
        // Create new token (random unic id)
        const token = v4()
        // This will set { token:userId }
        redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24) // 1 day expiration
        await sendEmail(email, `http://localhost:3000/user/change-password/${token}`)

        return true
    }
}