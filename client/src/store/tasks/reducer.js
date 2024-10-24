import {
  GET_TASKS_SUCCESS,
  GET_TASKS_FAIL,
  DELETE_KANBAN,
  DELETE_TASK_SUCCESS,
  DELETE_KANBAN_FAIL,
  ADD_CARD_DATA_SUCCESS,
  ADD_CARD_DATA_FAIL,
  UPDATE_CARD_DATA_SUCCESS,
  UPDATE_CARD_DATA_FAIL,
  UPDATE_TASK_SUCCESS,
} from "./actionTypes"

const INIT_STATE = {
  tasks: [],
  error: {},
  loading: true,
}

const tasks = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action.payload,
        loading: true,
      }

    case GET_TASKS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case ADD_CARD_DATA_SUCCESS:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      }

    case ADD_CARD_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case UPDATE_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.task_id === action.payload.task_id
            ? { ...task, ...action.payload } // Update the task with the new data
            : task
        ),
      }

    case UPDATE_CARD_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case DELETE_KANBAN:
      return {
        ...state,
        tasks: state.tasks.map(task => {
          const updatedCards = task.cards.filter(
            tasks => tasks.id !== action.payload
          )
          return { ...task, cards: updatedCards }
        }),
      }

    case DELETE_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.filter(
          task => task.task_id !== action.payload.task_id
        ),
      }

    case DELETE_KANBAN_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

export default tasks
