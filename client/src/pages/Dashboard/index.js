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

import classNames from "classnames"

//import Charts
import StackedColumnChart from "./StackedColumnChart"

//import action
import { getChartsData as onGetChartsData } from "../../store/actions"

// Image
import modalimage1 from "../../assets/images/product/img-7.png"
import modalimage2 from "../../assets/images/product/img-4.png"

// Pages Components
import WelcomeComp from "./WelcomeComp"
import MonthlyEarning from "./MonthlyEarning"
import SocialSource from "./SocialSource"
import ActivityComp from "./ActivityComp"
import TopCities from "./TopCities"
import LatestTranaction from "./LatestTranaction"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//i18n
import { withTranslation } from "react-i18next"

//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"

import TotalSellingProduct from "../Dashboard-saas/total-selling-product"
import SalesAnalytics from "../Dashboard-saas/sales-analytics"
import CardUser from "./card-user"

const Dashboard = props => {
  const [modal, setModal] = useState(false)
  const [subscribeModal, setSubscribeModal] = useState(false)

  const DashboardProperties = createSelector(
    state => state.Dashboard,
    dashboard => ({
      chartsData: dashboard.chartsData,
    })
  )

  const { chartsData } = useSelector(DashboardProperties)

  const reports = [
    { title: props.t("Tasks"), iconClass: "bx-copy-alt", description: "10" },
    {
      title: props.t("Hours"),
      iconClass: "bx-archive-in",
      description: "44",
    },
    {
      title: "events",
      iconClass: "bx-purchase-tag-alt",
      description: "16",
    },
  ]

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

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(onGetChartsData("yearly"))
  }, [dispatch])

  //meta title
  document.title = "Dashboard | CPALINK"

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {
            <Breadcrumbs
              title={props.t("Dashboards")}
              breadcrumbItem={props.t("Dashboard")}
            />
          }
          <CardUser />
          <Row>
            <Col xl="8">
              <Row>
                {(reports || [])?.map((report, key) => (
                  <Col md="4" key={"_col_" + key}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              {report.title}
                            </p>
                            <h4 className="mb-0">{report.description}</h4>
                          </div>
                          <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                            <span className="avatar-title rounded-circle bg-primary">
                              <i
                                className={
                                  "bx " + report.iconClass + " font-size-24"
                                }
                              ></i>
                            </span>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          <Row>
            <TotalSellingProduct />

            <SalesAnalytics dataColors='["--bs-primary", "--bs-success", "--bs-danger"]' />
            <Col xll="4">
              <ActivityComp />
            </Col>
          </Row>
        </Container>
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
