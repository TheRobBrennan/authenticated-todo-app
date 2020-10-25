import { table } from "./utils/Airtable"
import auth0 from "./utils/Auth0"

const createTodo = async (req, res) => {
  try {
    // With auth0.requireAuthentication, we are guaranteed to have an authenticated request
    const { user } = await auth0.getSession(req)
    const { description } = req.body

    const createdRecords = await table.create([
      { fields: { description, userId: user.sub } },
    ])

    const createdRecord = {
      id: createdRecords[0].id,
      fields: createdRecords[0].fields,
    }

    res.statusCode = 200
    res.json(createdRecord)
  } catch (err) {
    res.statusCode = 500
    res.json({ msg: "Something went wrong.", err })
  }
}

// This will automatically reject requests that come to this endpoint if the user is not logged in
export default auth0.requireAuthentication(createTodo)
