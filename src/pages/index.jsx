import React, { useState, useEffect } from 'react'

import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import {
  GET_USERS_TODOS,
  GET_USERS_TODOS_BY_ID,
  UPDATE_TODO_STATUS_BY_ID
} from '../api/apollo-client'

import Activities from '../components/Activities/Avtivities'
import Search from '../components/Seach/Search'

export default function Index(props) {
  const [activities, setActivities] = useState([])
  const [inputActivity, setinputActivity] = useState('')
  const [inputUserId, setinputUserId] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const [getData, { data: lazyData, loading: lazyLoading, error: lazyError }] =
    useLazyQuery(GET_USERS_TODOS_BY_ID)
  const [
    mutationFunction,
    { data: mutationData, loading: mutationLoading, error: mutationError }
  ] = useMutation(UPDATE_TODO_STATUS_BY_ID)

  useEffect(() => {
    if (!lazyData) return

    const todos = lazyData.todos.map((todo) => ({
      id: todo.id,
      activity: todo.title,
      finished: todo.is_done
    }))

    setActivities(todos)
    setinputUserId('')
  }, [lazyData])

  useEffect(() => {
    if (!mutationData) return
    if (mutationError) console.error(mutationError)

    const { id, is_done } = mutationData.update_todos_by_pk
    console.log(id, is_done)
    setActivities((prev) =>
      prev.map((act) =>
        act.id === id ? { ...act, finished: is_done, loading: false } : act
      )
    )
  }, [mutationData, mutationError])

  function handleChangeInput(event) {
    setinputActivity(event.target.value)
  }

  function handleSubmitActivity() {
    if (!inputActivity) return togglePopup(true)

    const newActivities = {
      id: uuidv4(),
      activity: inputActivity,
      finished: false
    }

    setActivities([...activities, newActivities])
    setinputActivity('')
    setIsOpen(false)
  }

  function handleToggleActivity(id) {
    const [act] = activities.filter((act) => act.id === id)
    mutationFunction({ variables: { id, is_done: !act.finished } })
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, loading: true } : act))
    )
  }

  function handleDeleteActivity(id) {
    setActivities(activities.filter((act) => act.id !== id))
  }

  function togglePopup(status) {
    setIsOpen(status)
  }

  function handleChangeInputUserId(event) {
    setinputUserId(event.target.value)
  }

  function handleGetTodos() {
    getData({ variables: { id: inputUserId } })
  }

  return (
    <div className="w-10/12 max-w-screen-md mx-auto">
      <div className="my-12">
        <h1 className="w-min mx-auto my-4 font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-yellow-300 via-green-400 to-blue-500">
          Todos
        </h1>
      </div>

      <Search
        value={inputActivity}
        handleChangeInput={handleChangeInput}
        handleSubmitActivity={handleSubmitActivity}
        isOpen={isOpen}
        togglePopup={togglePopup}
        placeholder="Add todo..."
      />

      <Activities
        activities={activities}
        handleToggleActivity={handleToggleActivity}
        handleDeleteActivity={handleDeleteActivity}
      />

      <div className=" relative mt-12 text-center ">
        <div className="max-w-xs mx-auto h-8 ">
          <Search
            value={inputUserId}
            handleChangeInput={handleChangeInputUserId}
            handleSubmitActivity={handleGetTodos}
            isOpen={false}
            placeholder="Search user..."
            disabled={lazyLoading}
          />
        </div>

        {lazyLoading && (
          <h1 className="my-8 text-xl text-center">Fetching data...</h1>
        )}
        {lazyError && (
          <h1 className="my-8 text-xl text-center">
            Failed fetching user's data {':('}
          </h1>
        )}
      </div>
    </div>
  )
}
