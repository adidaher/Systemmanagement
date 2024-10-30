import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Table,
  Button,
} from "reactstrap"

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

// Import mini card widgets
import MiniCards from "./mini-card"

// Import Images
import profile1 from "assets/images/profile-img.png"

const ContactsProfile = props => {
  // Meta title
  document.title = "Profile | CPALINK"

  const [currentUser, setCurrentUser] = useState(() => {
    const authUser = localStorage.getItem("authUser")
    return authUser ? JSON.parse(authUser) : null
  })

  // Sample mini card data
  const [miniCards] = useState([
    {
      title: "Completed Projects",
      iconClass: "bx-check-circle",
      text: "125",
    },
    { title: "Pending Projects", iconClass: "bx-hourglass", text: "12" },
  ])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="Profile" />

          <Card className="overflow-hidden">
            <div className="bg-primary-subtle">
              <Row>
                <Col xs="7">
                  <div className="text-primary p-3">
                    <h5 className="text-primary">
                      Welcome Back, {currentUser?.username}!
                    </h5>
                    <p className="lead">
                      Your dashboard is ready and waiting for you!
                    </p>
                  </div>
                </Col>
                <Col xs="5" className="align-self-end">
                  <img
                    src={profile1}
                    alt="Profile"
                    className="img-fluid rounded-circle"
                  />
                </Col>
              </Row>
            </div>
            <CardBody className="pt-0">
              <Row>
                <Col sm="4">
                  <h5 className="font-size-15 text-truncate mt-5">
                    {currentUser?.username}
                  </h5>
                  <p className="text-muted mb-0 text-truncate">
                    {currentUser?.role}
                  </p>
                </Col>
                <Col sm={8}>
                  <div className="pt-4">
                    <div className="mt-4">
                      <Link to="" className="btn btn-primary btn-sm">
                        View Profile <i className="mdi mdi-arrow-right ms-1" />
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <CardTitle className="mb-4">Personal Information</CardTitle>
              <p className="text-muted mb-4">{currentUser?.username}</p>
              <div className="table-responsive">
                <Table className="table-nowrap mb-0">
                  <tbody>
                    <tr>
                      <th scope="row">Full Name:</th>
                      <td>{currentUser?.username}</td>
                    </tr>
                    <tr>
                      <th scope="row">Mobile:</th>
                      <td>{currentUser?.phone}</td>
                    </tr>
                    <tr>
                      <th scope="row">E-mail:</th>
                      <td>{currentUser?.email}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <CardTitle className="mb-5">Experience</CardTitle>
              <ul className="verti-timeline list-unstyled">
                <li className="event-list active">
                  <div className="event-timeline-dot">
                    <i className="bx bx-right-arrow-circle bx-fade-right" />
                  </div>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <h5 className="font-size-15">
                        <Link to="#" className="text-dark">
                          {currentUser?.role}
                        </Link>
                      </h5>
                    </div>
                  </div>
                </li>
              </ul>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default connect()(withRouter(ContactsProfile))
