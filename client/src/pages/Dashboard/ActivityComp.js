import React from "react"
import { Card, CardBody, CardTitle } from "reactstrap"
import { Link } from "react-router-dom"
import { withTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { createSelector } from "reselect"

const ActivityComp = props => {
  const CalendarProperties = createSelector(
    state => state.calendar,

    Calendar => ({
      categories: Calendar.categories,
      events: Calendar.events,
    })
  )

  const { categories, events } = useSelector(CalendarProperties)

  console.log(events)
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-5">{props.t("Activity")} </CardTitle>
          {events && events.length > 0 ? (
            <ul className="verti-timeline list-unstyled">
              {events?.map((item, index) => (
                <li className={`event-list `} key={index}>
                  <div className="event-timeline-dot">
                    <i className={`font-size-18 bx bx-right-arrow-circle`} />
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
              {props.t("View More")} <i className="mdi mdi-arrow-left ms-1" />
            </Link>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  )
}

export default withTranslation()(ActivityComp)
