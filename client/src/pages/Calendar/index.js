import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { isEmpty } from "lodash"

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap"
import * as Yup from "yup"
import { useFormik } from "formik"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"
import BootstrapTheme from "@fullcalendar/bootstrap"
import allLocales from "@fullcalendar/core/locales-all"
import { ToastContainer } from "react-toastify"
import { toast } from "react-toastify"
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

//import Images
import verification from "../../assets/images/verification-img.png"
import { withTranslation } from "react-i18next"
import withRouter from "components/Common/withRouter"

import {
  addNewEvent as onAddNewEvent,
  deleteEvent as onDeleteEvent,
  getEvents as onGetEvents,
  updateEvent as onUpdateEvent,
  getEventsSuccess,
  addEventSuccess,
} from "../../store/actions"

import DeleteModal from "./DeleteModal"

//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client"
import {
  GET_USER_EVENTS,
  INSERT_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
} from "./queries"

const Calender = props => {
  //meta title
  document.title = "Calendar | CPALINK"

  const dispatch = useDispatch()

  const [event, setEvent] = useState([])
  const [isEdit, setIsEdit] = useState(false)

  const [currentUser, setCurrentUser] = useState(() => {
    const authUser = localStorage.getItem("authUser")
    return authUser ? JSON.parse(authUser) : null
  })
  const [convertedEvents, setConvertedEvents] = useState()

  const CalendarProperties = createSelector(
    state => state.calendar,

    Calendar => ({
      events: Calendar.events,
    })
  )

  const { events } = useSelector(CalendarProperties)
  const categories = [
    {
      id: 1,
      title: "New Event",
      type: "bg-success",
    },
    {
      id: 2,
      title: "Meeting",
      type: "bg-info",
    },
    {
      id: 3,
      title: "Reminder",
      type: "bg-warning",
    },
    {
      id: 4,
      title: "Important Meeting",
      type: "bg-danger",
    },
  ]
  const [getUserCalendar, { data, loading: queryLoading }] = useLazyQuery(
    GET_USER_EVENTS,
    {
      onCompleted: data => {
        if (data?.userEvents) {
          const formattedEvents = convertEvents(data.userEvents)
          dispatch(getEventsSuccess(formattedEvents))
        }
      },
    }
  )

  const [deleteEvent] = useMutation(DELETE_EVENT, {
    onCompleted: () => {
      dispatch(onDeleteEvent(deleteId))
      toast.success(`${props.t("Event deleted successfully")}`, {
        autoClose: 2000,
      })
    },
  })

  const [updateEvent] = useMutation(UPDATE_EVENT, {
    onCompleted: data => {
      const updatedEvent = convertEvent(data.updateEvent)
      dispatch(onUpdateEvent(updatedEvent))
      toast.success(`${props.t("Event updated successfully")}`, {
        autoClose: 2000,
      })
    },
  })

  const [insertNewEvent] = useMutation(INSERT_EVENT, {
    onCompleted: data => {
      const newEvent = convertEvent(data.addEvent)
      dispatch(addEventSuccess(newEvent))
      toast.success(`${props.t("Event added successfully")}`, {
        autoClose: 2000,
      })
    },
  })

  useEffect(() => {
    if (events) {
      setConvertedEvents(
        events.map(event => ({
          ...event,
          start: new Date(parseInt(event.start_timestamp)),
        }))
      )
    }
  }, [events])

  /*
  useEffect(() => {
    if (!events || events.length === 0) {
      getUserCalendar({
        variables: { userEmail: currentUser.email },
      })
    }
  }, [currentUser, events])
  */
  // category validation
  const categoryValidation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      title: (event && event.title) || "",
      category: (event && event.category) || "",
      shared_with: (event && event.shared_with) || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Please Enter Your Event Name"),
      category: Yup.string().required("Please Enter Your Event Category"),
      shared_with: Yup.string()
        .email("Invalid email format")
        .required("Please Enter Email to share event"),
    }),
    onSubmit: async values => {
      if (isEdit) {
        updateEvent({
          variables: {
            id: event.id,
            user_id: currentUser.user_id,
            title: values.title,
            start_timestamp: event.start_timestamp,
            event_class: values.category + " text-white",
            shared_with: values.shared_with,
          },
        })
      } else {
        insertNewEvent({
          variables: {
            user_id: currentUser.user_id,
            title: values.title,
            start_timestamp: selectedDay ? selectedDay.date : new Date(),
            event_class: values.category + " text-white",
            shared_with: values.shared_with,
          },
        })
      }
      toggle()
    },
  })

  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState()
  const [modalCategory, setModalCategory] = useState(false)
  const [selectedDay, setSelectedDay] = useState(0)

  useEffect(() => {
    new Draggable(document.getElementById("external-events"), {
      itemSelector: ".external-event",
    })
  }, [dispatch])

  useEffect(() => {
    if (!modalCategory && !isEmpty(event) && !!isEdit) {
      setEvent({})
      setIsEdit(false)
    }
  }, [modalCategory, event, isEdit])

  /**
   * Handling the modal state
   */
  const toggle = () => {
    if (modalCategory) {
      setModalCategory(false)
      setEvent(null)
      setIsEdit(false)
    } else {
      setModalCategory(true)
    }
  }

  /**
   * Handling date click on calendar
   */
  const handleDateClick = arg => {
    const date = arg["date"]
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    const currectDate = new Date()
    const currentHour = currectDate.getHours()
    const currentMin = currectDate.getMinutes()
    const currentSec = currectDate.getSeconds()
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    )
    const modifiedData = { ...arg, date: modifiedDate }

    setSelectedDay(modifiedData)
    toggle()
  }

  /**
   * Handling click on event on calendar
   */
  const handleEventClick = arg => {
    const event = arg.event

    setEvent({
      id: event.id,
      title: event.title,

      start: event.start,
      className: event.classNames,
      category: event.classNames[0],
      event_category: event.classNames[0],
      shared_with: event.extendedProps.shared_with,
    })
    setDeleteId(event.id)
    setIsEdit(true)
    setModalCategory(true)
    toggle()
  }

  /**
   * On delete event
   */
  const handleDeleteEvent = () => {
    deleteEvent({ variables: { id: deleteId } })
    setDeleteModal(false)
  }

  /**
   * On category darg event
   */
  const onDrag = event => {
    event.preventDefault()
  }

  /**
   * On calendar drop event
   */
  const onDrop = event => {
    const date = event["date"]
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    const currectDate = new Date()
    const currentHour = currectDate.getHours()
    const currentMin = currectDate.getMinutes()
    const currentSec = currectDate.getSeconds()
    const modifiedDate = new Date(
      year,
      month,
      day,
      currentHour,
      currentMin,
      currentSec
    )

    const draggedEl = event.draggedEl
    const draggedElclass = draggedEl.className
    if (
      draggedEl.classList.contains("external-event") &&
      draggedElclass.indexOf("fc-event-draggable") == -1
    ) {
      const newEvent = {
        id: Math.floor(Math.random() * 100),
        title: draggedEl.innerText,
        start: modifiedDate,
        className: draggedEl.className,
      }
      dispatch(onAddNewEvent(newEvent))
      setConvertedEvents([...convertedEvents, newEvent])
    }
  }

  //set the local language
  const enLocal = {
    code: "en-nz",
    week: {
      dow: 1,
      doy: 4,
    },
    buttonHints: {
      prev: "Previous $0",
      next: "Next $0",
      today: "This $0",
    },
    viewHint: "$0 view",
    navLinkHint: "Go to $0",
  }
  const [isLocal, setIsLocal] = useState(enLocal)
  const handleChangeLocals = value => {
    setIsLocal(value)
  }

  // Utility function to convert events data to the format expected by FullCalendar
  const convertEvents = events => {
    return events.map(event => convertEvent(event))
  }

  // Utility function to convert a single event
  const convertEvent = event => {
    return {
      id: event.id,
      title: event.title,
      start: new Date(parseInt(event.start_timestamp)),
      end: event.end_timestamp ? new Date(parseInt(event.end_timestamp)) : null,
      className: event.event_class,
      extendedProps: {
        shared_with: event.shared_with,
      },
    }
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteEvent}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid={true}>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Calendar")}
            breadcrumbItem={props.t("Full Calendar")}
          />
          <Row>
            <Col xs={12}>
              <Row>
                <Col xl={3}>
                  <Card>
                    <CardBody>
                      <div className="d-flex gap-2">
                        <div className="flex-grow-1">
                          <select
                            id="locale-selector"
                            className="form-select"
                            defaultValue={isLocal}
                            onChange={event => {
                              const selectedValue = event.target.value
                              const selectedLocale = allLocales.find(
                                locale => locale.code === selectedValue
                              )
                              handleChangeLocals(selectedLocale)
                            }}
                          >
                            {(allLocales || [])?.map((localeCode, key) => (
                              <option key={key} value={localeCode.code}>
                                {localeCode.code}
                              </option>
                            ))}
                          </select>
                        </div>
                        <Button
                          color="primary"
                          className="font-16"
                          onClick={toggle}
                        >
                          <i className="mdi mdi-plus-circle-outline me-1" />
                          {props.t("Create New Event")}
                        </Button>
                      </div>

                      <div id="external-events" className="mt-2">
                        <br />
                        <p className="text-muted">
                          {props.t(
                            "Drag and drop your event or click in the calendar"
                          )}
                        </p>
                        {categories &&
                          (categories || [])?.map(category => (
                            <div
                              className={`${category.type} external-event fc-event text-white`}
                              key={"cat-" + category.id}
                              draggable
                              onDrag={event => onDrag(event, category)}
                            >
                              <i className="mdi mdi-checkbox-blank-circle font-size-11 me-2" />
                              {category.title}
                            </div>
                          ))}
                      </div>

                      <Row className="justify-content-center mt-5">
                        <img
                          src={verification}
                          alt=""
                          className="img-fluid d-block"
                        />
                      </Row>
                    </CardBody>
                  </Card>
                </Col>

                <Col xl={9}>
                  <Card>
                    <CardBody>
                      {/* fullcalendar control */}
                      <FullCalendar
                        plugins={[
                          BootstrapTheme,
                          dayGridPlugin,
                          listPlugin,
                          interactionPlugin,
                        ]}
                        slotDuration={"00:15:00"}
                        handleWindowResize={true}
                        themeSystem="bootstrap"
                        headerToolbar={{
                          left: "prev,next today",
                          center: "title",
                          right: "dayGridMonth,dayGridWeek,dayGridDay,listWeek",
                        }}
                        locale={isLocal}
                        events={events}
                        editable={true}
                        droppable={true}
                        selectable={true}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        drop={onDrop}
                      />
                    </CardBody>
                  </Card>
                  <Modal
                    isOpen={modalCategory}
                    className={props.className}
                    centered
                  >
                    <ModalHeader toggle={toggle} tag="h5">
                      {!!isEdit ? "Edit Event" : "Add Event"}
                    </ModalHeader>
                    <ModalBody className="p-4">
                      <Form
                        onSubmit={e => {
                          e.preventDefault()
                          categoryValidation.handleSubmit()
                          return false
                        }}
                      >
                        <Row>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label>{props.t("Event Name")}</Label>
                              <Input
                                name="title"
                                type="text"
                                placeholder={props.t("Insert Event Name")}
                                onChange={categoryValidation.handleChange}
                                onBlur={categoryValidation.handleBlur}
                                value={categoryValidation.values.title || ""}
                                invalid={
                                  categoryValidation.touched.title &&
                                  categoryValidation.errors.title
                                    ? true
                                    : false
                                }
                              />
                              {categoryValidation.touched.title &&
                              categoryValidation.errors.title ? (
                                <FormFeedback type="invalid">
                                  {categoryValidation.errors.title}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col xs={12}>
                            <div className="mb-3">
                              <Label>{props.t("Category")}</Label>
                              <Input
                                type="select"
                                name="category"
                                placeholder={props.t("All Day Event")}
                                onChange={categoryValidation.handleChange}
                                onBlur={categoryValidation.handleBlur}
                                value={categoryValidation.values.category || ""}
                                invalid={
                                  categoryValidation.touched.category &&
                                  categoryValidation.errors.category
                                    ? true
                                    : false
                                }
                              >
                                <option value="bg-danger">
                                  {props.t("Danger")}
                                </option>
                                <option value="bg-success">
                                  {props.t("Success")}
                                </option>
                                <option value="bg-primary">
                                  {props.t("Primary")}
                                </option>
                                <option value="bg-info">
                                  {props.t("Info")}
                                </option>
                                <option value="bg-dark">
                                  {props.t("Dark")}
                                </option>
                                <option value="bg-warning">
                                  {props.t("Warning")}
                                </option>
                              </Input>
                              {categoryValidation.touched.category &&
                              categoryValidation.errors.category ? (
                                <FormFeedback type="invalid">
                                  {categoryValidation.errors.category}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>

                          <Col xs={12}>
                            <div className="mb-3">
                              <Label>{props.t("Share event with")}</Label>
                              <Input
                                name="shared_with"
                                type="text"
                                placeholder={props.t("Insert user Email")}
                                onChange={categoryValidation.handleChange}
                                onBlur={categoryValidation.handleBlur}
                                value={
                                  categoryValidation.values.shared_with || ""
                                }
                                invalid={
                                  categoryValidation.touched.shared_with &&
                                  categoryValidation.errors.shared_with
                                    ? true
                                    : false
                                }
                              />
                              {categoryValidation.touched.shared_with &&
                              categoryValidation.errors.shared_with ? (
                                <FormFeedback type="invalid">
                                  {categoryValidation.errors.shared_with}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>

                        <Row className="mt-2">
                          <Col xs={6}>
                            {isEdit && (
                              <Button
                                type="button"
                                color="btn btn-danger"
                                id="btn-delete-event"
                                onClick={() => {
                                  toggle()
                                  setDeleteModal(true)
                                }}
                              >
                                {props.t("Delete")}
                              </Button>
                            )}
                          </Col>

                          <Col xs={6} className="text-end">
                            <Button
                              color="light"
                              type="button"
                              className="me-1"
                              onClick={toggle}
                            >
                              {props.t("Close")}
                            </Button>
                            <Button
                              type="submit"
                              color="success"
                              id="btn-save-event"
                            >
                              {props.t("Save")}
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </ModalBody>
                  </Modal>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

Calender.propTypes = {
  events: PropTypes.array,

  className: PropTypes.string,
  onGetEvents: PropTypes.func,
  onAddNewEvent: PropTypes.func,
  onUpdateEvent: PropTypes.func,
  onDeleteEvent: PropTypes.func,
}

export default withRouter(withTranslation()(Calender))
