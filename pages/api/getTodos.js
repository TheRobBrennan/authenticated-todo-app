import { table, minifyRecords } from "./utils/Airtable"
import auth0 from "./utils/Auth0"

const getTodos = async (req, res) => {
  try {
    // With auth0.requireAuthentication, we are guaranteed to have an authenticated request
    const { user } = await auth0.getSession(req)

    const records = await table
      .select({
        filterByFormula: `userId = '${session.user.sub}'`,
      })
      .firstPage() // By default we'll get the first 20 records

    const minifiedRecords = minifyRecords(records)

    res.statusCode = 200
    res.json(minifiedRecords)
  } catch (err) {
    res.statusCode = 500
    res.json({ msg: "Something went wrong.", err })
  }
}

// This will automatically reject requests that come to this endpoint if the user is not logged in
export default auth0.requireAuthentication(getTodos)
