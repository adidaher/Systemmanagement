import {
  GET_TASKS,
  GET_TASKS_FAIL,
  GET_TASKS_SUCCESS,
  DELETE_TASK_SUCCESS,
  DELETE_KANBAN_FAIL,
  DELETE_KANBAN,
  ADD_CARD_DATA,
  ADD_CARD_DATA_SUCCESS,
  ADD_CARD_DATA_FAIL,
  UPDATE_CARD_DATA,
  UPDATE_CARD_DATA_SUCCESS,
  UPDATE_CARD_DATA_FAIL,
  UPDATE_TASK_SUCCESS,
} from "./actionTypes"

export const getTasks = () => ({
  type: GET_TASKS,
})

export const getTasksSuccess = tasks => ({
  type: GET_TASKS_SUCCESS,
  payload: tasks,
})

export const getTasksFail = error => ({
  type: GET_TASKS_FAIL,
  payload: error,
})
export const updateTaskStatus = task => ({
  type: UPDATE_TASK_SUCCESS,
  payload: task,
})
export const deleteKanban = task => ({
  type: DELETE_KANBAN,
  payload: kanban,
})

export const deleteTaskSuccess = task => ({
  type: DELETE_TASK_SUCCESS,
  payload: task,
})

export const deleteKanbanFail = kanban => ({
  type: DELETE_KANBAN_FAIL,
  payload: kanban,
})

export const addCardData = data => ({
  type: ADD_CARD_DATA,
  payload: data,
})

export const addCardDataSuccess = cardData => ({
  type: ADD_CARD_DATA_SUCCESS,
  payload: cardData,
})

export const addCardDataFail = error => ({
  type: ADD_CARD_DATA_FAIL,
  payload: error,
})

export const updateCardData = card => ({
  type: UPDATE_CARD_DATA,
  payload: card,
})

export const updateCardDataSuccess = card => ({
  type: UPDATE_CARD_DATA_SUCCESS,
  payload: card,
})

export const updateCardDataFail = error => ({
  type: UPDATE_CARD_DATA_FAIL,
  payload: error,
})
