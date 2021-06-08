

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
    ):Promise<User | string | null>{
        const user = await User.findOne({ where: { email } })
        if (!user) return "No user with such email!"

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) return "Password do not match!"
        if (!user.confirmed) return "Please, make sure you confirmed your email!"

        ctx.req.session!.userId = user.id
        return user
    }
}