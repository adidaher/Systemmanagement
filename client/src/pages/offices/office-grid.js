import React, { useEffect, useMemo, useState } from "react"

import {
  Col,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
  Container,
} from "reactstrap"
import withRouter from "components/Common/withRouter"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

//Import Cards
import CardProject from "../Projects/card-project"

//redux
import Spinners from "components/Common/Spinner"
import Paginations from "components/Common/Pagination"
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import { withTranslation } from "react-i18next"
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client"

const GET_OFFICES = gql`
  query {
    allOffice {
      office_id
      name
      manager
      location
      phone
    }
  }
`

const ADD_OFFICE = gql`
  mutation AddOffice(
    $name: String!
    $manager: String
    $location: String
    $phone: String
  ) {
    addOffice(
      name: $name
      manager: $manager
      location: $location
      phone: $phone
    ) {
      name
      manager
      location
      phone
    }
  }
`

const OfficesGrid = props => {
  //meta title
  document.title = "Office Grid |  CPALINK "

  const [offices, setOffices] = useState([])
  const [officesList, setOfficesList] = useState([])
  const [Loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => {
    const authUser = localStorage.getItem("authUser")
    return authUser ? JSON.parse(authUser) : null
  })

  const [officeData, setOfficeData] = useState({
    name: "",
    manager: "",
    location: "",
    phone: "",
  })

  const [getOffices, { data, loading, error }] = useLazyQuery(GET_OFFICES, {
    onCompleted: data => {
      if (data) {
        setOffices(data.allOffice)
        setLoading(false)
      }
    },
  })

  const [addOffice, { officeloading, officeerror }] = useMutation(ADD_OFFICE, {
    onCompleted: data => {
      toast.success("Office added successfully!")
      setOffices(prevOffices => [...prevOffices, data.addOffice])
    },
    onError: err => {
      toast.error("Error adding office: ")
    },
  })

  useEffect(() => {
    if (offices.length === 0) {
      getOffices()
    }
  }, [offices])

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const perPageData = 6
  const indexOfLast = currentPage * perPageData
  const indexOfFirst = indexOfLast - perPageData
  const currentdata = useMemo(
    () => offices?.slice(indexOfFirst, indexOfLast),
    [offices, indexOfFirst, indexOfLast]
  )

  useEffect(() => {
    setOfficesList(currentdata)
  }, [currentdata])

  const toggle = () => {
    setModal(!modal)
  }

  const handleUserClicks = () => {
    toggle()
  }

  const handleChange = e => {
    const { name, value } = e.target
    setOfficeData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    addOffice({ variables: officeData })
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs
            title={props.t("Office")}
            breadcrumbItem={props.t("Office Grid")}
          />

          <Row>
            <div className="mb-2">
              {currentUser.role === "admin" && (
                <button
                  className="btn btn-success btn-rounded waves-effect waves-light addContact-modal mb-2 float-start"
                  onClick={handleUserClicks}
                >
                  {props.t("Add office")}
                </button>
              )}
            </div>
            {/* Import Cards */}
            {Loading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <>
                <CardProject offices={offices} setOffices={setOffices} />
                <Row>
                  <Paginations
                    perPageData={perPageData}
                    data={offices}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isShowingPageLength={false}
                    paginationDiv="col-12"
                    paginationClass="pagination pagination-rounded justify-content-center mt-2 mb-5"
                  />
                </Row>
              </>
            )}
            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle}>Add Office</ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col>
                      <div className="mb-3 d-flex flex-column">
                        <Label for="name">Office Name</Label>
                        <input
                          type="text"
                          name="name"
                          value={officeData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3 d-flex flex-column">
                        <Label for="manager">Manager</Label>
                        <input
                          type="text"
                          name="manager"
                          value={officeData.manager}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3 d-flex flex-column">
                        <Label for="location">Location</Label>
                        <input
                          type="text"
                          name="location"
                          value={officeData.location}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3 d-flex flex-column">
                        <Label for="phone">Phone</Label>
                        <input
                          type="text"
                          name="phone"
                          value={officeData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col className="text-end d-flex justify-content-end">
                      <Button color="success" type="submit">
                        Save
                      </Button>
                      <Button
                        color="secondary"
                        onClick={toggle}
                        className="ms-2"
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </ModalBody>
            </Modal>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(withTranslation()(OfficesGrid))
