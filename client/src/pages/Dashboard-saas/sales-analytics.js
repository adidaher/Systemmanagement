import React from "react"
import { Row, Col, Card, CardBody } from "reactstrap"
import ReactApexChart from "react-apexcharts"
import getChartColorsArray from "../../components/Common/ChartsDynamicColor"

const SalesAnalytics = ({ dataColors, completed, todo, deferredTasks }) => {
  const apexSalesAnalyticsChartColors = getChartColorsArray(dataColors)
  const series = [completed, todo, deferredTasks]
  const options = {
    labels: ["Completed Tasks", "Task Todo", "Deferred Tasks"],
    colors: apexSalesAnalyticsChartColors,
    legend: { show: !1 },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
  }

  return (
    <React.Fragment>
      <Col xl="4">
        <Card>
          <CardBody>
            <h4 className="card-title mb-4">Monthly Analytics</h4>

            <div>
              <div id="donut-chart">
                <ReactApexChart
                  options={options}
                  series={series}
                  type="donut"
                  height={260}
                  className="apex-charts"
                />
              </div>
            </div>

            <div className="text-center text-muted">
              <Row>
                <Col xs="4">
                  <div className="mt-4">
                    <p className="mb-2 text-truncate">
                      <i className="mdi mdi-circle text-primary me-1" />
                      Completed
                    </p>
                    <h5>{completed}</h5>
                  </div>
                </Col>
                <Col xs="4">
                  <div className="mt-4">
                    <p className="mb-2 text-truncate">
                      <i className="mdi mdi-circle text-success me-1" />
                      Tasks Todo
                    </p>
                    <h5>{todo}</h5>
                  </div>
                </Col>
                <Col xs="4">
                  <div className="mt-4">
                    <p className="mb-2 text-truncate">
                      <i className="mdi mdi-circle text-danger me-1" />
                      Deferred Tasks
                    </p>
                    <h5>{deferredTasks}</h5>
                  </div>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default SalesAnalytics
