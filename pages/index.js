import Head from "next/head"
import Navbar from "../components/Navbar"
import { table, minifyRecords } from "./api/utils/Airtable"

export default function Home({ initialTodos }) {
  console.log(initialTodos)

  return (
    <div>
      <Head>
        <title>Authenticated Todo App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>
        <h1>Todo App</h1>
      </main>
    </div>
  )
}

// This function will run before the page is served
export async function getServerSideProps(context) {
  try {
    // Load the first page of records from Airtable
    const todos = await table.select({}).firstPage()

    return {
      // These are props that are going to be passed to our page
      props: {
        initialTodos: minifyRecords(todos),
      },
    }
  } catch (err) {
    console.error(err)
    return {
      props: {
        err,
      },
    }
  }
}
