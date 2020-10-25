import { table, minifyRecords } from "./utils/Airtable"

export default async (req, res) => {
  try {
    const records = await table.select({}).firstPage() // By default we'll get the first 20 records
    const minifiedRecords = minifyRecords(records)

    res.statusCode = 200
    res.json(minifiedRecords)
  } catch (err) {
    res.statusCode = 500
    res.json({ msg: "Something went wrong.", err })
  }
}
