import React, { useState } from 'react'
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Checkbox,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)

  const handleSubmit = async (todosToSubmit) => {
    const listId = todoList.id

    const data = { listId, todos: todosToSubmit } // Sätter värdet av nyckeln 'todos' till todosToSubmit
    saveTodoList(listId, { todos: todosToSubmit })

    console.log('Submitting data to server:', data)

    await fetch('http://localhost:3001/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setTodos(todosToSubmit)
    // alert('Your todo has been saved!')
  }

  const handleDelete = async (index) => {
    await fetch(`http://localhost:3001/data/${todoList.id}/${index}`, {
      method: 'DELETE',
    })

    setTodos((todos) => [...todos.slice(0, index), ...todos.slice(index + 1)])
    console.log('New todos efter delete', todos)
    // alert('Your todo has been deleted!')
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {todos.map(
            (todo, index) =>
              console.log('todo', todo) || (
                <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ margin: '8px' }} variant='h6'>
                    {index + 1}
                  </Typography>
                  <Checkbox
                    checked={todo.completed}
                    onChange={(event) => {
                      const updatedTodos = todos.map((todo, idx) =>
                        idx === index ? { ...todo, completed: event.target.checked } : todo
                      )
                      handleSubmit(updatedTodos)
                    }}
                  />
                  <TextField
                    sx={{ flexGrow: 1, marginTop: '1rem' }}
                    label='What to do?'
                    value={todo.title}
                    onChange={(event) => {
                      const updatedTodos = todos.map((todo, idx) =>
                        idx === index ? { ...todo, title: event.target.value } : todo
                      )
                      handleSubmit(updatedTodos) //Antagligen inte så bra med så många anrop
                    }}
                  />
                  <Button
                    sx={{ margin: '8px' }}
                    size='small'
                    color='secondary'
                    onClick={() => handleDelete(index)}
                  >
                    <DeleteIcon />
                  </Button>
                </div>
              )
          )}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                if (todos[todos.length - 1].title.trim().length > 0) {
                  const updatedTodos = [...todos, { title: '', completed: false }]
                  setTodos(updatedTodos)
                  console.log('Sent to setTodos state:', updatedTodos)
                } else {
                  alert('Complete the current todo before adding a new one!')
                }
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}