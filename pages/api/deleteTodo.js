import { table, getMinifedRecord } from "./utils/Airtable"

export default async (req, res) => {
  try {
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
