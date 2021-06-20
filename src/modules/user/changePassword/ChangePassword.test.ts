import { testConnection } from "./../../../test-utils/testConnection"
import { Connection } from "typeorm"
import {describe, beforeAll, afterAll, it} from '@jest/globals'
import { gCall } from "./../../../test-utils/gCall";
import { User } from "../../../entity/User";
import faker from 'faker'
import { redis } from "./../../../redis"
import { forgotPasswordPrefix } from "../../../../src/modules/constants/redisPrefixes";
import { v4 } from "uuid";

let connection:Connection;
// Executes BEFORE all tests
beforeAll( async() => {
    // Creates new connection (without db drops)
   connection = await testConnection()
})
// Executes AFTER all tests
afterAll(async() => { 
  await connection.close()
})


const changePasswordMutation = `
mutation Register($data:ChangePasswordInput!) {
    changePassword(
      data: $data
    ) {
      id
      firstName
      lastName
      email
      name
    }
  }
`

// describe(name, fn) creates a block that groups together several related tests
describe('Get User', () => {
    it("get current user", async () =>{
        // Creating random user using faker
        const user = await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }).save()

        // Creating token (i can use ForgotPassword mutation, but it requires the email verification)
        const token = v4()
        await redis.set(forgotPasswordPrefix + token, user.id, "ex", 60 * 60 * 24)

        // Sending query
        const response = await gCall({
            source:changePasswordMutation,
            userId: user.id,
            variableValues:{
                data: {
                    token,
                    password: faker.internet.password()
                }
            }
        })

        // If this test returns a user, it's mean all fine!
        expect(response).toMatchObject({
            // Expecting our response to match this object:
            data: {
                changePassword:{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
              }
            }
          })
    })
})

