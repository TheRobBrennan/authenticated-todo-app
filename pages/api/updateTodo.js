import { table, getMinifedRecord } from "./utils/Airtable"

export default async (req, res) => {
  try {
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
