import React, { Fragment, useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined'
import { TodoListForm } from './TodoListForm'

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()

  const completedLists = {}
  Object.values(todoLists).forEach((todoList) => {
    const isCompleted = todoList.todos.every((todo) => todo.completed)
    completedLists[todoList.id] = isCompleted
  })

  useEffect(() => {
    fetch('http://localhost:3001/data')
      .then((res) => res.json())
      .then(setTodoLists)
      .catch((err) => console.error('Failed to fetch todo lists', err))
  }, [])

  if (!Object.keys(todoLists).length) return null
  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {Object.keys(todoLists).map((key) => (
              <ListItem key={key} style={{ display: 'flex', alignItems: 'center' }}>
                {todoLists[key]?.todos.every((todo) => todo.completed) ? (
                  <CheckCircleOutlinedIcon color='success' fontSize='large' />
                ) : (
                  <CircleOutlinedIcon fontSize='large' />
                )}
                <ListItemButton onClick={() => setActiveList(key)}>
                  <ListItemText primary={todoLists[key].title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
      {todoLists[activeList] && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoLists[activeList]}
          saveTodoList={(id, { todos }) => {
            const listToUpdate = todoLists[id]
            setTodoLists({
              ...todoLists,
              [id]: { ...listToUpdate, todos },
            })
          }}
        />
      )}
      {completedLists[activeList] && (
        <Typography variant='h6' color='green'>
          You completed this todo list!
        </Typography>
      )}
    </Fragment>
  )
}
