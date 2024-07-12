import React, { useEffect, useState, useMemo } from "react"
import { Link } from "react-router-dom"
import withRouter from "components/Common/withRouter"
import TableContainer from "../../../components/Common/TableContainer"
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

import {
  getUsers as onGetUsers,
  addNewUser as onAddNewUser,
  updateUser as onUpdateUser,
  deleteUser as onDeleteUser,
  getUsersSuccess,
  updateUserSuccess,
} from "store/contacts/actions"
import { isEmpty, last } from "lodash"
import { toast } from "react-toastify"
//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import Spinners from "components/Common/Spinner"
import { ToastContainer } from "react-toastify"
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client"
import { deleteUserSuccess } from "../../../store/contacts/actions"
const GET_ALL_USERS = gql`
  query {
    allUsers {
      user_id
      username
      email
      password
      phone
      role
      first_name
      last_name
      manager_id
      office_id
    }
  }
`

const ADD_USER = gql`
  mutation AddUser(
    $username: String!
    $email: String!
    $phone: String!
    $role: String!
    $password: String!
    $first_name: String!
    $last_name: String!
    $manager_id: ID!
    $office_id: ID
  ) {
    addUser(
      username: $username
      email: $email
      phone: $phone
      role: $role
      password: $password
      first_name: $first_name
      last_name: $last_name
      manager_id: $manager_id
      office_id: $office_id
    ) {
      user_id
      username
      email
      password
      phone
      role
      first_name
      last_name
      manager_id
      office_id
    }
  }
`
const UPDATE_USER = gql`
  mutation UpdateUser(
    $user_id: ID!
    $username: String!
    $email: String!
    $phone: String!
    $role: String!
    $password: String!
    $first_name: String!
    $last_name: String!
    $manager_id: ID!
    $office_id: ID
  ) {
    updateUser(
      user_id: $user_id
      username: $username
      email: $email
      phone: $phone
      role: $role
      password: $password
      first_name: $first_name
      last_name: $last_name
      manager_id: $manager_id
      office_id: $office_id
    ) {
      user_id
      username
      email
      password
      phone
      role
      first_name
      last_name
      manager_id
      office_id
    }
  }
`

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      user_id
    }
  }
`

const ContactsList = () => {
  //meta title
  document.title = "User List | CPALINK"

  const dispatch = useDispatch()
  const [contact, setContact] = useState()
  const [currentUser, setCurrentUser] = useState()
  const [addUserMutation, { loading: mutationLoading, error }] =
    useMutation(ADD_USER)

  const [updateUserMutation, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_USER)

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: (contact && contact.username) || "",
      role: (contact && contact.role) || "",
      email: (contact && contact.email) || "",
      password: (contact && contact.password) || "",
      phone: (contact && contact.phone) || "",
      first_name: (contact && contact.first_name) || "",
      last_name: (contact && contact.last_name) || "",
      manager_id: (contact && contact?.manager_id) || "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your username"),
      role: Yup.string().required("Please Enter role"),
      email: Yup.string()
        .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please Enter Valid Email")
        .required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter password"),
      phone: Yup.string().required("Please Enter phone"),
      first_name: Yup.string().required("Please Enter first name"),
      last_name: Yup.string().required("Please Enter last name"),
      manager_id: Yup.string().required("Please Select a Manager"),
    }),

    onSubmit: values => {
      if (isEdit) {
        /*console.log("update start..")
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
        )*/
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
      }
      toggle()
    },
  })

  const ContactsProperties = createSelector(
    state => state.contacts,
    Contacts => ({
      users: Contacts.users,
      loading: Contacts.loading,
    })
  )

  const { users, loading } = useSelector(ContactsProperties)

  const [modal, setModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setLoading] = useState(loading)
  const [usersdetails, setUsersdetails] = useState(loading)
  const [ManagerList, setManagerList] = useState([])

  const [getUsers, { data, loading: queryLoading }] = useLazyQuery(
    GET_ALL_USERS,
    {
      onCompleted: data => {
        if (data?.allUsers) {
          dispatch(getUsersSuccess(data.allUsers))
          const managers = data.allUsers.filter(user => user.role === "manager")
          const managersObject = managers.reduce((acc, manager) => {
            acc[manager.manager_id] = manager
            return acc
          }, {})

          setManagerList(managersObject)
        }
      },
    }
  )

  const [deleteUser] = useMutation(DELETE_USER)

  //getting the current user
  useEffect(() => {
    if (!currentUser) {
      if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"))
        setCurrentUser(obj)
      }
    }
  }, [currentUser])

  useEffect(() => {
    if (users) {
      getUsers()
    }
  }, [])

  useEffect(() => {
    setContact(users)
    setIsEdit(false)
  }, [users])

  useEffect(() => {
    if (!isEmpty(users) && !!isEdit) {
      setContact(users)
      setIsEdit(false)
    }
  }, [users])

  const toggle = () => {
    setModal(!modal)
  }

  const handleUserClick = arg => {
    const user = arg

    setContact({
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

  const onClickDelete = users => {
    setContact(users)
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
    setContact(null)
    setIsEdit(false)
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
                    {cell.row.original.email.charAt(0)}{" "}
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
          header: "username",
          accessorKey: "username",
          enableColumnFilter: false,
          enableSorting: true,
          cell: cell => {
            return (
              <>
                <h5 className="font-size-14 mb-1">
                  <Link to="#" className="text-dark">
                    {cell.getValue()}
                  </Link>
                </h5>
                <p className="text-muted mb-0">
                  {cell.row.original.designation}
                </p>
              </>
            )
          },
        },
        {
          header: "email",
          accessorKey: "email",
          enableColumnFilter: false,
          enableSorting: true,
        },
        {
          header: "role",
          accessorKey: "role",
          enableColumnFilter: false,
          enableSorting: true,
          cell: cell => {
            return <div>{cell.getValue()}</div>
          },
        },
        {
          header: "phone",
          accessorKey: "phone",
          enableColumnFilter: false,
          enableSorting: true,
        },
        {
          header: "first name",
          accessorKey: "first_name",
          enableColumnFilter: false,
          enableSorting: true,
        },
        {
          header: "last name",
          accessorKey: "last_name",
          enableColumnFilter: false,
          enableSorting: true,
        },
        {
          header: "Manager",
          accessorKey: "manager_id",
          enableColumnFilter: false,
          enableSorting: true,
          cell: cell => {
            const manager = ManagerList[cell.getValue()]
            return (
              <div>
                {manager ? `${manager.first_name} ${manager.last_name}` : ""}
              </div>
            )
          },
        },
        currentUser?.role === "admin" && {
          header: "Action",
          cell: cellProps => {
            return (
              <div className="d-flex gap-3">
                <Link
                  to="#"
                  className="text-success"
                  onClick={() => {
                    const userData = cellProps.row.original
                    handleUserClick(userData)
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
    [currentUser, ManagerList]
  )

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUser}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Contacts" breadcrumbItem="User List" />
          <Row>
            {isLoading ? (
              <Spinners setLoading={setLoading} />
            ) : (
              <Col lg="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={users || []}
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

            <Modal isOpen={modal} toggle={toggle}>
              <ModalHeader toggle={toggle} tag="h4">
                {!!isEdit ? "Edit User" : "Add User"}
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
                        <Label className="form-label">username</Label>
                        <Input
                          name="username"
                          type="text"
                          placeholder="Insert username"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.username || ""}
                          invalid={
                            validation.touched.username &&
                            validation.errors.username
                              ? true
                              : false
                          }
                        />

                        {validation.touched.username &&
                        validation.errors.username ? (
                          <FormFeedback type="invalid">
                            {validation.errors.username}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          label="email"
                          type="email"
                          placeholder="Insert Email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email
                              ? true
                              : false
                          }
                        />

                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">
                            {validation.errors.email}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                    <Col md={6}>
                      {currentUser?.role === "admin" && (
                        <div className="mb-3">
                          <Label className="form-label">password</Label>
                          <Input
                            name="password"
                            label="password"
                            type="text"
                            placeholder="Insert password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />

                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                        </div>
                      )}
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label className="form-label">role</Label>
                        <Input
                          name="role"
                          label="role"
                          type="text"
                          placeholder="Insert role"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.role || ""}
                          invalid={
                            validation.touched.role && validation.errors.role
                              ? true
                              : false
                          }
                        />

                        {validation.touched.role && validation.errors.role ? (
                          <FormFeedback type="invalid">
                            {validation.errors.role}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label className="form-label">phone</Label>
                        <Input
                          name="phone"
                          label="phone"
                          type="text"
                          placeholder="Insert phone"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.phone || ""}
                          invalid={
                            validation.touched.phone && validation.errors.phone
                              ? true
                              : false
                          }
                        />

                        {validation.touched.phone && validation.errors.phone ? (
                          <FormFeedback type="invalid">
                            {validation.errors.phone}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label className="form-label">first name</Label>
                        <Input
                          name="first_name"
                          label="first_name"
                          type="text"
                          placeholder="Insert first name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.first_name || ""}
                          invalid={
                            validation.touched.first_name &&
                            validation.errors.first_name
                              ? true
                              : false
                          }
                        />

                        {validation.touched.first_name &&
                        validation.errors.first_name ? (
                          <FormFeedback type="invalid">
                            {validation.errors.first_name}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label className="form-label">last name</Label>
                        <Input
                          name="last_name"
                          label="last_name"
                          type="text"
                          placeholder="Insert last name"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.last_name || ""}
                          invalid={
                            validation.touched.last_name &&
                            validation.errors.last_name
                              ? true
                              : false
                          }
                        />

                        {validation.touched.last_name &&
                        validation.errors.last_name ? (
                          <FormFeedback type="invalid">
                            {validation.errors.last_name}
                          </FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <Label className="form-label">Manager</Label>
                        <Input
                          name="manager_id"
                          type="select"
                          value={validation.values.manager_id}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.manager_id &&
                            !!validation.errors.manager_id
                          }
                        >
                          <option value="" disabled>
                            Select Manager
                          </option>
                          {Object.values(ManagerList).map(manager => (
                            <option
                              key={manager.user_id}
                              value={manager.user_id}
                            >
                              {`${manager.first_name} ${manager.last_name}`}
                            </option>
                          ))}
                        </Input>
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
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default withRouter(ContactsList)
