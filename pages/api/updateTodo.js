import { table, getMinifedRecord } from "./utils/Airtable"
import auth0 from "./utils/Auth0"
import OwnsRecord from "./middleware/OwnsRecord"

const updateTodo = async (req, res) => {
  try {
    const { user } = await auth0.getSession(req)
    const { id, fields } = req.body

    const updatedRecords = await table.update([{ id, fields }])

    const updatedRecord = getMinifedRecord(updatedRecords[0])

    res.statusCode = 200
    res.json(updatedRecord)
  } catch (err) {
    res.statusCode = 500
    res.json({ msg: "Something went wrong.", err })
  }
}

export default OwnsRecord(updateTodo)
