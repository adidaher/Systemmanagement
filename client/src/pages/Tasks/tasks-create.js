import React, { useState } from "react"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Input,
  FormGroup,
  Label,
  Button,
} from "reactstrap"

// Import Editor
import { Editor } from "react-draft-wysiwyg"
import { EditorState } from "draft-js"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { ToastContainer } from "react-toastify"
// FlatPickr
import "flatpickr/dist/themes/material_blue.css"
import FlatPickr from "react-flatpickr"
import { withTranslation } from "react-i18next"
// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

import { useMutation, gql } from "@apollo/client"
import { toast } from "react-toastify"
import { addCardDataSuccess } from "store/tasks/actions"
import { useSelector, useDispatch } from "react-redux"

const ADD_TASK = gql`
  mutation AddTask(
    $task_name: String!
    $task_partners: String!
    $task_status: String!
    $task_deadline: String!
    $task_description: String!
  ) {
    addTask(
      task_name: $task_name
      task_partners: $task_partners
      task_status: $task_status
      task_deadline: $task_deadline
      task_description: $task_description
    ) {
      task_id
      task_name
      task_partners
      task_status
      task_deadline
      task_description
    }
  }
`

const TasksCreate = props => {
  // Meta title
  document.title = "Create Task | CPALINK"

  const inpRow = [{ name: "" }]
  const [startDate, setStartDate] = useState(new Date())
  const [inputFields, setInputFields] = useState(inpRow)
  const [task_status] = useState("in Progress")
  const [task_name, setTaskName] = useState("")
  const [task_partners, setTaskPartners] = useState("")
  const [task_description, setTaskDescription] = useState(
    EditorState.createEmpty()
  )
  const dispatch = useDispatch()
  const [addTask, { loading, error, data }] = useMutation(ADD_TASK)

  // Function to create input fields
  function handleAddFields() {
    const item = { name: "" }
    setInputFields([...inputFields, item])
  }

  // Function to remove input fields
  function handleRemoveFields(idx) {
    const fields = [...inputFields]
    fields.splice(idx, 1)
    setInputFields(fields)
    setTaskPartners(fields.map(field => field.name).join(","))
  }

  const handlePartnerChange = (index, value) => {
    const fields = [...inputFields]
    fields[index].name = value
    setInputFields(fields)
    setTaskPartners(fields.map(field => field.name).join(","))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const taskDescription = task_description.getCurrentContent().getPlainText()
    const taskDeadline = startDate.toISOString().slice(0, 10)
    try {
      await addTask({
        variables: {
          task_name,
          task_partners,
          task_status,
          task_deadline: taskDeadline,
          task_description: taskDescription,
        },
      }).then(result => {
        dispatch(addCardDataSuccess(result.data.addTask))
        //console.log("Task created Successfully")
        toast.success("Task created Successfully", { autoClose: 2000 })
      })
    } catch (err) {
      //console.log(err)
      toast.error("Task created Failded", { autoClose: 2000 })
    }
  }

  return (
    <>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs
            title={props.t("Tasks")}
            breadcrumbItem={props.t("Create Task")}
          />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Create New Task</CardTitle>
                  <form className="outer-repeater" onSubmit={handleSubmit}>
                    <div data-repeater-list="outer-group" className="outer">
                      <div data-repeater-item className="outer">
                        <FormGroup className="mb-4" row>
                          <Label
                            htmlFor="taskname"
                            className="col-form-label col-lg-2"
                          >
                            {props.t("Task Name")}
                          </Label>
                          <Col lg="10">
                            <Input
                              id="taskname"
                              name="taskname"
                              type="text"
                              className="form-control"
                              placeholder={props.t("Enter Task Name...")}
                              onChange={e => {
                                setTaskName(e.target.value)
                              }}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup className="mb-4" row>
                          <Label className="col-form-label col-lg-2">
                            {props.t("Task Description")}
                          </Label>
                          <Col lg="10">
                            <Editor
                              toolbarClassName="toolbarClassName"
                              wrapperClassName="wrapperClassName"
                              editorClassName="editorClassName"
                              placeholder={props.t("Enter Task Description...")}
                              editorState={task_description}
                              onEditorStateChange={setTaskDescription}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup className="mb-4" row>
                          <Label className="col-form-label col-lg-2">
                            {props.t("DeadLine")}
                          </Label>
                          <Col lg="10">
                            <Row>
                              <Col md={6} className="pr-0">
                                <FlatPickr
                                  className="form-control"
                                  name="joiningDate"
                                  options={{
                                    dateFormat: "Y-m-d",
                                  }}
                                  placeholder={props.t("Select DeadLine time")}
                                  value={startDate}
                                  onChange={date => setStartDate(date[0])}
                                />
                              </Col>
                            </Row>
                          </Col>
                        </FormGroup>

                        <div className="inner-repeater mb-4">
                          <div className="inner form-group mb-0 row">
                            <Label className="col-form-label col-lg-2">
                              {props.t("Add Team Member")}
                            </Label>
                            <div
                              className="inner col-lg-10 ml-md-auto"
                              id="repeater"
                            >
                              {inputFields.map((field, key) => (
                                <div
                                  key={key}
                                  id={"nested" + key}
                                  className="mb-3 row align-items-center"
                                >
                                  <Col md="6">
                                    <input
                                      type="text"
                                      className="inner form-control"
                                      value={field.name}
                                      placeholder={props.t("Enter email...")}
                                      onChange={e => {
                                        handlePartnerChange(key, e.target.value)
                                      }}
                                    />
                                  </Col>
                                  <Col md="2">
                                    <Button
                                      color="danger"
                                      onClick={() => handleRemoveFields(key)}
                                    >
                                      {props.t("Remove")}
                                    </Button>
                                  </Col>
                                </div>
                              ))}
                            </div>
                          </div>
                          <Row className="justify-content-end">
                            <Col lg="10">
                              <Button
                                color="success"
                                className="inner"
                                onClick={handleAddFields}
                              >
                                {props.t("Assign Member")}
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </div>
                    <Row className="justify-content-end">
                      <Col lg="10">
                        <Button type="submit" color="primary">
                          {props.t("Create Task")}
                        </Button>
                      </Col>
                    </Row>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </>
  )
}

export default withTranslation()(TasksCreate)
