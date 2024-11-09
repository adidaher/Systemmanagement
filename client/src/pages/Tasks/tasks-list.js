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
import { withTranslation } from "react-i18next"
import { getTasksSuccess, deleteTaskSuccess } from "store/tasks/actions"
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import { useLazyQuery, gql, useMutation } from "@apollo/client"
import DeleteModal from "components/Common/DeleteModal"
import { toast, ToastContainer } from "react-toastify"
import {
  setTaskStatus,
  setSubTaskStatus,
  addSubTaskMutation,
} from "apiCalls/apicalls"
import config from "config"
import axios from "axios"
import emailjs from "@emailjs/browser"
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
const GET_TASKS_List = gql`
  query retrieveTasks {
    retrieveTasks {
      task_id
      task_name
      task_partners
      task_status
      task_deadline
      task_description
      subtasks {
        subtask_id
        subtask_name
        subtask_status
        subtask_description
        subtask_deadline
      }
    }
  }
`
const TasksList = props => {
  document.title = "Task List | CPALINK"
  const [currentUser, setCurrentUser] = useState(() => {
    const authUser = localStorage.getItem("authUser")
    return authUser ? JSON.parse(authUser) : null
  })
  const dispatch = useDispatch()
  const [selectedTask, setSelectedTask] = useState(null)
  const [expandedTaskId, setExpandedTaskId] = useState(null) // State to track expanded task
  const [getTasks, { loading, data }] = useLazyQuery(GET_TASKS_BY_STATUS)
  const [getTaskList, { tasksloading, tasksdata }] =
    useLazyQuery(GET_TASKS_List)
  const [deleteModal, setDeleteModal] = useState(false)
  const [sortedTasks, setSortedTasks] = useState([])
  const [isAscending, setIsAscending] = useState(true)
  const [deleteTask] = useMutation(DELETE_TASK)
  const tasksSelector = createSelector(
    state => state.tasks,
    tasks => tasks.tasks
  )

  const tasks = useSelector(tasksSelector)
  const { setTaskStatusMutation, loadingstatus } = setTaskStatus()
  const { setSubTaskStatusMutation } = setSubTaskStatus()

  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      const fetchTasks = async () => {
        try {
          //const { data } = await getTasks()
          const { data } = await getTaskList()
          if (data) {
            dispatch(getTasksSuccess(data.retrieveTasks))
          }
        } catch (err) {
          console.error("Error fetching tasks:", err)
        }
      }

      fetchTasks()
    }
  }, [tasks, getTaskList, dispatch])

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

  const setCompletedTask = ({ task_id }) => {
    if (!task_id) {
      console.error("task_id is undefined")
      return
    }
    setTaskStatusMutation({
      variables: { task_id, task_status: "Completed" },
    })
  }

  const setinProgressTask = ({ task_id }) => {
    if (!task_id) {
      console.error("task_id is undefined")
      return
    }
    setTaskStatusMutation({
      variables: { task_id, task_status: "in Progress" },
    })
  }

  const handleUpdateStatus = (subtaskId, newStatus) => {
    setSubTaskStatusMutation({
      variables: { subtask_id: subtaskId, subtask_status: newStatus },
    })
  }
  const handleTasksByMail = () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              background-color: #f9f9f9;
            }
            h1 {
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              background-color: #fff;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border: 1px solid #ddd;
            }
            th {
              background-color: #4CAF50;
              color: white;
            }
            tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            tr:hover {
              background-color: #ddd;
            }
            td {
              word-wrap: break-word;
            }
            .subtask-row td {
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <h1>Tasks Report</h1>
          <p>Here is the list of tasks with their subtasks:</p>
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Partners</th>
              </tr>
            </thead>
            <tbody>
              ${tasks
                .map(
                  task => `
                  <tr>
                    <td>${task.task_name || "N/A"}</td>
                    <td>${formatDate(task.task_deadline) || "N/A"}</td>
                    <td>${task.task_status || "N/A"}</td>
                    <td>${task.task_partners?.join(", ") || "N/A"}</td>
                  </tr>
                  ${task.subtasks
                    ?.map(
                      subtask => `
                    <tr class="subtask-row">
                      <td style="padding-left: 20px;">${
                        subtask.subtask_name || "N/A"
                      }</td>
                      <td>${formatDate(subtask.subtask_deadline) || "N/A"}</td>
                      <td>${subtask.subtask_status || "N/A"}</td>
                    </tr>
                  `
                    )
                    .join("")}
                `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `
    //to_email
    const templateParams = {
      to_email: "cohensahar17@gmail.com",
      subject: "Task Report",
      html: htmlContent,
    }

    emailjs
      .send(
        "service_rhlu9s9",
        "template_1fj0kpv",
        templateParams,
        "r-OVdJGszMAElSpIl"
      )
      .then(
        response => {
          console.log("Email sent successfully:", response)
          toast.success("Email sent successfully!", { autoClose: 2000 })
        },
        error => {
          console.error("Error sending email:", error)
          toast.error("Failed to send email.", { autoClose: 2000 })
        }
      )
  }
  return (
    <section className={""} style={{ backgroundColor: "#eee" }}>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteConfirm}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="container py-5  ">
        <div
          className="row d-flex justify-content-center align-items-center h-100 "
          style={{ paddingTop: "40px" }}
        >
          <div className="col-md-12 col-xl-12 ">
            <button className="mb-50" onClick={handleTasksByMail}>
              {props.t("Get Tasks by mail")}
            </button>
            <div className="card border mt-10" style={{ borderRadius: 15 }}>
              <div className="card-header p-3">
                <h5 className="mb-0">
                  <i className="fas fa-tasks me-2"></i>
                  {props.t("Task List")}
                </h5>
              </div>
              <div className="card-body" data-mdb-perfect-scrollbar="true">
                <table className="table mb-0">
                  <thead>
                    <tr className="text-center">
                      <th scope="col">{props.t("Title")}</th>
                      <th scope="col">{props.t("Description")}</th>
                      <th scope="col">{props.t("Priority")}</th>
                      <th scope="col" onClick={sortTasksByDeadline}>
                        {props.t("Start at")}
                      </th>
                      <th scope="col"> {props.t("Action")}</th>
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
                          {/* Main task row */}
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
                                  style={{
                                    backgroundColor: "#f8f9fa",
                                    padding: "10px",
                                    borderRadius: "5px",
                                  }}
                                >
                                  <table className="table table-borderless mb-0">
                                    <tbody>
                                      {/* Main Task Details */}
                                      <>
                                        <tr key={task.task_id}>
                                          <td>
                                            <strong>
                                              {props.t("Partners")}:
                                            </strong>{" "}
                                            {task.task_partners.join(", ")}
                                          </td>
                                          <td>
                                            <strong>
                                              {props.t("Description")}:
                                            </strong>{" "}
                                            {task.task_description}
                                          </td>
                                          <td>
                                            <strong>
                                              {props.t("Status")}:
                                            </strong>{" "}
                                            <span
                                              className={`badge ${
                                                task.task_status ===
                                                "in Progress"
                                                  ? "bg-primary"
                                                  : task.task_status ===
                                                    "Up comming"
                                                  ? "bg-warning text-dark"
                                                  : "bg-success"
                                              }`}
                                            >
                                              {task.task_status}
                                            </span>
                                          </td>
                                          <td>
                                            <strong>
                                              {props.t("Deadline")}:
                                            </strong>{" "}
                                            {formatDate(task.task_deadline)}
                                          </td>
                                          <td>
                                            {/* Buttons for updating task status */}
                                            {currentUser?.role === "admin" &&
                                              task.task_status ===
                                                "in Progress" && (
                                                <Button
                                                  color="success"
                                                  size="sm"
                                                  onClick={() =>
                                                    setCompletedTask({
                                                      task_id: task.task_id,
                                                    })
                                                  }
                                                >
                                                  {props.t("Set to Completed")}
                                                </Button>
                                              )}
                                            {currentUser?.role === "admin" &&
                                              task.task_status ===
                                                "Up comming" && (
                                                <Button
                                                  color="primary"
                                                  size="sm"
                                                  onClick={() =>
                                                    setinProgressTask({
                                                      task_id: task.task_id,
                                                    })
                                                  }
                                                >
                                                  {props.t(
                                                    "Set to In Progress"
                                                  )}
                                                </Button>
                                              )}
                                          </td>
                                        </tr>
                                      </>

                                      {/* Subtasks, if available */}
                                      <>
                                        {task.subtasks?.map(subtask => (
                                          <tr key={subtask.subtask_id}>
                                            <td>
                                              <strong>
                                                {props.t("Subtask Name")}:
                                              </strong>{" "}
                                              {subtask.subtask_name}
                                            </td>
                                            <td>
                                              <strong>
                                                {props.t("Description")}:
                                              </strong>{" "}
                                              {subtask.subtask_description}
                                            </td>
                                            <td>
                                              <strong>
                                                {props.t("Status")}:
                                              </strong>{" "}
                                              <span
                                                className={`badge ${
                                                  subtask.subtask_status ===
                                                  "in Progress"
                                                    ? "bg-primary"
                                                    : task.task_status ===
                                                      "Up comming"
                                                    ? "bg-warning text-dark"
                                                    : "bg-success"
                                                }`}
                                              >
                                                {subtask.subtask_status}
                                              </span>
                                            </td>
                                            <td>
                                              <strong>
                                                {props.t("Deadline")}:
                                              </strong>{" "}
                                              {formatDate(
                                                subtask.subtask_deadline
                                              )}
                                            </td>
                                            <td>
                                              {/* Buttons for updating subtask status */}
                                              {currentUser?.role === "admin" &&
                                                subtask.subtask_status ===
                                                  "in Progress" && (
                                                  <Button
                                                    color="success"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleUpdateStatus(
                                                        subtask.subtask_id,
                                                        "Completed"
                                                      )
                                                    }
                                                  >
                                                    {props.t(
                                                      "Set to Completed"
                                                    )}
                                                  </Button>
                                                )}
                                              {currentUser?.role === "admin" &&
                                                subtask.subtask_status ===
                                                  "Up comming" && (
                                                  <Button
                                                    color="primary"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleUpdateStatus(
                                                        subtask.subtask_id,
                                                        "in Progress"
                                                      )
                                                    }
                                                  >
                                                    {props.t(
                                                      "Set to In Progress"
                                                    )}
                                                  </Button>
                                                )}
                                            </td>
                                          </tr>
                                        ))}
                                      </>
                                    </tbody>
                                  </table>
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

export default withRouter(withTranslation()(TasksList))
