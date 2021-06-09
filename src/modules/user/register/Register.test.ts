import { testConnection } from "./../../../test-utils/testConnection"
import { Connection } from "typeorm"
import {describe, beforeAll, afterAll, it} from '@jest/globals'
import { gCall } from "./../../../test-utils/gCall";

let connection:Connection;
// Executes BEFORE all tests
beforeAll( async() => {
    // Creates new connection (without db drops)
   connection = await testConnection()
})
// Executes AFTER all tests
afterAll(async() =>{
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
describe('Register',  () => {
    // First test, named "create user"
    it("create user", async () =>{
        // In this test we will call some resolver
        console.log(await gCall({
            source: registerMutation,
            variableValues: {
                data:
                {firstName: "123",
                lastName: "123",
                email: "123@gmail.com",
                password: "test123443_1"}
            }
        }))
    })
})

