import React, { useState } from "react"
import { Link } from "react-router-dom"
import Dropzone from "react-dropzone"
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  UncontrolledTooltip,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

// FlatPickr
import "flatpickr/dist/themes/material_blue.css"
import * as Yup from "yup"
import { useFormik } from "formik"
import { gql, useMutation } from "@apollo/client"
import { addProjectSuccess } from "store/actions"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"

const CREATE_CASE = gql`
  mutation createCase(
    $office_id: ID!
    $case_description: String!
    $customer_id: ID!
  ) {
    createCase(
      office_id: $office_id
      case_description: $case_description
      customer_id: $customer_id
    ) {
      id
    }
  }
`

const ProjectsCreate = () => {
  //meta title
  document.title = "Create New Project | CPALINK"

  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [imgStore, setImgStore] = useState([])
  const [dropList, setDropList] = useState(false)
  const [active, setActive] = useState(0)

  const dispatch = useDispatch()

  const [createCaseMutation, { loading: mutationLoading, error }] =
    useMutation(CREATE_CASE)

  // validation
  const validation = useFormik({
    initialValues: {
      projectdesc: "",
      office_id: "",
      Customer_ID: "",
    },
    validationSchema: Yup.object({
      projectdesc: Yup.string().required("Please Enter Your Project Desc"),
      office_id: Yup.string().required("Please Enter Your office id"),
      Customer_ID: Yup.string().required("Please Enter customer id"),
    }),
    onSubmit: values => {
      //console.log(values["projectdesc"],values["office_id"],values["Customer_ID"]);
      createCaseMutation({
        variables: {
          case_description: values["projectdesc"],
          office_id: values["office_id"],
          customer_id: values["Customer_ID"],
        },
      })
        .then(result => {
          // Handle success
          dispatch(addProjectSuccess(result.data.createCase))
          validation.resetForm()
          toast.success("Case added successfully", { autoClose: 2000 })
        })
        .catch(() => {
          console.error("Error deleting case:", error)
          toast.error("Failed to delete case")
        })
    },
  })

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Projects" breadcrumbItem="Create New" />
          <Form
            id="createproject-form"
            onSubmit={e => {
              e.preventDefault()
              validation.handleSubmit()
              return false
            }}
          >
            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    <input
                      type="hidden"
                      className="form-control"
                      id="formAction"
                      name="formAction"
                      defaultValue="add"
                    />
                    <input
                      type="hidden"
                      className="form-control"
                      id="project-id-input"
                    />

                    <div className="mb-3">
                      <Label htmlFor="projectdesc-input">
                        Project Description
                      </Label>
                      <Input
                        as="textarea"
                        id="projectdesc"
                        rows={3}
                        name="projectdesc"
                        placeholder="Enter Project Description..."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.projectdesc || ""}
                      />
                      {validation.touched.projectdesc &&
                      validation.errors.projectdesc ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.projectdesc}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="projectname-input">Customer ID</Label>
                      <Input
                        id="Customer_ID"
                        name="Customer_ID"
                        type="number"
                        placeholder="Enter customer id..."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.Customer_ID || ""}
                      />
                      {validation.touched.Customer_ID &&
                      validation.errors.Customer_ID ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.Customer_ID}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="projectname-input">Assigned office</Label>
                      <Input
                        id="office_id"
                        name="office_id"
                        type="number"
                        placeholder="Enter office id..."
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.office_id || ""}
                      />
                      {validation.touched.office_id &&
                      validation.errors.office_id ? (
                        <FormFeedback type="invalid" className="d-block">
                          {validation.errors.office_id}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={8}>
                <div className="text-end mb-4">
                  {!mutationLoading ? (
                    <Button type="submit" color="primary">
                      Create Project
                    </Button>
                  ) : (
                    <Spinner />
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default ProjectsCreate
