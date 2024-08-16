import React, { useEffect, useRef, useState } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { map } from "lodash"
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  Nav,
  NavItem,
  NavLink,
  Row,
  Spinner,
  TabContent,
  TabPane,
  UncontrolledAlert,
  UncontrolledDropdown,
  UncontrolledTooltip,
} from "reactstrap"
import classnames from "classnames"

// emoji
import EmojiPicker from "emoji-picker-react"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"
import avatar1 from "../../assets/images/users/avatar-1.jpg"

// simple bar
import SimpleBar from "simplebar-react"
import "simplebar-react/dist/simplebar.min.css"

import {
  deleteMessage as onDeleteMessage,
  addMessage as onAddMessage,
  getChats as onGetChats,
  getContacts as onGetContacts,
  getGroups as onGetGroups,
  getMessages as onGetMessages,
} from "store/actions"
import { getGroupsSuccess, getOfficeName } from "../../store/chat/actions"
//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import Spinners from "components/Common/Spinner"

import { handleSearchData } from "components/Common/searchFile"

import { useLazyQuery, gql, useMutation } from "@apollo/client"

import { withTranslation } from "react-i18next"

const getChats = gql`
  query getChatsByOfficeId($office_id: ID!) {
    getChatsByOfficeId(office_id: $office_id) {
      id
      message
      sent_at
      sender {
        user_id
        first_name
        last_name
      }
      office {
        office_id
        name
      }
    }
  }
`

const Chat = props => {
  //meta title
  document.title = "Chat | CPALINK"
  const [currentUser, setCurrentUser] = useState()

  const dispatch = useDispatch()

  const [getOfficeChats, { isLoading, data, error }] = useLazyQuery(getChats, {
    variables: { office_id: currentUser?.office_id },
  })

  const ChatProperties = createSelector(
    state => state.chat,
    Chat => ({
      groups: Chat.groups,
      officeName: Chat.officeName,
    })
  )

  const { groups, officeName } = useSelector(ChatProperties)

  useEffect(() => {
    if (!currentUser) {
      if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"))
        setCurrentUser(obj)
      }
    }
  }, [currentUser])

  useEffect(() => {
    if (!groups || groups.length === 0) {
      const fetchChats = async () => {
        try {
          const { data } = await getOfficeChats()
          if (data) {
            setChat_Box_Username(data?.getChatsByOfficeId[0].office.name)
            dispatch(getOfficeName(data?.getChatsByOfficeId[0].office.name))
            dispatch(getGroupsSuccess(data.getChatsByOfficeId))
          }
        } catch (err) {
          console.error("Error fetching chats:", err)
        }
      }
      fetchChats()
    }
  }, [currentUser, groups, dispatch, getOfficeChats])

  const [messagesData, setMessagesData] = useState()

  const [menu1, setMenu1] = useState(false)
  const [search_Menu, setsearch_Menu] = useState(false)
  const [settings_Menu, setsettings_Menu] = useState(false)
  const [other_Menu, setother_Menu] = useState(false)
  const [emoji, setEmoji] = useState(false)
  const [activeTab, setactiveTab] = useState("2")
  const [Chat_Box_Username, setChat_Box_Username] = useState("")
  // eslint-disable-next-line no-unused-vars
  const [Chat_Box_User_Status, setChat_Box_User_Status] = useState("online")
  const [curMessage, setCurMessage] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [isdisable, setDisable] = useState(false)

  useEffect(() => {
    if (currentUser) {
      const updateMessagesWithCurrentUser = (messages, currentUser) => {
        return messages.map(msg => ({
          ...msg,
          isCurrentUser: msg.sender.user_id === currentUser.user_id,
        }))
      }
      const updatedMessages = updateMessagesWithCurrentUser(groups, currentUser)
      //console.log(updatedMessages)
      setMessagesData(updatedMessages)
    }
  }, [currentUser, groups])

  //Toggle Chat Box Menus
  const toggleSearch = () => {
    setsearch_Menu(!search_Menu)
  }

  const toggleSettings = () => {
    setsettings_Menu(!settings_Menu)
  }

  const toggleOther = () => {
    setother_Menu(!other_Menu)
  }

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab)
    }
  }

  //Use For Chat Box
  const userChatOpen = chat => {
    setChat_Box_Username(officeName)
  }

  // search
  const handelSearch = () => {
    const searchInput = document.getElementById("searchMessage")
    const searchFilter = searchInput.value.toUpperCase()
    const searchUL = document.getElementById("users-conversation")
    const searchLI = searchUL.getElementsByTagName("li")

    Array.prototype.forEach.call(searchLI, search => {
      const a = search.getElementsByTagName("p")[0] || ""
      const txtValue = a.textContent || a.innerText || ""

      if (txtValue.toUpperCase().indexOf(searchFilter) > -1) {
        search.style.display = ""
      } else {
        search.style.display = "none"
      }
    })
  }

  function convertTimestamp(timestampStr) {
    const timestamp = parseInt(timestampStr, 10)

    const dateObj = new Date(timestamp)

    const date = dateObj.toLocaleDateString()
    const time = dateObj.toLocaleTimeString()

    return {
      date: date,
      time: time,
    }
  }

  const currentTime = new Date()
  const hours = currentTime.getHours()
  const minutes = currentTime.getMinutes()
  const time = `${hours}: ${minutes}`
  const addMessage = () => {
    if (curMessage !== "" || selectedImage !== null) {
      const newMessage = {
        id: Math.floor(Math.random() * 100),
        to_id: 2,
        msg: curMessage,
        isSameTime: true,
        images: selectedImage,
        time: time,
      }
      dispatch(onAddMessage(newMessage))
      setCurMessage("")
      setDisable(false)
      setEmoji(false)
      setSelectedImage(null)
    }
  }

  const onKeyPress = e => {
    const { value } = e

    setCurMessage(value)
    setDisable(true)
    addMessage()
  }

  //search recent user
  const searchUsers = () => {
    var input, filter, ul, li, a, i, txtValue
    input = document.getElementById("search-user")
    filter = input.value.toUpperCase()
    ul = document.getElementById("recent-list")
    li = ul.getElementsByTagName("li")
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0]
      txtValue = a.textContent || a.innerText
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = ""
      } else {
        li[i].style.display = "none"
      }
    }
  }

  const [deleteMsg, setDeleteMsg] = useState("")
  const toggle_deleMsg = id => {
    setDeleteMsg(!deleteMsg)
    dispatch(onDeleteMessage(id))
  }

  const [copyMsgAlert, setCopyMsgAlert] = useState(false)
  const copyMsg = ele => {
    var copyText = ele
      .closest(".conversation-list")
      .querySelector("p").innerHTML
    navigator.clipboard.writeText(copyText)
    setCopyMsgAlert(true)
    if (copyText) {
      setTimeout(() => {
        setCopyMsgAlert(false)
      }, 1000)
    }
  }

  // scroll simple bar
  const scrollRef = useRef(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.getScrollElement().scrollTop =
        scrollRef.current.getScrollElement().scrollHeight
    }
  }, [messagesData])

  // emoji
  const [emojiArray, setEmojiArray] = useState("")
  const onEmojiClick = (event, emojiObject) => {
    setEmojiArray([...emojiArray, emojiObject.emoji])
    setCurMessage(curMessage + event.emoji)
    setDisable(true)
  }

  //  img upload
  const handleImageChange = event => {
    event.preventDefault()
    let reader = new FileReader()
    let file = event.target.files[0]
    reader.onloadend = () => {
      setSelectedImage(reader.result)
      setDisable(true)
    }
    reader.readAsDataURL(file)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Office Chat")}
            breadcrumbItem={props.t("Chat")}
          />

          <Row>
            <Col lg="12">
              <div className="d-lg-flex">
                <div className="chat-leftsidebar me-lg-4">
                  <div>
                    <div className="py-4 border-bottom">
                      <div className="d-flex">
                        <div className="align-self-center me-3">
                          <img
                            src={avatar1}
                            className="avatar-xs rounded-circle"
                            alt=""
                          />
                        </div>
                        <div className="flex-grow-1">
                          <h5 className="font-size-15 mt-0 mb-1">
                            {currentUser?.first_name} {currentUser?.last_name}
                          </h5>
                          <p className="text-muted mb-0">
                            <i className="mdi mdi-circle text-success align-middle me-2" />
                            Active
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="search-box chat-search-box py-4">
                      <div className="position-relative">
                        <Input
                          onKeyUp={searchUsers}
                          id="search-user"
                          type="text"
                          className="form-control"
                          placeholder="Search..."
                        />
                        <i className="bx bx-search-alt search-icon" />
                      </div>
                    </div>

                    <div className="chat-leftsidebar-nav position-relative">
                      <Nav pills justified>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "2",
                            })}
                            onClick={() => {
                              toggleTab("2")
                            }}
                          >
                            <i className="bx bx-group font-size-20 d-sm-none" />
                            <span className="d-none d-sm-block">Groups</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={activeTab} className="py-4">
                        <TabPane tabId="2">
                          <h5 className="font-size-14 mb-3">
                            {props.t("Group")}
                          </h5>
                          <ul className="list-unstyled chat-list">
                            <SimpleBar style={{ height: "410px" }}>
                              <li className={"active"}>
                                <Link
                                  to="#"
                                  onClick={() => {
                                    userChatOpen()
                                  }}
                                >
                                  <div className="d-flex align-items-center">
                                    <div className="avatar-xs me-3">
                                      <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                        O
                                      </span>
                                    </div>

                                    <div className="flex-grow-1">
                                      <h5 className="font-size-14 mb-0">
                                        {props.t("Office Chat")}
                                      </h5>
                                    </div>
                                  </div>
                                </Link>
                              </li>
                            </SimpleBar>
                          </ul>
                        </TabPane>
                      </TabContent>
                    </div>
                  </div>
                </div>
                <div className="w-100 user-chat">
                  <Card>
                    <div className="p-4 border-bottom ">
                      <Row>
                        <Col md="4" xs="9">
                          <h5 className="font-size-15 mb-1">
                            {Chat_Box_Username}
                          </h5>

                          <p className="text-muted mb-0">
                            <i
                              className={
                                Chat_Box_User_Status === "online"
                                  ? "mdi mdi-circle text-success align-middle me-2"
                                  : Chat_Box_User_Status === "intermediate"
                                  ? "mdi mdi-circle text-warning align-middle me-1"
                                  : "mdi mdi-circle align-middle me-1"
                              }
                            />
                            {Chat_Box_User_Status === "online"
                              ? "Active now"
                              : "Offline"}
                          </p>
                        </Col>
                        <Col md="8" xs="3">
                          <ul className="list-inline user-chat-nav text-end mb-0">
                            <li className="list-inline-item d-none d-sm-inline-block">
                              <Dropdown
                                className="me-1"
                                isOpen={search_Menu}
                                toggle={toggleSearch}
                              >
                                <DropdownToggle className="btn nav-btn" tag="a">
                                  <i className="bx bx-search-alt-2" />
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-md">
                                  <Form className="p-3">
                                    <FormGroup className="m-0">
                                      <InputGroup>
                                        <Input
                                          type="text"
                                          className="form-control"
                                          id="searchMessage"
                                          placeholder="Search ..."
                                          aria-label="Recipient's username"
                                          onChange={handelSearch}
                                        />
                                        {/* <InputGroupAddon addonType="append"> */}
                                        <Button color="primary" type="submit">
                                          <i className="mdi mdi-magnify" />
                                        </Button>
                                        {/* </InputGroupAddon> */}
                                      </InputGroup>
                                    </FormGroup>
                                  </Form>
                                </DropdownMenu>
                              </Dropdown>
                            </li>
                            <li className="list-inline-item d-none d-sm-inline-block">
                              <Dropdown
                                isOpen={settings_Menu}
                                toggle={toggleSettings}
                                className="me-1"
                              >
                                <DropdownToggle className="btn nav-btn" tag="a">
                                  <i className="bx bx-cog" />
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem href="#">
                                    View Profile
                                  </DropdownItem>
                                  <DropdownItem href="#">
                                    Clear chat
                                  </DropdownItem>
                                  <DropdownItem href="#">Muted</DropdownItem>
                                  <DropdownItem href="#">Delete</DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </li>
                            <li className="list-inline-item">
                              <Dropdown
                                isOpen={other_Menu}
                                toggle={toggleOther}
                              >
                                <DropdownToggle className="btn nav-btn" tag="a">
                                  <i className="bx bx-dots-horizontal-rounded" />
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-end">
                                  <DropdownItem href="#">Action</DropdownItem>
                                  <DropdownItem href="#">
                                    Another Action
                                  </DropdownItem>
                                  <DropdownItem href="#">
                                    Something else
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </li>
                          </ul>
                        </Col>
                      </Row>
                    </div>

                    <div>
                      <div className="chat-conversation p-3">
                        <SimpleBar ref={scrollRef} style={{ height: "486px" }}>
                          {isLoading ? (
                            <Spinner />
                          ) : (
                            <ul
                              className="list-unstyled mb-0"
                              id="users-conversation"
                            >
                              {messagesData &&
                                (messagesData || []).map(message => {
                                  return (
                                    <li
                                      key={1}
                                      className={
                                        message.isCurrentUser ? "right" : ""
                                      }
                                    >
                                      <div className="conversation-list">
                                        <UncontrolledDropdown>
                                          <DropdownToggle
                                            href="#!"
                                            tag="a"
                                            className="dropdown-toggle"
                                          >
                                            <i className="bx bx-dots-vertical-rounded" />
                                          </DropdownToggle>
                                          <DropdownMenu>
                                            <DropdownItem
                                              onClick={e => copyMsg(e.target)}
                                              href="#"
                                            >
                                              Copy
                                            </DropdownItem>
                                            <DropdownItem href="#">
                                              Save
                                            </DropdownItem>
                                            <DropdownItem href="#">
                                              Forward
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={e =>
                                                toggle_deleMsg(message.id)
                                              }
                                              href="#"
                                            >
                                              Delete
                                            </DropdownItem>
                                          </DropdownMenu>
                                        </UncontrolledDropdown>
                                        <div className="ctext-wrap">
                                          <div className="conversation-name">
                                            {message.isCurrentUser
                                              ? "You"
                                              : message.sender.first_name}
                                          </div>
                                          <p>{message.message}</p>
                                          <p className="chat-time mb-0">
                                            <i className="bx bx-time-five align-middle me-1"></i>
                                            {
                                              convertTimestamp(message.sent_at)
                                                .date
                                            }{" "}
                                            {
                                              convertTimestamp(message.sent_at)
                                                .time
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    </li>
                                  )
                                })}
                            </ul>
                          )}
                        </SimpleBar>
                      </div>
                      {selectedImage && (
                        <div className="replymessage-block mb-0 d-flex align-items-start">
                          <div className="flex-grow-1">
                            <img
                              src={selectedImage}
                              alt="select img"
                              style={{ width: "150px", height: "auto" }}
                            />
                          </div>
                          <div className="flex-shrink-0">
                            <button
                              type="button"
                              id="close_toggle"
                              className="btn btn-sm btn-link mt-n2 me-n3 fs-18"
                              onClick={() => setSelectedImage(null)}
                            >
                              <i className="bx bx-x align-middle"></i>
                            </button>
                          </div>
                        </div>
                      )}

                      {copyMsgAlert && (
                        <UncontrolledAlert color="warning" role="alert">
                          {" "}
                          Message copied
                        </UncontrolledAlert>
                      )}
                      {emoji && (
                        <EmojiPicker
                          onEmojiClick={onEmojiClick}
                          width={250}
                          height={382}
                        />
                      )}

                      <div className="p-3 chat-input-section">
                        <Row>
                          <Col>
                            <div className="position-relative">
                              <input
                                type="text"
                                value={curMessage}
                                onKeyPress={onKeyPress}
                                onChange={e => {
                                  setCurMessage(e.target.value)
                                  setDisable(true)
                                }}
                                className="form-control chat-input"
                                placeholder={props.t("Enter Message...")}
                              />
                              <div className="chat-input-links">
                                <ul className="list-inline mb-0">
                                  <li
                                    className="list-inline-item"
                                    onClick={() => setEmoji(!emoji)}
                                  >
                                    <Link to="#">
                                      <i
                                        className="mdi mdi-emoticon-happy-outline me-1"
                                        id="Emojitooltip"
                                      />
                                      <UncontrolledTooltip
                                        placement="top"
                                        target="Emojitooltip"
                                      >
                                        Emojis
                                      </UncontrolledTooltip>
                                    </Link>
                                  </li>
                                  <li className="list-inline-item">
                                    <label
                                      htmlFor="imageInput"
                                      style={{ color: "#556ee6", fontSize: 16 }}
                                    >
                                      <i
                                        className="mdi mdi-file-image-outline me-1"
                                        id="Imagetooltip"
                                      />
                                      <UncontrolledTooltip
                                        placement="top"
                                        target="Imagetooltip"
                                      >
                                        Images
                                      </UncontrolledTooltip>
                                    </label>
                                    <input
                                      type="file"
                                      id="imageInput"
                                      className="d-none"
                                      onChange={handleImageChange}
                                    />
                                  </li>
                                  <li className="list-inline-item">
                                    <Link to="#">
                                      <i
                                        className="mdi mdi-file-document-outline"
                                        id="Filetooltip"
                                      />
                                      <UncontrolledTooltip
                                        placement="top"
                                        target="Filetooltip"
                                      >
                                        Add Files
                                      </UncontrolledTooltip>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </Col>
                          <Col className="col-auto">
                            <Button
                              type="button"
                              color="primary"
                              disabled={!isdisable}
                              onClick={() => addMessage()}
                              className="btn btn-primary btn-rounded chat-send w-md "
                            >
                              <span className="d-none d-sm-inline-block me-2">
                                {props.t("Send")}
                              </span>{" "}
                              <i className="mdi mdi-send" />
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

Chat.propTypes = {
  chats: PropTypes.array,
  groups: PropTypes.array,
  contacts: PropTypes.array,
  messages: PropTypes.array,
  onGetChats: PropTypes.func,
  onGetGroups: PropTypes.func,
  onGetContacts: PropTypes.func,
  onGetMessages: PropTypes.func,
  onAddMessage: PropTypes.func,
}

export default withTranslation()(Chat)
