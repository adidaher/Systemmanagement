import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import { Card, CardBody, Col, Container, Row, CardTitle } from "reactstrap"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Spinner } from "reactstrap"

//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"

import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client"
import Spinners from "components/Common/Spinner"

const GET_TASKS_BY_STATUS = gql`
  query GetTasksByStatus($status: String!) {
    getTasksByStatus(status: $status) {
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
  //meta title
  document.title = "Task List | CPALINK"

  const dispatch = useDispatch()
  const [completedTask, setCompletedTask] = useState([])
  const [upcomingTask, setUpcomingTask] = useState([])
  const [inProgressTask, setInProgressTask] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [getTasks, { loading, data }] = useLazyQuery(GET_TASKS_BY_STATUS)
  /*
  const TaskstaskProperties = createSelector(
    state => state.tasks,
    Tasks => ({
      tasks: Tasks.tasks,
    })
  )*/

  // const { tasks } = useSelector(TaskstaskProperties)
  /*
  useEffect(() => {
    dispatch(onGetTasks())
  }, [dispatch])*/

  useEffect(() => {
    getTasks({ variables: { status: "completed" } }).then(res => {
      if (res.data) {
        setCompletedTask(res.data.getTasksByStatus)
      }
    })

    getTasks({ variables: { status: "Up comming" } }).then(res => {
      if (res.data) {
        setUpcomingTask(res.data.getTasksByStatus)
      }
    })

    getTasks({ variables: { status: "in Progress" } }).then(res => {
      if (res.data) {
        setInProgressTask(res.data.getTasksByStatus)
      }
    })
  }, [getTasks])

  const formatDate = timestamp => {
    const date = new Date(parseInt(timestamp))
    return date.toLocaleDateString()
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Tasks" breadcrumbItem="Task List" />
          {/* Render Breadcrumbs */}
          <Row>
            {loading ? (
              <Spinner
                color="primary"
                className="position-absolute top-50 start-50"
              />
            ) : (
              !loading && (
                <Col lg={8}>
                  <Card>
                    <CardBody>
                      <h4 className="card-title mb-4">Completed Tasks</h4>
                      <div className="table-responsive">
                        <table className="table table-nowrap align-middle mb-0">
                          <tbody>
                            {completedTask &&
                              completedTask.map((task, index) => (
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
                                      {task.task_partners.map(
                                        (partner, idx) => (
                                          <div
                                            className="avatar-group-item"
                                            key={idx}
                                          >
                                            <div className="avatar-xs">
                                              <span className="avatar-title rounded-circle bg-primary text-white font-size-16">
                                                {partner
                                                  .charAt(0)
                                                  .toUpperCase()}
                                              </span>
                                            </div>
                                          </div>
                                        )
                                      )}
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
                              ))}

                            {!completedTask && <span> No Completed Task</span>}
                          </tbody>
                        </table>
                      </div>
                    </CardBody>
                  </Card>
                  {/* Upcoming Tasks */}
                  <Card>
                    <CardBody>
                      <h4 className="card-title mb-4">Upcoming Tasks</h4>
                      <div className="table-responsive">
                        <table className="table table-nowrap align-middle mb-0">
                          <tbody>
                            {upcomingTask &&
                              upcomingTask.map((task, index) => (
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
                                      {task.task_partners.map(
                                        (partner, idx) => (
                                          <div
                                            className="avatar-group-item"
                                            key={idx}
                                          >
                                            <div className="avatar-xs">
                                              <span className="avatar-title rounded-circle bg-primary text-white font-size-16">
                                                {partner
                                                  .charAt(0)
                                                  .toUpperCase()}
                                              </span>
                                            </div>
                                          </div>
                                        )
                                      )}
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
                              ))}
                          </tbody>
                          {!upcomingTask && <span> No up-coming Task </span>}
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
                            {inProgressTask &&
                              inProgressTask.map((task, index) => (
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
                                      {task.task_partners.map(
                                        (partner, idx) => (
                                          <div
                                            className="avatar-group-item"
                                            key={idx}
                                          >
                                            <div className="avatar-xs">
                                              <span className="avatar-title rounded-circle bg-primary text-white font-size-16">
                                                {partner
                                                  .charAt(0)
                                                  .toUpperCase()}
                                              </span>
                                            </div>
                                          </div>
                                        )
                                      )}
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
                              ))}
                          </tbody>
                          {!inProgressTask && (
                            <span> No in Progress Task </span>
                          )}
                        </table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              )
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
                              className="avatar-xs d-inline-block "
                              style={{ flex: 1 }}
                            >
                              <span
                                className="avatar-title rounded-circle bg-primary text-white font-size-16 "
                                style={{ width: "40px" }}
                              >
                                {partner.charAt(0).toUpperCase()}
                              </span>
                              <span
                                className="ms-1 font-size-12 "
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
    </React.Fragment>
  )
}

export default withRouter(TasksList)
