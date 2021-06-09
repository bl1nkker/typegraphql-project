import { redis } from '../../redis'
import {v4} from 'uuid'
import { confirmUserPrefix } from '../constants/redisPrefixes'

export const createConfirmationUrl = (userId:number) => {
    // Generate random token
    const token = v4()

    // This will set { token:userId }
    redis.set(confirmUserPrefix + token, userId, "ex", 60 * 60 * 24) // 1 day expiration

    return `http://localhost:3000/user/confirm/${token}`
}