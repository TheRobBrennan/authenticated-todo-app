const Airtable = require("airtable")
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
)
const table = base(process.env.AIRTABLE_TABLE_NAME)

const minifyRecords = (records) => {
  return records.map((record) => getMinifedRecord(record))
}

const getMinifedRecord = (record) => {
  // Airtable does not return a value for checkbox fields if they are not marked
  if (!record.fields.completed) {
    // Explicitly set a false value so all of our records contain completed fields
    record.fields.completed = false
  }

  return {
    id: record.id,
    fields: record.fields,
  }
}

export { table, getMinifedRecord, minifyRecords }
