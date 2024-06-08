import PropTypes from "prop-types"
import React from "react"
import { Link } from "react-router-dom"
import { Badge, Card, CardBody, Col, UncontrolledTooltip } from "reactstrap"
import cpaicon from "../../assets/images/companies/img-1.png"
const CardProject = ({ offices }) => {
  return (
    <React.Fragment>
      {(offices || []).map((office, key) => (
        <Col xl={4} sm={6} key={key}>
          <Card>
            <CardBody>
              <div className="d-flex">
                <div className="avatar-md me-4">
                  <span className="avatar-title rounded-circle bg-light text-danger font-size-16">
                    <img src={cpaicon} alt="" height="30" />
                  </span>
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <h5 className="text-truncate font-size-15">
                    <Link className="text-dark">{office.name}</Link>
                  </h5>
                </div>
              </div>
            </CardBody>
            <div className="px-4 py-3 border-top">
              <ul className="list-inline mb-0">
                <li className="list-inline-item me-3">
                  <Badge className="bg-success badge bg-secondary p-2">
                    {office.location}
                  </Badge>
                </li>
                <li className="list-inline-item me-3" id="dueDate">
                  <i className="bx bx-phone" /> {office.phone}
                </li>
                <li className="list-inline-item me-3" id="comments">
                  <i className="bx bx-comment-dots me-1" />
                  {office.manager}
                </li>
              </ul>
            </div>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  )
}

CardProject.propTypes = {
  projects: PropTypes.array,
}

export default CardProject
