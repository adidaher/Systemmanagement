import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap"
import { Link } from "react-router-dom"
import loaderImg from "assets/images/loadingg.gif"

//import action
import { getChartsData as onGetChartsData } from "../../store/actions"

// Pages Components
import ActivityComp from "./ActivityComp"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//i18n
import { withTranslation } from "react-i18next"

//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import TotalSellingProduct from "../Dashboard-saas/total-selling-product"
import SalesAnalytics from "../Dashboard-saas/sales-analytics"

import {
  useGetAllTasks,
  useGetProjectsOfOffice,
  useGetUserEvents,
} from "apiCalls/apicalls"

/*
  in this page we want to collect this data first:
    tasks
    upcoming events
    cases
*/

const Dashboard = props => {
  const [modal, setModal] = useState(false)
  const [subscribeModal, setSubscribeModal] = useState(false)

  const [completedTasks, setCompletedTasks] = useState([])
  const [tasktodo, settasktodo] = useState([])
  const [deferredTasks, setDeferred] = useState([])
  const [loading, setLoading] = useState(true)

  const [currentUser, setCurrentUser] = useState()
  const dispatch = useDispatch()

  // Selectors
  const tasksSelector = createSelector(
    state => state.tasks,
    tasks => tasks.tasks
  )
  const projectsSelector = createSelector(
    state => state.projects,
    projects => projects.projects
  )
  const eventsSelector = createSelector(
    state => state.calendar,
    Calendar => Calendar.events
  )

  const tasks = useSelector(tasksSelector)
  const projects = useSelector(projectsSelector)
  const events = useSelector(eventsSelector)

  // API Hooks
  const {
    fetchTasks,
    loading: loadingTasks,
    data: tasksData,
    error: tasksError,
  } = useGetAllTasks()
  const {
    getProjects,
    loading: loadingProjects,
    data: projectsData,
    error: projectsError,
  } = useGetProjectsOfOffice(currentUser?.office_id)
  const {
    getEvents,
    loading: loadingEvents,
    data: eventsData,
    error: eventsError,
  } = useGetUserEvents(currentUser?.email)

  useEffect(() => {
    if (!currentUser) {
      if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"))
        setCurrentUser(obj)
      }
    }
  }, [currentUser])

  // Effect to load user from localStorage and fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        // Start loader before fetching
        setLoading(true)
        try {
          await getProjects()
          await fetchTasks()
          await getEvents()
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [currentUser])

  // Effect to process tasks once fetched
  useEffect(() => {
    if (tasks) {
      const completedTasks = tasks.filter(
        task => task.task_status === "completed"
      )
      setCompletedTasks(completedTasks)

      const inProgressTasks = tasks.filter(
        task => task.task_status === "in Progress"
      )
      settasktodo(inProgressTasks)

      const deferredTask = tasks.filter(
        task => task.task_status === "Up comming"
      )
      setDeferred(deferredTask)
    }
  }, [tasks])

  const DashboardProperties = createSelector(
    state => state.Dashboard,
    dashboard => ({
      chartsData: dashboard.chartsData,
    })
  )

  const { chartsData } = useSelector(DashboardProperties)

  useEffect(() => {
    setTimeout(() => {
      setSubscribeModal(true)
    }, 2000)
  }, [])

  const [periodData, setPeriodData] = useState([])
  const [periodType, setPeriodType] = useState("yearly")

  useEffect(() => {
    setPeriodData(chartsData)
  }, [chartsData])

  const onChangeChartPeriod = pType => {
    setPeriodType(pType)
    dispatch(onGetChartsData(pType))
  }

  useEffect(() => {
    dispatch(onGetChartsData("yearly"))
  }, [dispatch])

  // Meta title
  document.title = `${props.t("Dashboard")} | CPALINK`
  return (
    <React.Fragment>
      <div className="page-content">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <img
              src={loaderImg}
              alt=""
              className="w-10 h-10 justify-content-center"
            />
          </div>
        ) : (
          <Container fluid>
            {/* Render Breadcrumb */}
            {
              <Breadcrumbs
                title={props.t("Dashboards")}
                breadcrumbItem={props.t("Dashboard")}
              />
            }
            <Card className="overflow-hidden">
              <div className="bg-secondary-subtle">
                <Row>
                  <Col xs="5">
                    <div className="text-primary p-3">
                      <h5 className="text-primary">
                        {props.t("Welcome Back !")}{" "}
                      </h5>
                      <p> {props.t("It will seem like simplified")}</p>
                    </div>
                  </Col>
                </Row>
              </div>
              <CardBody className="pt-0">
                <Row>
                  <Col sm="4">
                    <h3 className="font-size-15 text-truncate mt-5">
                      {currentUser?.first_name} {currentUser?.last_name}
                    </h3>

                    <p className="text-muted mb-0 text-truncate">
                      {currentUser?.role}
                    </p>
                    <div className="mt-4">
                      <Link
                        to="/contacts-profile"
                        className="btn btn-primary  btn-sm"
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
                          <p className="text-muted mb-0">
                            {props.t("Projects")}
                          </p>
                        </Col>
                        {/* <Col xs="6">
                          <h5 className="font-size-15">10</h5>
                          <p className="text-muted mb-0">Customers</p>
                        </Col> */}
                      </Row>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <Row>
              <Col xl="12">
                <Row>
                  <Col md="3" key={"_col_1"}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              {" "}
                              {props.t("Tasks Todo")}{" "}
                            </p>
                            {tasktodo && (
                              <h4 className="mb-0">{tasktodo.length}</h4>
                            )}
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i className={"bx bx-copy-alt font-size-24"}></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="3" key={"_col_2"}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              {props.t("Tasks Performed")}
                            </p>
                            {completedTasks && (
                              <h4 className="mb-0">{completedTasks.length}</h4>
                            )}
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i className={"bx bx-copy-alt font-size-24"}></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col md="3" key={"_col_3"}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              {props.t("Deferred Tasks")}
                            </p>
                            {deferredTasks && (
                              <h4 className="mb-0">{deferredTasks.length}</h4>
                            )}
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i className={"bx bx-copy-alt font-size-24"}></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col
                    md="2"
                    key={"_col_4"}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <div className="text-center mt-1">
                      <Link
                        to="/tasks-list"
                        className="btn btn-primary waves-effect waves-light btn-sm"
                      >
                        {props.t("View Tasks")}{" "}
                        <i className="mdi mdi-arrow-left ms-1" />
                      </Link>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <SalesAnalytics
                dataColors='["--bs-primary", "--bs-success", "--bs-danger"]'
                completed={completedTasks.length}
                todo={tasktodo.length}
                deferredTasks={deferredTasks.length}
              />
              <Col xll="4">
                <ActivityComp />
              </Col>
            </Row>
          </Container>
        )}
      </div>
    </React.Fragment>
  )
}

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
}

export default withTranslation()(Dashboard)
