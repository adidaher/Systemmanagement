import React, { useEffect, useState } from "react"
import { Card, CardBody, CardTitle, Spinner } from "reactstrap"
import { Link } from "react-router-dom"
import { activityDataDashboard } from "common/data"
import { useLazyQuery, gql, useMutation, useQuery } from "@apollo/client"

const GET_TASKS_OF_CASE = gql`
  query getTaskOfCase($case_id: ID!) {
    getTaskOfCase(case_id: $case_id) {
      task_id
      task_name
      task_partners
      task_status
      task_deadline
      task_description
    }
  }
`

const ActivityComp = ({ case_id }) => {
  const [tasksCase, setTasksCase] = useState()
  const [getTasks, { loading, data, error }] = useLazyQuery(GET_TASKS_OF_CASE, {
    variables: { case_id },
    onCompleted: data => {
      console.log("Data fetched successfully:", data)
      setTasksCase(data.getTaskOfCase)
    },
  })

  useEffect(() => {
    if (case_id) {
      getTasks({
        variables: {
          case_id: case_id,
        },
      })
    }
  }, [])

  const formatDate = timestamp => {
    const date = new Date(parseInt(timestamp, 10))
    return date.toLocaleDateString()
  }

  return (
    <React.Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Card>
          <CardBody>
            <CardTitle className="mb-5">Tasks</CardTitle>
            <ul className="verti-timeline list-unstyled">
              {tasksCase?.map((item, index) => (
                <li
                  className={`event-list ${item.active && "active"}`}
                  key={index}
                >
                  <div className="event-timeline-dot">
                    <i
                      className={`font-size-18 bx ${
                        item.active
                          ? "bxs-right-arrow-circle bx-fade-right"
                          : "bx-right-arrow-circle"
                      }`}
                    />
                  </div>
                  <div className="flex-shrink-0 d-flex">
                    <div className="me-3">
                      <h5 className="font-size-14">
                        {formatDate(item.task_deadline)}
                        <i className="bx bx-right-arrow-alt font-size-16 text-primary align-middle ms-2" />
                      </h5>
                    </div>
                    <div className="flex-grow-1">
                      <div>{item.task_description}</div>
                    </div>
                  </div>
                </li>
              ))}
              {(!tasksCase || tasksCase.length < 1) && (
                <span>No Tasks assigned</span>
              )}
            </ul>
            <div className="text-center mt-4">
              <Link
                to="#"
                className="btn btn-primary waves-effect waves-light btn-sm"
              >
                View More <i className="mdi mdi-arrow-right ms-1" />
              </Link>
            </div>
          </CardBody>
        </Card>
      )}
    </React.Fragment>
  )
}

export default ActivityComp
