import { loginUser } from "./actions"

import { useQuery, gql } from "@apollo/client"

const GET_USER_BY_EMAIL = gql`
  query GetUserByEmail($email: String!) {
    GetUserByEmail(email: $email) {
      password
    }
  }
`

const loginUsername = async ({ email, password }) => {
  console.log(email + " " + password)
  try {
    const { loading, error, data } = useQuery(GET_USER_BY_EMAIL, {
      variables: { email: values.email },
    })

    const userpwd = data?.GetUserByEmail?.password

    if (loading) {
      console.log("loading")
    }

    if (error) return false

    if (userpwd && userpwd === password) {
      console.log("User authenticated:", user)
    } else {
      console.log("Invalid email or password")
    }
  } catch {}
}

export default loginUsername
