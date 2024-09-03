import React, { useEffect, useState } from "react"
import { useLazyQuery, gql, useMutation } from "@apollo/client"
import { getTasksSuccess } from "store/tasks/actions"
import { useSelector, useDispatch } from "react-redux"
import { getProjectsSuccess } from "store/projects/actions"
import { getEventsSuccess } from "store/calendar/actions"
const GET_USER_EVENTS = gql`
  query GetUserEvents($userEmail: String!) {
    userEvents(userEmail: $userEmail) {
      id
      user_id
      title
      start_timestamp
      end_timestamp
      event_class
      shared_with
    }
  }
`

const GET_TASKS_BY_STATUS = gql`
  query getAllTasks {
    getAllTasks {
      task_id
      task_name
      task_partners
      task_status
      task_deadline
      task_description
    }
  }
`

const GET_PROJECTS_BY_OFFICE_ID = gql`
  query GetProjectsByOfficeID($office_id: ID!) {
    casesOfCustomersDetailsByOfficeID(office_id: $office_id) {
      case_id
      customer {
        customer_id
        first_name
        last_name
        email
      }
      office {
        office_id
        name
      }
      case_details {
        id
        office_id
        case_description
      }
    }
  }
`

export const useGetAllTasks = () => {
  const dispatch = useDispatch()

  const [getTasks, { loading, data, error }] = useLazyQuery(GET_TASKS_BY_STATUS)

  const fetchTasks = async () => {
    try {
      const { data } = await getTasks()
      if (data) {
        dispatch(getTasksSuccess(data.getAllTasks))
      }
    } catch (err) {
      console.error("Error fetching tasks:", err)
    }
  }

  return { fetchTasks, loading, data, error }
}

export const useGetProjectsOfOffice = office_id => {
  const dispatch = useDispatch()
  const [getProjects, { data, loading, error }] = useLazyQuery(
    GET_PROJECTS_BY_OFFICE_ID,
    {
      variables: { office_id },
      onCompleted: data => {
        if (data?.casesOfCustomersDetailsByOfficeID) {
          dispatch(getProjectsSuccess(data.casesOfCustomersDetailsByOfficeID))
        }
      },
    }
  )

  return { getProjects, loading, data, error }
}

const convertEvents = events => {
  return events.map(event => convertEvent(event))
}

// Utility function to convert a single event
const convertEvent = event => {
  return {
    id: event.id,
    title: event.title,
    start: new Date(parseInt(event.start_timestamp)),
    end: event.end_timestamp ? new Date(parseInt(event.end_timestamp)) : null,
    className: event.event_class,
    extendedProps: {
      shared_with: event.shared_with,
    },
  }
}

export const useGetUserEvents = userEmail => {
  const dispatch = useDispatch()
  const [getEvents, { data, loading, error }] = useLazyQuery(GET_USER_EVENTS, {
    variables: { userEmail: userEmail },
    onCompleted: data => {
      if (data?.userEvents) {
        const formattedEvents = convertEvents(data.userEvents)
        dispatch(getEventsSuccess(formattedEvents))
      }
    },
  })

  return { getEvents, loading, data, error }
}
