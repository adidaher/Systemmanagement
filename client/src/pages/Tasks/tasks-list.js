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
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { getTasksSuccess } from "store/tasks/actions"
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import { useLazyQuery, gql } from "@apollo/client"

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

const TasksList = () => {
  document.title = "Task List | CPALINK"

  const dispatch = useDispatch()
  const [selectedTask, setSelectedTask] = useState(null)
  const [getTasks, { loading, data }] = useLazyQuery(GET_TASKS_BY_STATUS)
  const [completedTasks, setCompletedTasks] = useState([])
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [inProgressTasks, setInProgressTasks] = useState([])

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
      setCompletedTasks(tasks.filter(task => task.task_status === "completed"))
      setUpcomingTasks(tasks.filter(task => task.task_status === "Up comming"))
      setInProgressTasks(
        tasks.filter(task => task.task_status === "in progress")
      )
    }
  }, [tasks])

  const formatDate = timestamp => {
    const date = new Date(parseInt(timestamp, 10))
    return date.toLocaleDateString()
  }

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title="Tasks" breadcrumbItem="Task List" />
        <Row>
          {loading ? (
            <Spinner
              color="primary"
              className="position-absolute top-50 start-50"
            />
          ) : (
            <Col lg={8}>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Completed Tasks</h4>
                  <div className="table-responsive">
                    <table className="table table-nowrap align-middle mb-0">
                      <tbody>
                        {completedTasks.length > 0 ? (
                          completedTasks.map((task, index) => (
                            <tr
                              key={index}
                              onClick={() => setSelectedTask(task)}
                            >
                              <td style={{ width: "40px" }}>
                                <div className="form-check font-size-16">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`completedTaskCheck${index}`}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`completedTaskCheck${index}`}
                                  ></label>
                                </div>
                              </td>
                              <td>
                                <h5 className="text-truncate font-size-14 m-0">
                                  <Link to="#" className="text-dark">
                                    {task.task_name}
                                  </Link>
                                </h5>
                              </td>
                              <td>
                                <div className="avatar-group">
                                  {task.task_partners.map((partner, idx) => (
                                    <div
                                      className="avatar-group-item"
                                      key={idx}
                                    >
                                      <div className="avatar-xs">
                                        <span className="avatar-title rounded-circle bg-primary text-white font-size-16">
                                          {partner.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <span className="badge rounded-pill badge-soft-success font-size-11">
                                    {task.task_status}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No Completed Tasks
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Upcoming Tasks</h4>
                  <div className="table-responsive">
                    <table className="table table-nowrap align-middle mb-0">
                      <tbody>
                        {upcomingTasks.length > 0 ? (
                          upcomingTasks.map((task, index) => (
                            <tr
                              key={index}
                              onClick={() => setSelectedTask(task)}
                            >
                              <td style={{ width: "40px" }}>
                                <div className="form-check font-size-16">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`upcomingTaskCheck${index}`}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`upcomingTaskCheck${index}`}
                                  ></label>
                                </div>
                              </td>
                              <td>
                                <h5 className="text-truncate font-size-14 m-0">
                                  <Link to="#" className="text-dark">
                                    {task.task_name}
                                  </Link>
                                </h5>
                              </td>
                              <td>
                                <div className="avatar-group">
                                  {task.task_partners.map((partner, idx) => (
                                    <div
                                      className="avatar-group-item"
                                      key={idx}
                                    >
                                      <div className="avatar-xs">
                                        <span className="avatar-title rounded-circle bg-primary text-white font-size-16">
                                          {partner.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <span className="badge rounded-pill badge-soft-warning font-size-11">
                                    {task.task_status}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No Upcoming Tasks
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">In Progress Tasks</h4>
                  <div className="table-responsive">
                    <table className="table table-nowrap align-middle mb-0">
                      <tbody>
                        {inProgressTasks.length > 0 ? (
                          inProgressTasks.map((task, index) => (
                            <tr
                              key={index}
                              onClick={() => setSelectedTask(task)}
                            >
                              <td style={{ width: "40px" }}>
                                <div className="form-check font-size-16">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`inProgressTaskCheck${index}`}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`inProgressTaskCheck${index}`}
                                  ></label>
                                </div>
                              </td>
                              <td>
                                <h5 className="text-truncate font-size-14 m-0">
                                  <Link to="#" className="text-dark">
                                    {task.task_name}
                                  </Link>
                                </h5>
                              </td>
                              <td>
                                <div className="avatar-group">
                                  {task.task_partners.map((partner, idx) => (
                                    <div
                                      className="avatar-group-item"
                                      key={idx}
                                    >
                                      <div className="avatar-xs">
                                        <span className="avatar-title rounded-circle bg-primary text-white font-size-16">
                                          {partner.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  <span className="badge rounded-pill badge-soft-primary font-size-11">
                                    {task.task_status}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center">
                              No In Progress Tasks
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}
          <Col lg={4}>
            {selectedTask && (
              <Card>
                <CardBody>
                  <CardTitle className="mb-3">Task Details</CardTitle>
                  <div>
                    <strong>Name:</strong> {selectedTask.task_name}
                    <div className="mt-3">
                      <strong>Partners:</strong>
                      <div
                        className="avatar-group"
                        style={{
                          marginTop: "5px",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {selectedTask.task_partners.map((partner, index) => (
                          <div
                            key={index}
                            className="avatar-xs d-inline-block"
                            style={{ flex: 1 }}
                          >
                            <span
                              className="avatar-title rounded-circle bg-primary text-white font-size-16"
                              style={{ width: "40px" }}
                            >
                              {partner.charAt(0).toUpperCase()}
                            </span>
                            <span
                              className="ms-1 font-size-12"
                              style={{ textAlign: "center" }}
                            >
                              {partner}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5">
                      <strong>Status:</strong> {selectedTask.task_status}
                    </div>
                    <div className="mt-3">
                      <strong>Deadline:</strong>{" "}
                      {formatDate(selectedTask.task_deadline)}
                    </div>
                    <div className="mt-3">
                      <strong>Description:</strong>{" "}
                      {selectedTask.task_description}
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default withRouter(TasksList)
