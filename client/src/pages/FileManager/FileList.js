import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  Row,
  UncontrolledDropdown,
} from "reactstrap"

import { myfiles } from "../../common/data"
import axios from "axios"
const FileList = () => {
  const [Files, setFiles] = useState([])
  const [content, setContent] = useState("")

  useEffect(() => {
    axios
      .get("http://localhost:4000/files")
      .then(response => {
        console.log(response.data)
        setFiles(response.data)
      })
      .catch(error => {
        console.error("Error fetching files:", error)
      })
  }, [])
  /*
  useEffect(() => {
    handleDirectorySelection()
  }, [])
  const handleDirectorySelection = async () => {
    try {
      console.log("getting files...")
      // Prompt user to select a directory
      const directoryHandle = await window.showDirectoryPicker()

      // Read the files in the directory
      const filesArray = []
      for await (const entry of directoryHandle.values()) {
        if (entry.kind === "file") {
          filesArray.push(entry.name)
        }
      }
      console.log("files is ..", filesArray)
      setFiles(filesArray)
    } catch (err) {
      console.error("Error accessing directory:", err)
    }
  }*/

  const filetype = fileType => {
    if (fileType == "file" || fileType == "directory")
      return <i className="bx bxs-folder font-size-24 text-warning"></i>

    if (fileType == "pdf")
      return <i className="bx bxs-file-pdf font-size-24 text-danger"></i>
    if (fileType == "txt")
      return <i className="bx bxs-file-txt font-size-24 text-black"></i>
  }

  const openFileInExplorer = filePath => {
    axios
      .get(
        `https://systemmanagement.onrender.com/openFile?filePath=${encodeURIComponent(
          filePath
        )}`
      )
      .then(response => {
        console.log("File explorer opened successfully")
      })
      .catch(error => {
        console.error("Error opening file explorer:", error)
      })
  }

  return (
    <React.Fragment>
      <div>
        <Row className="mb-3">
          <Col xl={3} sm={6}>
            <div className="mt-2">
              <h5>My Files</h5>
            </div>
          </Col>
          <Col xl={9} sm={6}>
            <Form className="mt-4 mt-sm-0 float-sm-end d-flex align-items-center">
              <div className="search-box mb-2 me-2">
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control bg-light border-light rounded"
                    placeholder="Search..."
                  />
                  <i className="bx bx-search-alt search-icon"></i>
                </div>
              </div>

              <UncontrolledDropdown className="mb-0">
                <DropdownToggle
                  className="btn btn-link text-muted mt-n2"
                  tag="a"
                >
                  <i className="mdi mdi-dots-vertical font-size-20"></i>
                </DropdownToggle>

                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem href="#">Share Files</DropdownItem>
                  <DropdownItem href="#">Share with me</DropdownItem>
                  <DropdownItem href="#">Other Actions</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Form>
          </Col>
        </Row>
      </div>
      <div>
        <Row>
          {(Files || [])?.map((myfiles, key) => (
            <Col xl={4} sm={6} key={key}>
              <Card className="shadow-none border">
                <CardBody className="p-3">
                  <div>
                    <div className="float-end ms-2">
                      <UncontrolledDropdown className="mb-2">
                        <DropdownToggle
                          className="font-size-16 text-muted"
                          tag="a"
                        >
                          <i className="mdi mdi-dots-horizontal"></i>
                        </DropdownToggle>

                        <DropdownMenu className="dropdown-menu-end">
                          <DropdownItem href="#">Open</DropdownItem>
                          <DropdownItem href="#">Edit</DropdownItem>
                          <DropdownItem href="#">Rename</DropdownItem>
                          <div className="dropdown-divider"></div>
                          <DropdownItem href="#">Remove</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <div className="avatar-xs me-3 mb-3">
                      <div className="avatar-title bg-transparent rounded">
                        {filetype(myfiles.fileType)}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="overflow-hidden me-auto">
                        <h5 className="font-size-14 text-truncate mb-1">
                          <Link
                            to="#"
                            className="text-body"
                            onClick={() => openFileInExplorer(myfiles.path)}
                          >
                            {myfiles.name}
                          </Link>
                        </h5>
                      </div>
                      <div className="align-self-end ms-2">
                        {myfiles.size > 0 && (
                          <p className="text-muted mb-0">{myfiles.size}kB</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </React.Fragment>
  )
}

export default FileList
