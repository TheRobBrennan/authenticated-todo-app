import auth0 from "../utils/Auth0"
import { table } from "../utils/Airtable"

const ownsRecord = (handler) =>
  auth0.requireAuthentication(async (req, res) => {
    const { user } = await auth0.getSession(req)
    const { id } = req.body

    try {
      // Find this record in our back-end and see if the user IDs match
      const existingRecord = await table.find(id)

      // If there is no record OR this user does not own the record
      if (!existingRecord || user.sub !== existingRecord.fields.userId) {
        res.statusCode = 404
        return res.json({ msg: "Record not found." })
      }

      // The user DOES own this record; continue processing request
      req.record = existingRecord
      return handler(req, res)
    } catch (err) {
      console.error(err)
      res.statusCode = 500
      return res.json({ msg: "Something went wrong." })
    }
  })

// This will automatically reject requests if the user is not logged in
export default ownsRecord
