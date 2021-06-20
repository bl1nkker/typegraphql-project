import { testConnection } from "./../../../test-utils/testConnection"
import { Connection } from "typeorm"
import {describe, beforeAll, afterAll, it} from '@jest/globals'
import { gCall } from "./../../../test-utils/gCall";
import faker from 'faker'
import { User } from "../../../entity/User";

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


const registerMutation = `
mutation Register($data:RegisterInput!) {
    register(
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
describe('Register', () => {
    // First test, named "create user"
    it("create user", async () =>{
      const user = {
        firstName: faker.name.firstName(),
        lastName:faker.name.lastName(),
        email: faker.internet.email(),
        password:faker.internet.password()
      }
      // In this test we will call some resolver
      const response = await gCall({
          source: registerMutation,
          variableValues: {
              data: user
          }
      })

      // That's for tests
      expect(response).toMatchObject({
        // Expecting our response to match this object:
        data: {
          register:{
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }
        }
      })

      // Find user in database
      const dbUser = await User.findOne({where:{ email:user.email }})
      // Expecting user to be defined
      expect(dbUser).toBeDefined()
      // Expecting user to have confirmed:false
      expect(dbUser!.confirmed).toBeFalsy()
      // Expecting user to have firstName:user.firstName
      expect(dbUser!.firstName).toBe(user.firstName)

    })
})

