import { useLazyQuery, gql, useMutation } from "@apollo/client"

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

// Function to fetch tasks
export const useFetchTasks = () => {
  const [getTasks, { loading, data, error }] = useLazyQuery(GET_TASKS_BY_STATUS)

  const fetchTasksCall = async () => {
    try {
      const { data } = await getTasks()
      if (data) {
        return data.getAllTasks
      }
    } catch (err) {
      console.error("Error fetching tasks:", err)
    }
  }

  return { fetchTasksCall, loading, data, error }
}
