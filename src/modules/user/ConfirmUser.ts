import { User } from './../../entity/User'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { redis } from './../../redis'
import { confirmUserPrefix } from '../constants/redisPrefixes'

// Decorator
@Resolver()
export class ConfirmUserResolver {

    @Mutation(() => Boolean)
    async confirmUser(
        // Take token
        @Arg("token") token:string
    ):Promise<boolean>{
        // Get user id from redis ( {token:userId} )
        const userId = await redis.get(confirmUserPrefix + token)
        // If userid is undefined it's means that token is not exist or expired
        if (!userId) return false
        // Else, find and update User's prop "confirmed", which have userId
        await User.update({ id: parseInt(userId, 10) }, { confirmed:true })
        // And delete key:value pair from redis
        await redis.del(confirmUserPrefix + token)
        return true
    }
}