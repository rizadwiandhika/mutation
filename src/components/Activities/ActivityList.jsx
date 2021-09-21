import React from 'react'
import Loading from '../Loading/Loading'

export default function Activity(props) {
  return (
    <li className="px-4 py-2 flex justify-between border-b border-gray-300">
      <div className="flex gap-4 items-center">
        <div className="w-6 h-6 overflow-hidden flex justify-start items-center">
          {props.loading ? (
            <Loading />
          ) : (
            <input
              className="hover:cursor-pointer"
              onChange={() => props.handleToggleActivity(props.id)}
              type="checkbox"
              id="finished"
              checked={props.finished}
            />
          )}
        </div>
        <p className={props.finished ? 'line-through text-gray-400' : ''}>
          {props.activity}
        </p>
      </div>
      <button
        onClick={() => props.handleDeleteActivity(props.id)}
        className="w-14 h-14 text-sm rounded-full bg-gray-100 hover:bg-gray-200"
      >
        Delete
      </button>
    </li>
  )
}
