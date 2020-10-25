import { createContext, useState } from "react"

const TodosContext = createContext()
const TodosProvider = ({ children }) => {
  const [todos, setTodos] = useState([])

  const refreshTodos = async () => {
    try {
      const res = await fetch("/api/getTodos")
      const latestTodos = await res.json()
      setTodos(latestTodos)
    } catch (err) {
      console.error(err)
    }
  }

  const addTodo = async (description) => {
    try {
      const res = await fetch("/api/createTodo", {
        method: "POST",
        body: JSON.stringify({ description }),
        headers: { "Content-Type": "application/json" },
      })
      const newTodo = await res.json()
      setTodos((prevTodos) => {
        // Add the new todo at the beginning
        return [newTodo, ...prevTodos]
      })
    } catch (err) {
      console.error(err)
    }
  }

  const updateTodo = async (updatedTodo) => {
    try {
      const res = await fetch("/api/updateTodo", {
        method: "PUT",
        body: JSON.stringify(updatedTodo),
        headers: { "Content-Type": "application/json" },
      })
      await res.json()
      setTodos((prevTodos) => {
        // Create a fresh copy of the previous todos
        const existingTodos = [...prevTodos]

        // Find the updated todo in the previously existing todos and then make sure our fields are set appropriately
        const existingTodo = existingTodos.find(
          (todo) => todo.id === updatedTodo.id
        )
        existingTodo.fields = updatedTodo.fields

        return existingTodos
      })
    } catch (err) {
      console.error(err)
    }
  }

  const deleteTodo = async (id) => {
    try {
      const res = await fetch("/api/deleteTodo", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      })

      setTodos((prevTodos) => {
        // Return all previous todos except for the one we have just deleted
        return prevTodos.filter((todo) => todo.id !== id)
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <TodosContext.Provider
      value={{
        todos,
        setTodos,
        refreshTodos,
        updateTodo,
        deleteTodo,
        addTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  )
}
export { TodosProvider, TodosContext }
