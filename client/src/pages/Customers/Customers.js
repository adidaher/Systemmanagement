import React, { useEffect, useState, useMemo } from "react"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"
import {
  Col,
  Row,
  Card,
  CardBody,
  UncontrolledTooltip,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
  FormFeedback,
  Label,
  Container,
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Spinners from "components/Common/Spinner"
import { Link } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { ToastContainer } from "react-toastify"
import { withTranslation } from "react-i18next"
import withRouter from "components/Common/withRouter"
import DeleteModal from "components/Common/DeleteModal"
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client"
import { toast } from "react-toastify"

const GET_CUSTOMERS = gql`
  query {
    allcustomers {
      customer_id
      office_id
      last_name
      first_name
      email
      gov_id
    }
  }
`
const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      customer_id
    }
  }
`

const ADD_CUSTOMER = gql`
  mutation AddCustomer(
    $office_id: ID!
    $last_name: String!
    $first_name: String!
    $email: String!
    $gov_id: String!
  ) {
    addCustomer(
      office_id: $office_id
      last_name: $last_name
      first_name: $first_name
      email: $email
      gov_id: $gov_id
    ) {
      customer_id
      office_id
      last_name
      first_name
      email
      gov_id
    }
  }
`

const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer(
    $customer_id: ID!
    $office_id: ID
    $last_name: String
    $first_name: String
    $email: String
    $gov_id: String
  ) {
    updateCustomer(
      customer_id: $customer_id
      office_id: $office_id
      last_name: $last_name
      first_name: $first_name
      email: $email
      gov_id: $gov_id
    ) {
      customer_id
      office_id
      last_name
      first_name
      email
      gov_id
    }
  }
`

const Customers = props => {
  document.title = `${props.t("Customers List")} | CPALINK`

  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [customerList, setCustomerList] = useState([])
  const [currentUser, setCurrentUser] = useState()
  const [deleteModal, setDeleteModal] = useState(false)

  const {
    loading: QueryLoading,
    error,
    data,
  } = useQuery(GET_CUSTOMERS, {
    onCompleted: data => {
      if (data) {
        setCustomerList(data.allcustomers)
      }
      setLoading(false)
    },
  })

  const [deleteCustomer] = useMutation(DELETE_CUSTOMER)
  const [addCustomer] = useMutation(ADD_CUSTOMER)
  const [updateCustomer] = useMutation(UPDATE_CUSTOMER)

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
        header: `${props.t("Customers ID")}`,
        accessorKey: "customer_id",
        enableSorting: true,
      },
      {
        header: `${props.t("Office ID")}`,
        accessorKey: "office_id",
        enableSorting: true,
      },
      {
        header: `${props.t("First Name")}`,
        accessorKey: "first_name",
        enableSorting: true,
      },
      {
        header: `${props.t("Last Name")}`,
        accessorKey: "last_name",
        enableSorting: true,
      },
      {
        header: `${props.t("Email")}`,
        accessorKey: "email",
        enableSorting: true,
      },
      {
        header: `${props.t("Government ID")}`,
        accessorKey: "gov_id",
        enableSorting: true,
      },
      {
        header: `${props.t("Action")}`,
        cell: cellProps => (
          <ul className="list-unstyled hstack gap-1 mb-0">
            <li>
              <Link
                to="#"
                className="btn btn-sm btn-soft-info"
                onClick={() => handleCustomerClick(cellProps.row.original)}
              >
                <i className="mdi mdi-pencil-outline font-size-18" />
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="btn btn-sm btn-soft-danger"
                onClick={() => handleDelete(cellProps.row.original)}
              >
                <i className="mdi mdi-delete-outline font-size-18" />
              </Link>
            </li>
          </ul>
        ),
      },
    ],
    []
  )

  const handleCustomerClick = customer => {
    setCustomer(customer)
    setIsEdit(true)
    toggle()
  }

  const handleDelete = customer => {
    setCustomer(customer)
    setDeleteModal(true)
  }
  const handleDeleteCustomer = () => {
    console.log(customer.customer_id)
    deleteCustomer({ variables: { id: customer.customer_id } }).then(result => {
      toast.success("Event Deleted Successfully", { autoClose: 2000 })
      setCustomer(customers =>
        customers.filter(per => per.customer_id !== customer.customer_id)
      )
    })
    // Dispatch delete action
    setDeleteModal(false) // Close the delete modal
  }

  const handleUserClicks = () => {
    setCustomer(null)
    setIsEdit(false)
    toggle()
  }
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      customer_id: (customer && customer.customer_id) || "",
      office_id: (customer && customer.office_id) || "",
      last_name: (customer && customer.last_name) || "",
      first_name: (customer && customer.first_name) || "",
      email: (customer && customer.email) || "",
      gov_id: (customer && customer.gov_id) || "",
    },
    validationSchema: Yup.object({
      office_id: Yup.string().required("Please enter Office ID"),
      last_name: Yup.string().required("Please enter Last Name"),
      first_name: Yup.string().required("Please enter First Name"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter Email"),
      gov_id: Yup.string().required("Please enter Government ID"),
    }),
    onSubmit: values => {
      if (isEdit) {
        // Update customer
        console.log(
          values["office_id"],
          values["first_name"],
          values["last_name"],
          values["email"],
          values["gov_id"]
        )
        updateCustomer({
          variables: {
            customer_id: customer.customer_id,
            office_id: values["office_id"],
            first_name: values["first_name"],
            last_name: values["last_name"],
            email: values["email"],
            gov_id: values["gov_id"],
          },
        })
          .then(result => {
            setCustomerList(customers =>
              customers.map(c =>
                c.customer_id === customer.customer_id
                  ? result.data.updateCustomer
                  : c
              )
            )
            toast.success("Customer Updated Successfully", { autoClose: 2000 })
          })
          .catch(error => {
            toast.error("Error updating customer", { autoClose: 2000 })
          })
      } else {
        // Add new customer
        addCustomer({
          variables: {
            office_id: values["office_id"],
            first_name: values["first_name"],
            last_name: values["last_name"],
            email: values["email"],
            gov_id: values["gov_id"],
          },
        })
          .then(result => {
            toast.success("Customer Added Successfully", { autoClose: 2000 })
            setCustomerList(customers => [
              ...customers,
              result.data.addCustomer,
            ])
          })
          .catch(error => {
            toast.error("Error adding customer", { autoClose: 2000 })
          })
      }
      toggle()
    },
  })

  const toggle = () => {
    setModal(!modal)
    if (modal) setCustomer(null)
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteCustomer}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={props.t("Customers")}
            breadcrumbItem={props.t("Customers List")}
          />

          <Row>
            {loading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={customerList}
                      isPagination={true}
                      isAddButton={
                        currentUser?.role === "admin" ||
                        currentUser?.role === "manager"
                      }
                      handleUserClick={handleUserClicks}
                      buttonClass="btn btn-success btn-rounded waves-effect waves-light addContact-modal mb-2 float-start"
                      buttonName="New Contact"
                      tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                      theadClass="table-light"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                      pagination="pagination"
                    />
                  </CardBody>
                </Card>
              </Col>
            )}

            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle} tag="h4">
                {isEdit ? "Edit Customer" : "Add Customer"}
              </ModalHeader>
              <ModalBody>
                <Form onSubmit={validation.handleSubmit}>
                  <Row>
                    <Col className="col-12">
                      <div className="mb-3">
                        <Label for="office_id">Office ID</Label>
                        <Input
                          name="office_id"
                          type="number"
                          placeholder="Enter Office ID"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.office_id || ""}
                          invalid={
                            validation.touched.office_id &&
                            validation.errors.office_id
                          }
                        />
                        {validation.touched.office_id &&
                          validation.errors.office_id && (
                            <FormFeedback>
                              {validation.errors.office_id}
                            </FormFeedback>
                          )}
                      </div>
                      <div className="mb-3">
                        <Label for="first_name">First Name</Label>
                        <Input
                          name="first_name"
                          type="text"
                          placeholder="Enter First Name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.first_name || ""}
                          invalid={
                            validation.touched.first_name &&
                            validation.errors.first_name
                          }
                        />
                        {validation.touched.first_name &&
                          validation.errors.first_name && (
                            <FormFeedback>
                              {validation.errors.first_name}
                            </FormFeedback>
                          )}
                      </div>
                      <div className="mb-3">
                        <Label for="last_name"> {props.t("Last Name")}</Label>
                        <Input
                          name="last_name"
                          type="text"
                          placeholder="Enter Last Name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.last_name || ""}
                          invalid={
                            validation.touched.last_name &&
                            validation.errors.last_name
                          }
                        />
                        {validation.touched.last_name &&
                          validation.errors.last_name && (
                            <FormFeedback>
                              {validation.errors.last_name}
                            </FormFeedback>
                          )}
                      </div>

                      <div className="mb-3">
                        <Label for="email">Email</Label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Enter Email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                          }
                        />
                        {validation.touched.email &&
                          validation.errors.email && (
                            <FormFeedback>
                              {validation.errors.email}
                            </FormFeedback>
                          )}
                      </div>
                      <div className="mb-3">
                        <Label for="gov_id">Government ID</Label>
                        <Input
                          name="gov_id"
                          type="text"
                          placeholder="Enter Government ID"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.gov_id || ""}
                          invalid={
                            validation.touched.gov_id &&
                            validation.errors.gov_id
                          }
                        />
                        {validation.touched.gov_id &&
                          validation.errors.gov_id && (
                            <FormFeedback>
                              {validation.errors.gov_id}
                            </FormFeedback>
                          )}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="text-end">
                        <Button color="success" type="submit" className="me-1">
                          {props.t("Save")}
                        </Button>
                        <Button color="secondary" onClick={toggle}>
                          {props.t("Cancel")}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </ModalBody>
            </Modal>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default withRouter(withTranslation()(Customers))
