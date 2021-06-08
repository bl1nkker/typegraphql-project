// User related thing

import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import bcrypt from 'bcryptjs'
import { User } from '../../entity/User'
import { MyContext } from 'src/types/MyContext'

// Decorator
@Resolver()
export class LoginResolver {

    @Mutation(() => User, { nullable:true })
    async login(
        @Arg("email") email:string,
        @Arg("password") password:string,
        @Ctx() ctx: MyContext
    ):Promise<User | null>{
        const user = await User.findOne({ where: { email } })
        if (!user) return null

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) return null

        ctx.req.session!.userId = user.id
        console.log(ctx.req.session)

        return user
    }
}