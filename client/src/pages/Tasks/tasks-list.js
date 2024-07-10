import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  CardTitle,
  Spinner,
  Button,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getTasksSuccess, deleteTaskSuccess } from "store/tasks/actions"
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import { useLazyQuery, gql, useMutation } from "@apollo/client"
import DeleteModal from "components/Common/DeleteModal"
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"

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

const DELETE_TASK = gql`
  mutation deleteTask($id: ID!) {
    deleteTask(id: $id) {
      task_id
      task_name
      task_partners
      task_status
      task_deadline
      task_description
    }
  }
`

const TasksList = () => {
  document.title = "Task List | CPALINK"

  const dispatch = useDispatch()
  const [selectedTask, setSelectedTask] = useState(null)
  const [expandedTaskId, setExpandedTaskId] = useState(null) // State to track expanded task
  const [getTasks, { loading, data }] = useLazyQuery(GET_TASKS_BY_STATUS)
  const [deleteModal, setDeleteModal] = useState(false)
  const [sortedTasks, setSortedTasks] = useState([])
  const [isAscending, setIsAscending] = useState(true)
  const [deleteTask] = useMutation(DELETE_TASK)
  const tasksSelector = createSelector(
    state => state.tasks,
    tasks => tasks.tasks
  )

  const tasks = useSelector(tasksSelector)

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
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

      fetchTasks()
    }
  }, [tasks, getTasks, dispatch])

  useEffect(() => {
    if (tasks) {
      setSortedTasks(tasks)
    }
  }, [tasks])

  const formatDate = timestamp => {
    const date = new Date(parseInt(timestamp, 10))
    return date.toLocaleDateString()
  }

  const sortTasksByDeadline = () => {
    const sorted = [...sortedTasks].sort((a, b) => {
      return isAscending
        ? a.task_deadline - b.task_deadline
        : b.task_deadline - a.task_deadline
    })
    setIsAscending(!isAscending)
    setSortedTasks(sorted)
  }

  const toggleTaskDetails = taskId => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId)
  }

  const handleDelete = task => {
    setSelectedTask(task) // Set the task to be deleted
    setDeleteModal(true) // Show the delete confirmation modal
  }
  const handleDeleteConfirm = () => {
    deleteTask({ variables: { id: selectedTask.task_id } }).then(result => {
      toast.success("Event Deleted Successfully", { autoClose: 2000 })
    })

    dispatch(deleteTaskSuccess(selectedTask)) // Dispatch delete action
    setDeleteModal(false) // Close the delete modal
  }

  return (
    <section className={"vh-150"} style={{ backgroundColor: "#eee" }}>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteConfirm}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="container py-5 h-100 ">
        <div
          className="row d-flex justify-content-center align-items-center h-100 "
          style={{ paddingTop: "40px" }}
        >
          <div className="col-md-12 col-xl-12 ">
            <div className="card border" style={{ borderRadius: 15 }}>
              <div className="card-header p-3">
                <h5 className="mb-0">
                  <i className="fas fa-tasks me-2"></i> Task List
                </h5>
              </div>
              <div className="card-body" data-mdb-perfect-scrollbar="true">
                <table className="table mb-0">
                  <thead>
                    <tr className="text-center">
                      <th scope="col">Title</th>
                      <th scope="col">Description</th>
                      <th scope="col">Priority</th>
                      <th scope="col" onClick={sortTasksByDeadline}>
                        Start at
                      </th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading && (
                      <Spinner
                        color="primary"
                        className="position-absolute top-100 start-50"
                      />
                    )}
                    {sortedTasks.map(task => {
                      const isExpanded = task.task_id === expandedTaskId
                      return (
                        <React.Fragment key={task.task_id}>
                          <tr
                            className="fw-normal align-middle text-center"
                            onClick={() => toggleTaskDetails(task.task_id)}
                          >
                            <th>
                              <span
                                className="ms-2 d-inline-block text-truncate"
                                style={{ maxWidth: "150px" }}
                                title={task.task_name}
                              >
                                {task.task_name}
                              </span>
                            </th>

                            <td className="align-middle">
                              <span
                                className="d-inline-block text-truncate"
                                style={{ maxWidth: "150px" }}
                                title={task.task_description}
                              >
                                {task.task_description}
                              </span>
                            </td>

                            <td className="align-middle">
                              <h6 className="mb-0">
                                <span
                                  className={`badge ${
                                    task.task_status === "in Progress"
                                      ? "bg-primary"
                                      : task.task_status === "Up comming"
                                      ? "bg-warning text-dark"
                                      : "bg-success"
                                  } w-100`}
                                >
                                  {task.task_status}
                                </span>
                              </h6>
                            </td>

                            <td className="align-middle">
                              <span>{formatDate(task.task_deadline)}</span>
                            </td>

                            <td className="align-middle">
                              <Link
                                to="#"
                                title="show"
                                style={{ fontSize: "20px" }}
                              >
                                <i className="mdi mdi-eye" id="eyetooltip"></i>
                              </Link>
                              <Link to="#" onClick={() => handleDelete(task)}>
                                <i
                                  className="mdi mdi-delete "
                                  style={{ fontSize: "20px", color: "#dc3545" }}
                                ></i>
                              </Link>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr>
                              <td colSpan="5">
                                <div
                                  className="col d-flex justify-content-start align-items-center"
                                  style={{
                                    flexDirection: "column",
                                    paddingLeft: "20px",
                                    paddingTop: "10px",
                                  }}
                                >
                                  <p>
                                    <strong>Partners:</strong>{" "}
                                    {task.task_partners.join(", ")}
                                  </p>
                                  <p>
                                    <strong>Description:</strong>{" "}
                                    {task.task_description}
                                  </p>
                                  <p>
                                    <strong>Deadline:</strong>{" "}
                                    {formatDate(task.task_deadline)}
                                  </p>
                                  <p>
                                    <strong>Status:</strong> {task.task_status}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  )
}

export default withRouter(TasksList)
