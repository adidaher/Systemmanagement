import PropTypes from "prop-types"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Badge, Card, CardBody, Col, UncontrolledTooltip } from "reactstrap"
import cpaicon from "../../assets/images/companies/img-1.png"
import { toast, ToastContainer } from "react-toastify"
import { useLazyQuery, gql, useMutation } from "@apollo/client"

const DELETE_OFFICE = gql`
  mutation deleteOffice($office_id: ID!) {
    deleteOffice(office_id: $office_id) {
      office_id
    }
  }
`

const CardProject = ({ offices, setOffices }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const authUser = localStorage.getItem("authUser")
    return authUser ? JSON.parse(authUser) : null
  })
  const [deleteOffice] = useMutation(DELETE_OFFICE)

  const handleDeleteOffice = office_id => {
    deleteOffice({ variables: { office_id } })
      .then(result => {
        toast.success("Office Deleted Successfully", { autoClose: 2000 })

        const updatedOffices = offices.filter(
          office => office.office_id !== office_id
        )
        setOffices(updatedOffices)
      })
      .catch(err => {
        toast.error("Can't delete office, There is cases assigned to it", {
          autoClose: 3000,
        })
      })
  }

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
                {currentUser?.role === "admin" && (
                  <Link
                    to="#"
                    onClick={() => handleDeleteOffice(office.office_id)}
                  >
                    <i
                      className="mdi mdi-delete "
                      style={{ fontSize: "20px", color: "#dc3545" }}
                    ></i>
                  </Link>
                )}
              </ul>
            </div>
          </Card>
        </Col>
      ))}
      <ToastContainer />
    </React.Fragment>
  )
}

CardProject.propTypes = {
  projects: PropTypes.array,
}

export default CardProject
