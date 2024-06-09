import React, { useEffect, useState, useMemo } from "react"
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
} from "reactstrap"

// TableContainer

import TableContainer from "../../../components/Common/TableContainer"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

//Import mini card widgets
import MiniCards from "./mini-card"

//Import Images
import profile1 from "assets/images/profile-img.png"

// import charts
import ApexRevenue from "../ApexRevenue"
import { getUserProfile } from "store/actions"

const ContactsProfile = props => {
  //meta title
  document.title = "Profile | CPALINK"

  const { userProfile, onGetUserProfile } = props
  const [currentUser, setCurrentUser] = useState()
  // eslint-disable-next-line no-unused-vars
  const [miniCards, setMiniCards] = useState([
    {
      title: "Completed Projects",
      iconClass: "bx-check-circle",
      text: "125",
    },
    { title: "Pending Projects", iconClass: "bx-hourglass", text: "12" },
    { title: "Total Revenue", iconClass: "bx-package", text: "$36,524" },
  ])

  useEffect(() => {
    onGetUserProfile()
  }, [onGetUserProfile])

  useEffect(() => {
    if (!currentUser) {
      if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"))
        setCurrentUser(obj)
      }
    }
  }, [currentUser])

  const columns = useMemo(
    () => [
      {
        header: "#",
        accessorKey: "id",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Project",
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Start Date",
        accessorKey: "startDate",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Deadline",
        accessorKey: "deadline",
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: "Budget",
        accessorKey: "budget",
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    []
  )

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="Profile" />

          <Row>
            <Col xl="4">
              <Card className="overflow-hidden">
                <div className="bg-primary-subtle">
                  <Row>
                    <Col xs="7">
                      <div className="text-primary p-3">
                        <h5 className="text-primary">Welcome Back !</h5>
                        <p>It will seem like simplified</p>
                      </div>
                    </Col>
                    <Col xs="5" className="align-self-end">
                      <img src={profile1} alt="" className="img-fluid" />
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
                        <Row>
                          <Col xs="6">
                            <h5 className="font-size-15">
                              {userProfile.projectCount}
                            </h5>
                            <p className="text-muted mb-0">Projects</p>
                          </Col>
                          <Col xs="6">
                            <h5 className="font-size-15">
                              ${userProfile.revenue}
                            </h5>
                            <p className="text-muted mb-0">Revenue</p>
                          </Col>
                        </Row>
                        <div className="mt-4">
                          <Link to="" className="btn btn-primary  btn-sm">
                            View Profile{" "}
                            <i className="mdi mdi-arrow-right ms-1" />
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
                          <th scope="row">Full Name :</th>
                          <td>{currentUser?.username}</td>
                        </tr>
                        <tr>
                          <th scope="row">Mobile :</th>
                          <td>{currentUser?.phone}</td>
                        </tr>
                        <tr>
                          <th scope="row">E-mail :</th>
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
                  <div>
                    <ul className="verti-timeline list-unstyled">
                      <li className="event-list active">
                        <div className="event-timeline-dot">
                          <i className="bx bx-right-arrow-circle bx-fade-right" />
                        </div>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <div>
                              <h5 className="font-size-15">
                                <Link to="#" className="text-dark">
                                  {currentUser?.role}
                                </Link>
                              </h5>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="8">
              <Row>
                {(miniCards || [])?.map((card, key) => (
                  <MiniCards
                    title={card.title}
                    text={card.text}
                    iconClass={card.iconClass}
                    key={"_card_" + key}
                  />
                ))}
              </Row>

              <Card>
                <CardBody>
                  <CardTitle className="mb-4">My Projects</CardTitle>

                  <TableContainer
                    columns={columns}
                    data={userProfile.projects || []}
                    isGlobalFilter={false}
                    tableClass="table-nowrap table-hover mb-00"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

ContactsProfile.propTypes = {
  userProfile: PropTypes.any,
  onGetUserProfile: PropTypes.func,
}

const mapStateToProps = ({ contacts }) => ({
  userProfile: contacts.userProfile,
})

const mapDispatchToProps = dispatch => ({
  onGetUserProfile: () => dispatch(getUserProfile()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ContactsProfile))
