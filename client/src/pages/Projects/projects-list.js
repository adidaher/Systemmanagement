import React, { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import TableContainer from "../../components/Common/TableContainer"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
  Input,
  Form,
  Spinner,
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import { withTranslation } from "react-i18next"
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
import DeleteModal from "components/Common/DeleteModal"

import { isEmpty, last } from "lodash"
import { toast } from "react-toastify"
//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"

import { ToastContainer } from "react-toastify"
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client"

import {
  getProjectsSuccess,
  deleteProjectSuccess,
} from "../../store/projects/actions"
import { useNavigate } from "react-router-dom"

const GET_PROJECTS_BY_OFFICE_ID = gql`
  query GetProjectsByOfficeID($office_id: ID!) {
    casesOfCustomersDetailsByOfficeID(office_id: $office_id) {
      case_id
      customer {
        customer_id
        first_name
        last_name
        email
      }
      office {
        office_id
        name
      }
      case_details {
        id
        office_id
        case_description
      }
    }
  }
`

const DELETE_CASE = gql`
  mutation deleteCase($id: ID!) {
    deleteCase(id: $id) {
      success
      message
    }
  }
`

const ProjectsList = props => {
  //meta title
  document.title = "Project List | CPALINK"

  const dispatch = useDispatch()
  const [project, setProject] = useState()
  const [currentUser, setCurrentUser] = useState()
  //const [projects, setProjects] = useState()
  const navigate = useNavigate()

  const [getProjects, { data, loading: queryLoading, error }] = useLazyQuery(
    GET_PROJECTS_BY_OFFICE_ID,
    {
      onCompleted: data => {
        if (data?.casesOfCustomersDetailsByOfficeID) {
          dispatch(getProjectsSuccess(data.casesOfCustomersDetailsByOfficeID))
        }
      },
      onError: error => {
        console.error("Error fetching projects:", error)
        navigate("/pages-500")
      },
    }
  )
  const [deleteCaseMutation] = useMutation(DELETE_CASE)

  const projectsSelector = createSelector(
    state => state.projects,
    projects => projects.projects
  )

  const projects = useSelector(projectsSelector)

  useEffect(() => {
    if (currentUser) {
      getProjects({ variables: { office_id: currentUser.office_id } })
    }
  }, [currentUser, projects])

  // validation

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      office_id: (project && project.office_id) || "",
      customer_id: (project && project.customer_id) || "",
    },
    validationSchema: Yup.object({
      office_id: Yup.string().required("Please Enter office id"),
      customer_id: Yup.string().required("Please Enter customer_id"),
    }),

    onSubmit: values => {
      if (isEdit) {
        updateUserMutation({
          variables: {
            case_id: project.case_id,
            office_id: project.office_id,
            customer_id: project.customer_id,
          },
        })
          .then(result => {
            // dispatch(updateUserSuccess(result.data.updateUser))
            setIsEdit(false)
            validation.resetForm()
          })
          .catch(error => {
            console.log("Error updating user:", error)
          })
      } else {
        /*
        addUserMutation({
          variables: {
            username: values["username"],
            email: values["email"],
            password: values["password"],
            phone: values["phone"],
            role: values["role"],
            first_name: values["first_name"],
            last_name: values["last_name"],
            manager_id: values["manager_id"],
          },
        }).then(result => {
          // Handle success

          dispatch(onAddNewUser(result.data.addUser))
          validation.resetForm()
        })
        */
      }
      toggle()
    },
  })

  /*
  const ContactsProperties = createSelector(
    state => state.contacts,
    Contacts => ({
      users: Contacts.users,
      loading: Contacts.loading,
    })
  )
*/

  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"))
        setCurrentUser(obj)
      }
    }
  }, [currentUser])

  useEffect(() => {
    setProject(project)
    setIsEdit(false)
  }, [project])

  useEffect(() => {
    if (!isEmpty(project) && !!isEdit) {
      setProject(project)
      setIsEdit(false)
    }
  }, [projects])

  const toggle = () => {
    setModal(!modal)
  }

  const handleUserClick = arg => {
    const project = arg

    setProject({
      case_id: project.case_id,
      customer_id: project.customer.customer_id,
      office_id: project.office.office_id,
    })
    setIsEdit(true)

    toggle()
  }

  //delete
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = projectData => {
    setProject(projectData)
    setDeleteModal(true)
  }

  const handleDeleteProject = async () => {
    try {
      const response = await deleteCaseMutation({
        variables: { id: project.case_id },
      })
      const { success, message } = response.data.deleteCase

      if (success) {
        toast.success("Case deleted successfully", { autoClose: 2000 })
        dispatch(deleteProjectSuccess(project.case_id))
      } else {
        toast.error(`Failed to delete case: ${message}`)
      }
    } catch (error) {
      console.error("Error deleting case:", error)
      toast.error("Failed to delete case")
    }

    // Dispatch delete action
    setDeleteModal(false) // Close the delete modal
  }

  const handleUserClicks = () => {
    setProject(null)
    setIsEdit(false)
    toggle()
  }

  const handleProjectClick = projectData => {
    /*setProject({
      id: projectData.case_id,
      name: projectData.case_details.case_description,
      description: projectData.customer.email,
      status: 'Completed', // Adjust as per your data structure
      dueDate: '2024-07-12', // Adjust as per your data structure
      team: [], // Adjust as per your data structure
    });*/
    toggle()
  }

  const columns = useMemo(
    () =>
      [
        {
          header: "#",
          accessorKey: "img",
          cell: cell => (
            <>
              {!cell.getValue() ? (
                <div className="avatar-xs">
                  <span className="avatar-title rounded-circle">
                    {cell.row.original.customer.first_name.charAt(0)}{" "}
                  </span>
                </div>
              ) : (
                <div>
                  <img
                    className="rounded-circle avatar-xs"
                    src={cell.getValue()}
                    alt=""
                  />
                </div>
              )}
            </>
          ),
          enableColumnFilter: false,
          enableSorting: true,
        },
        {
          header: `${props.t("Description")}`,
          accessorKey: "Description",
          enableColumnFilter: false,
          enableSorting: true,
          cell: cell => (
            <>
              <h5 className="font-size-14 mb-1">
                <Link to="#" className="text-dark">
                  {cell.row.original.case_details.case_description}
                </Link>
              </h5>
            </>
          ),
        },
        {
          header: `${props.t("Project List")}`,
          accessorKey: "customer",
          enableColumnFilter: false,
          enableSorting: true,
          cell: cell => (
            <p className="text-muted mb-0">
              {`${cell.row.original.customer.first_name} ${cell.row.original.customer.last_name}`}
            </p>
          ),
        },
        {
          header: `${props.t("Office")}`,
          accessorKey: "office",
          enableColumnFilter: false,
          enableSorting: true,
          cell: cell => <>{cell.row.original.office.name}</>,
        },
        {
          header: `${props.t("customer email")}`,
          accessorKey: "email",
          enableColumnFilter: false,
          enableSorting: true,
          cell: cell => <>{cell.row.original.customer.email}</>,
        },
        {
          header: `${props.t("Action")}`,
          cell: cellProps => {
            return (
              <div className="d-flex gap-3">
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const project = cellProps.row.original
                    handleProjectClick(project)
                  }}
                >
                  <i className="mdi mdi-pencil font-size-20" id="edittooltip" />
                </Link>
                <Link
                  to="#"
                  className="text-danger"
                  onClick={() => {
                    const userData = cellProps.row.original
                    onClickDelete(userData)
                  }}
                >
                  <i
                    className="mdi mdi-delete font-size-20"
                    id="deletetooltip"
                  />
                </Link>

                <i
                  className="mdi mdi-arrow-left-bold-circle-outline font-size-20 cursor-pointer"
                  onClick={() => {
                    const userData = cellProps.row.original
                    navigate("/projects-overview", { state: { userData } })
                  }}
                ></i>
              </div>
            )
          },
        },
      ].filter(Boolean),
    []
  )

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteProject}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs
            title={props.t("Projects")}
            breadcrumbItem={props.t("Project List")}
          />
          <Row>
            {queryLoading ? (
              <Spinner />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={projects || []}
                      isGlobalFilter={true}
                      isPagination={true}
                      SearchPlaceholder={props.t("Search...")}
                      isCustomPageSize={true}
                      isAddButton={false}
                      handleUserClick={handleUserClicks}
                      tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                      theadClass="table-light"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                      pagination="pagination"
                    />
                  </CardBody>
                </Card>
              </Col>
            )}

            {
              <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle} tag="h4">
                  {!!isEdit ? "Edit Project" : "Add Project"}
                </ModalHeader>
                <ModalBody>
                  <Form
                    onSubmit={e => {
                      e.preventDefault()
                      validation.handleSubmit()
                      return false
                    }}
                  >
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label">customer_id</Label>
                          <Input
                            name="customer_id"
                            type="number"
                            placeholder="Insert customer id"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.username || ""}
                            invalid={
                              validation.touched.customer_id &&
                              validation.errors.customer_id
                                ? true
                                : false
                            }
                          />

                          {validation.touched.customer_id &&
                          validation.errors.customer_id ? (
                            <FormFeedback type="invalid">
                              {validation.errors.customer_id}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label className="form-label">office_id</Label>
                          <Input
                            name="office_id"
                            label="office_id"
                            type="number"
                            placeholder="Insert office id"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.office_id || ""}
                            invalid={
                              validation.touched.office_id &&
                              validation.errors.office_id
                                ? true
                                : false
                            }
                          />

                          {validation.touched.office_id &&
                          validation.errors.office_id ? (
                            <FormFeedback type="invalid">
                              {validation.errors.office_id}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <div className="text-end">
                          <button
                            type="submit"
                            className="btn btn-success save-user"
                            onClick={() => {
                              validation.handleSubmit()
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </ModalBody>
              </Modal>
            }
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default withRouter(withTranslation()(ProjectsList))
