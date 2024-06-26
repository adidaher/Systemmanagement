import React, { useEffect, useState, useMemo } from "react"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
import TableContainer from "../../components/Common/TableContainer"
import { useQuery, gql } from "@apollo/client"
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
} from "reactstrap"
import Breadcrumbs from "../../components/Common/Breadcrumb"
import Spinners from "components/Common/Spinner"
import { Link } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { ToastContainer } from "react-toastify"
import { withTranslation } from "react-i18next"
import withRouter from "components/Common/withRouter"

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

const Customers = props => {
  document.title = `${props.t("Customers List")} | CPALINK`

  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [customerList, setCustomerList] = useState([])
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
                <i className="mdi mdi-pencil-outline" />
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="btn btn-sm btn-soft-danger"
                onClick={() => handleDelete(cellProps.row.original)}
              >
                <i className="mdi mdi-delete-outline" />
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
      customer_id: Yup.string().required("Please enter Customer ID"),
      office_id: Yup.string().required("Please enter Office ID"),
      last_name: Yup.string().required("Please enter Last Name"),
      first_name: Yup.string().required("Please enter First Name"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Please enter Email"),
      gov_id: Yup.string().required("Please enter Government ID"),
    }),
    onSubmit: values => {
      // Handle form submission for add/edit customer
      if (isEdit) {
        // Update customer
      } else {
        // Add new customer
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
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title={props.t("Customers")}
            breadcrumbItem={props.t("Customers List")}
          />
          {loading ? (
            <Spinners setLoading={setLoading} />
          ) : (
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={customerList}
                      isPagination={true}
                      SearchPlaceholder="Search for customers..."
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          {isEdit ? "Edit Customer" : "Add Customer"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={validation.handleSubmit}>
            <Row>
              <Col className="col-12">
                <div className="mb-3">
                  <Label for="customer_id">Customer ID</Label>
                  <Input
                    name="customer_id"
                    type="text"
                    placeholder="Enter Customer ID"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.customer_id || ""}
                    invalid={
                      validation.touched.customer_id &&
                      validation.errors.customer_id
                    }
                  />
                  {validation.touched.customer_id &&
                    validation.errors.customer_id && (
                      <FormFeedback>
                        {validation.errors.customer_id}
                      </FormFeedback>
                    )}
                </div>
                <div className="mb-3">
                  <Label for="office_id">Office ID</Label>
                  <Input
                    name="office_id"
                    type="text"
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
                      <FormFeedback>{validation.errors.office_id}</FormFeedback>
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
                      <FormFeedback>{validation.errors.last_name}</FormFeedback>
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
                  {validation.touched.email && validation.errors.email && (
                    <FormFeedback>{validation.errors.email}</FormFeedback>
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
                      validation.touched.gov_id && validation.errors.gov_id
                    }
                  />
                  {validation.touched.gov_id && validation.errors.gov_id && (
                    <FormFeedback>{validation.errors.gov_id}</FormFeedback>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <Button color="success" type="submit" className="me-1">
                    Save
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
      <ToastContainer />
    </React.Fragment>
  )
}

export default withRouter(withTranslation()(Customers))
