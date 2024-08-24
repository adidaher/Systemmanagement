import React from "react"
import PropTypes from "prop-types"
import { get } from "lodash"
import { Card, CardBody, Col, Row } from "reactstrap"
import img1 from "../../../assets/images/companies/img-1.png"

const ProjectDetail = ({ project, projectDetails }) => {
  return (
    <Card>
      <CardBody>
        <div className="d-flex">
          <img src={img1} alt="" className="avatar-sm me-4" />

          <div className="flex-grow-1 overflow-hidden">
            <h5 className="text-truncate font-size-15">
              {projectDetails.case_details.case_description}
            </h5>
            <p className="text-muted">
              {projectDetails.customer.first_name}{" "}
              {projectDetails.customer.last_name}
            </p>
          </div>
        </div>

        <h5 className="font-size-15 mt-4">Project Details :</h5>

        <p className="text-muted">
          To an English person, it will seem like simplified English, as a
          skeptical Cambridge friend of mine told me what Occidental is. The
          European languages are members of the same family. Their separate
          existence is a myth. For science, music, sport, etc,
        </p>

        <Row className="task-dates">
          <Col sm="4" xs="6">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-calendar me-1 text-primary" /> office
              </h5>
              <p className="text-muted mb-0">{projectDetails.office.name}</p>
            </div>
          </Col>

          <Col sm="4" xs="6">
            <div className="mt-4">
              <h5 className="font-size-14">
                <i className="bx bx-calendar-check me-1 text-primary" />
                Customer email
              </h5>
              <p className="text-muted mb-0">{projectDetails.customer.email}</p>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

ProjectDetail.propTypes = {
  project: PropTypes.object,
}

export default ProjectDetail
