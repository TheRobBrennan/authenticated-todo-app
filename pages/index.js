import Head from "next/head"
import Navbar from "../components/Navbar"
import Todo from "../components/Todo"
import { table, minifyRecords } from "./api/utils/Airtable"
import { TodosContext } from "../contexts/TodosContext"
import { useEffect, useContext } from "react"
import auth0 from "./api/utils/Auth0"

export default function Home({ initialTodos, user }) {
  // We can access all of the properties within our TodosContext
  const { todos, setTodos } = useContext(TodosContext)

  // When this component is first created, set the context todos to the value of our todos from Airtable
  useEffect(() => {
    setTodos(initialTodos)
  }, [])

  return (
    <div>
      <Head>
        <title>Authenticated Todo App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={user} />
      <main>
        <h1>Todo App</h1>
        <ul>
          {todos && todos.map((todo) => <Todo key={todo.id} todo={todo} />)}
        </ul>
      </main>
    </div>
  )
}

// This function will run before the page is served
export async function getServerSideProps(context) {
  try {
    const session = await auth0.getSession(context.req)
    const user = session?.user || null

    // Load the first page of records from Airtable
    const todos = await table.select({}).firstPage()

    return {
      // These are props that are going to be passed to our page
      props: {
        initialTodos: minifyRecords(todos),
        user,
      },
    }
  } catch (err) {
    console.error(err)
    return {}
  }
}
