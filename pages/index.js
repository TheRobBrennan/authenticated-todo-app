import Head from "next/head"
import Navbar from "../components/Navbar"
import Todo from "../components/Todo"
import { table, minifyRecords } from "./api/utils/Airtable"
import { TodosContext } from "../contexts/TodosContext"
import { useEffect, useContext } from "react"
import auth0 from "./api/utils/Auth0"
import TodoForm from "../components/TodoForm"

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
        {user && (
          <>
            <h1 className="text-2xl text-center mb-4">My todos</h1>
            <TodoForm />
            <ul>
              {todos && todos.map((todo) => <Todo key={todo.id} todo={todo} />)}
            </ul>
          </>
        )}
        {!user && <p>Please login to view and save your todos.</p>}
      </main>
    </div>
  )
}

// This function will run before the page is served
export async function getServerSideProps(context) {
  try {
    let todos = []
    const session = await auth0.getSession(context.req)
    const user = session?.user || null

    if (user) {
      // Load the first page of records from Airtable
      todos = await table
        .select({
          filterByFormula: `userId = '${session.user.sub}'`,
        })
        .firstPage()
    }

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
