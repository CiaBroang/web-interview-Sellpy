import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

const FILE_PATH = './data.json'

const readData = () => {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error when parsing data:', error)
    throw error
  }
}

app.get('/data', (req, res) => {
  const storedData = readData()
  res.json(storedData)
})

const saveData = (data) => {
  try {
    console.log('Saving data to data.json:', data)
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving data to data.json:', error)
  }
}
saveData()

app.post('/data', (req, res) => {
  console.log('POST request received!')
  const storedData = readData()
  console.log('storedData', storedData)
  const requestData = req.body
  console.log('requestData', requestData)

  const filteredTodos = requestData.todos.filter(
    (todo) => todo.title && todo.title.trim().length > 0
  )

  if (filteredTodos.length === 0) {
    return res.status(400).json({ message: 'A todo must have a title' })
  }

  if (storedData[requestData.listId]) {
    storedData[requestData.listId].todos = filteredTodos.map((todo) => ({
      title: todo.title,
      completed: todo.completed,
      id: todo.id || uuidv4(),
    }))

    saveData(storedData)
    res
      .status(200)
      .json({ message: 'Data updated successfully!', todos: storedData[requestData.listId].todos })
  } else {
    res.status(404).json({ message: 'List not found!' })
  }
})

app.delete('/data', (req, res) => {
  console.log('DELETE request received!')
  const storedData = readData()
  console.log('storedData', storedData)

  const { listId, todoId } = req.body
  console.log('Request Data - listId:', listId, 'todoId:', todoId)

  if (storedData[listId]) {
    storedData[listId].todos = storedData[listId].todos.filter((todo) => todo.id !== todoId)
    saveData(storedData)
    res.status(200).json({ message: 'Deleted todo successfully!' })
  } else {
    res.status(404).json({ message: 'List not found!' })
  }
})