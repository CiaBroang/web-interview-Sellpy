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
  const todos = todoList.todos

  const handleSubmit = async (todosToSubmit) => {
    const listId = todoList.id

    const data = { listId, todos: todosToSubmit }

    const response = await fetch('http://localhost:3001/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const responseData = await response.json()
    if (response.ok) {
      const updatedTodos = responseData.todos
      saveTodoList(listId, { todos: updatedTodos })
    } else alert(responseData.message)
  }

  const handleDelete = async (listId, todoId) => {
    const data = { listId, todoId }
    await fetch(`http://localhost:3001/data`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const updatedTodos = todos.filter((todo) => todo.id !== todoId)

    saveTodoList(listId, { todos: updatedTodos })
  }

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '1rem' }}>
          {todos.map((todoToRender, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ margin: '8px' }} variant='h6'>
                {index + 1}
              </Typography>
              <Checkbox
                checked={todoToRender.completed}
                onChange={(event) => {
                  const updatedTodos = todos.map((todo) =>
                    todoToRender.id === todo.id
                      ? { ...todo, completed: event.target.checked }
                      : todo
                  )
                  handleSubmit(updatedTodos)
                }}
              />
              <TextField
                sx={{ flexGrow: 1, marginTop: '1rem', marginRight: '1rem' }}
                label='What to do?'
                value={todoToRender.title}
                onChange={(event) => {
                  const updatedTodos = todos.map((todo) =>
                    todoToRender.id === todo.id ? { ...todo, title: event.target.value } : todo
                  )
                  handleSubmit(updatedTodos)
                }}
              />
              <TextField
                type='date'
                sx={{ flexGrow: 1, marginTop: '1rem' }}
                value={todoToRender.dueDate ? todoToRender.dueDate.split('T')[0] : ''}
                onChange={(event) => {
                  const updatedTodos = todos.map((todo) =>
                    todoToRender.id === todo.id
                      ? {
                          ...todo,
                          dueDate: new Date(event.target.value).toISOString(),
                        }
                      : todo
                  )
                  handleSubmit(updatedTodos)
                }}
              />
              <Button
                sx={{ margin: '8px' }}
                size='small'
                color='primary'
                onClick={() => handleDelete(todoList.id, todoToRender.id)}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                const updatedTodos = [...todos, { title: '', completed: false, dueDate: '' }]
                saveTodoList(todoList.id, { todos: updatedTodos })
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
