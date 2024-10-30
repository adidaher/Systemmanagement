import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap"
import loaderImg from "assets/images/loadingg.gif"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { getChartsData as onGetChartsData } from "../../store/actions"

// Components
import ActivityComp from "./ActivityComp"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import TotalSellingProduct from "../Dashboard-saas/total-selling-product"
import SalesAnalytics from "../Dashboard-saas/sales-analytics"
import { withTranslation } from "react-i18next"

// API Hooks
import {
  useGetAllTasks,
  useGetProjectsOfOffice,
  useGetUserEvents,
} from "apiCalls/apicalls"

const Dashboard = props => {
  const [loading, setLoading] = useState(false)
  const [completedTasks, setCompletedTasks] = useState([])
  const [taskTodo, setTaskTodo] = useState([])
  const [deferredTasks, setDeferredTasks] = useState([])

  const dispatch = useDispatch()
  const tasks = useSelector(state => state.tasks.tasks)
  const projects = useSelector(state => state.projects)
  const events = useSelector(state => state.calendar.events)

  const [currentUser, setCurrentUser] = useState(() => {
    const authUser = localStorage.getItem("authUser")
    return authUser ? JSON.parse(authUser) : null
  })

  // API Hooks
  const { fetchTasks, loading: loadingTasks } = useGetAllTasks()
  const { getProjects, loading: loadingProjects } = useGetProjectsOfOffice(
    currentUser?.office_id
  )
  const { getEvents, loading: loadingEvents } = useGetUserEvents(
    currentUser?.email
  )

  // Unified data fetching function
  const fetchAllData = async () => {
    setLoading(true)
    try {
      // Fetch tasks
      if (!tasks || tasks.length === 0) {
        await fetchTasks()
      }

      // Fetch projects
      if (!projects || projects.length === 0) {
        console.log("fetching projects...")
        await getProjects()
      }

      // Fetch events
      if (!events || events.length === 0) {
        console.log("fetching events...")
        await getEvents()
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData()
  }, [currentUser])

  // Categorizing tasks
  useEffect(() => {
    if (tasks) {
      const completed = tasks.filter(task => task.task_status === "completed")
      setCompletedTasks(completed)

      const inProgress = tasks.filter(
        task => task.task_status === "in Progress"
      )
      setTaskTodo(inProgress)

      const deferred = tasks.filter(task => task.task_status === "Up comming")
      setDeferredTasks(deferred)
    }
  }, [tasks])

  // Dispatch charts data
  /*useEffect(() => {
    dispatch(onGetChartsData("yearly"))
  }, [dispatch])*/

  document.title = `${props.t("Dashboard")} | CPALINK`

  // Show a loading spinner until all data is fetched
  const isLoading = loading || loadingTasks || loadingProjects || loadingEvents

  return (
    <div className="page-content">
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <img
            src={loaderImg}
            alt="Loading..."
            className="w-10 h-10 justify-content-center"
          />
        </div>
      ) : (
        <Container fluid>
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />

          {/* Dashboard Header */}
          <Card className="overflow-hidden">
            <CardBody className="pt-0">
              <Row>
                <Col sm="4">
                  <h3 className="font-size-15 mt-5">
                    {`${currentUser?.first_name} ${currentUser?.last_name}`}
                  </h3>
                  <p className="text-muted mb-0">{currentUser?.role}</p>
                  <div className="mt-4">
                    <Link
                      to="/contacts-profile"
                      className="btn btn-primary btn-sm"
                    >
                      {props.t("View Profile")}{" "}
                      <i className="mdi mdi-arrow-left ms-1" />
                    </Link>
                  </div>
                </Col>

                <Col sm={8}>
                  <div className="pt-4 mt-4">
                    <Row>
                      <Col xs="6">
                        <h5 className="font-size-15">{projects.length}</h5>
                        <p className="text-muted mb-0">{props.t("Projects")}</p>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* Tasks and Stats */}
          <Row>
            <Col md="3">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        {props.t("Tasks Todo")}
                      </p>
                      <h4 className="mb-0">{taskTodo.length}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        {props.t("Tasks Performed")}
                      </p>
                      <h4 className="mb-0">{completedTasks.length}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="3">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        {props.t("Deferred Tasks")}
                      </p>
                      <h4 className="mb-0">{deferredTasks.length}</h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col
              md="2"
              className="d-flex justify-content-center align-items-center"
            >
              <Link to="/tasks-list" className="btn btn-primary btn-sm">
                {props.t("View Tasks")}{" "}
                <i className="mdi mdi-arrow-left ms-1" />
              </Link>
            </Col>
          </Row>

          {/* Sales Analytics and Activity Component */}
          <Row>
            <SalesAnalytics
              dataColors='["--bs-primary", "--bs-success", "--bs-danger"]'
              completed={completedTasks.length}
              todo={taskTodo.length}
              deferredTasks={deferredTasks.length}
            />
            <Col xll="4">
              <Card>
                <CardBody>
                  <CardTitle className="mb-5">
                    {props.t("Upcoming Events")}
                  </CardTitle>
                  {events && events.length > 0 ? (
                    <ul className="verti-timeline list-unstyled">
                      {events?.map((item, index) => (
                        <li className={`event-list `} key={index}>
                          <div className="event-timeline-dot">
                            <i
                              className={`font-size-18 bx bx-right-arrow-circle`}
                            />
                          </div>
                          <div className="flex-shrink-0 d-flex">
                            <div className="me-3">
                              <h5 className="font-size-14">
                                {item.start.toLocaleDateString()}
                                <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2" />
                              </h5>
                            </div>
                            <div className="flex-grow-1">
                              <div>{item.title}</div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>No activities</div>
                  )}
                  <div className="text-center mt-4">
                    <Link
                      to="/calendar"
                      className="btn btn-primary waves-effect waves-light btn-sm"
                    >
                      {props.t("View More")}{" "}
                      <i className="mdi mdi-arrow-right ms-1" />
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  )
}

Dashboard.propTypes = {
  t: PropTypes.any,
}

export default withTranslation()(Dashboard)
