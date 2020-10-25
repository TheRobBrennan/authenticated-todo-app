import { table, getMinifedRecord } from "./utils/Airtable"
import auth0 from "./utils/Auth0"
import OwnsRecord from "./middleware/OwnsRecord"

const deleteTodo = async (req, res) => {
  try {
    const { user } = await auth0.getSession(req)
    const { id } = req.body

    const deletedRecords = await table.destroy([id])

    const deletedRecord = getMinifedRecord(deletedRecords[0])

    res.statusCode = 200
    res.json(deletedRecord)
  } catch (err) {
    res.statusCode = 500
    res.json({ msg: "Something went wrong.", err })
  }
}

export default OwnsRecord(deleteTodo)
