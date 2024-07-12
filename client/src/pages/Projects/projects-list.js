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
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
import DeleteModal from "components/Common/DeleteModal"

import { isEmpty, last } from "lodash"
import { toast } from "react-toastify"
//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import Spinners from "components/Common/Spinner"
import { ToastContainer } from "react-toastify"
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client"

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

const ProkectssList = () => {
  //meta title
  document.title = "Project List | CPALINK"

  const dispatch = useDispatch()
  const [project, setProject] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [projects, setProjects] = useState()

  const [getProjects, { data, loading: queryLoading, error }] = useLazyQuery(
    GET_PROJECTS_BY_OFFICE_ID,
    {
      variables: { office_id: 1 },
      onCompleted: data => {
        if (data?.casesOfCustomersDetailsByOfficeID) {
          setProjects(data.casesOfCustomersDetailsByOfficeID)
        }
      },
    }
  )

  useEffect(() => {
    getProjects()
  }, [getProjects])

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
      /*if (isEdit) {
        console.log("update start..")
        console.log(
          contact.user_id,
          values.username,
          values.email,
          values.phone,
          values.role,
          contact.password,
          values.first_name,
          values.last_name,
          values.manager_id
        )
        updateUserMutation({
          variables: {
            user_id: contact.user_id,
            username: values.username,
            email: values.email,
            phone: values.phone,
            role: values.role,
            password: contact.password,
            first_name: values.first_name,
            last_name: values.last_name,
            manager_id: values.manager_id,
          },
        })
          .then(result => {
            dispatch(updateUserSuccess(result.data.updateUser))
            setIsEdit(false)
            validation.resetForm()
          })
          .catch(error => {
            console.log("Error updating user:", error)
          })
      } else {
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
      }*/
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
    const user = arg

    setProject({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
    })
    setIsEdit(true)

    toggle()
  }

  //delete
  const [deleteModal, setDeleteModal] = useState(false)

  const onClickDelete = userData => {
    setProject(userData)
    setDeleteModal(true)
  }

  const handleDeleteUser = () => {
    deleteUser({ variables: { id: contact.user_id } }).then(result => {
      dispatch(deleteUserSuccess(contact.user_id))
      toast.success("Event Deleted Successfully", { autoClose: 2000 })
    })
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
          header: "Description",
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
          header: "Customer",
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
          header: "Office",
          accessorKey: "office",
          enableColumnFilter: false,
          enableSorting: true,
          cell: cell => <>{cell.row.original.office.name}</>,
        },
        {
          header: "customer email",
          accessorKey: "email",
          enableColumnFilter: false,
          enableSorting: true,
          cell: cell => <>{cell.row.original.customer.email}</>,
        },
        {
          header: "Action",
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
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
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
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                  />
                </Link>
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
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Project" breadcrumbItem="Project List" />
          <Row>
            {queryLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={projects || []}
                      isGlobalFilter={true}
                      isPagination={true}
                      SearchPlaceholder="Search..."
                      isCustomPageSize={true}
                      isAddButton={
                        currentUser?.role === "admin" ||
                        currentUser?.role === "manager"
                      }
                      handleUserClick={handleUserClicks}
                      buttonClass="btn btn-success btn-rounded waves-effect waves-light addContact-modal mb-2"
                      buttonName="New Customer"
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

export default withRouter(ProkectssList)
