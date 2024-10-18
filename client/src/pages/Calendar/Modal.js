import React from "react"
import { withTranslation } from "react-i18next"

const Modal = ({
  props,
  modalCategory,
  toggle,
  isEdit,
  categoryValidation,
  setDeleteModal,
}) => {
  return (
    <Modal isOpen={modalCategory} className={props.className} centered>
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
                  <option value="bg-danger">{props.t("Danger")}</option>
                  <option value="bg-success">{props.t("Success")}</option>
                  <option value="bg-primary">{props.t("Primary")}</option>
                  <option value="bg-info">{props.t("Info")}</option>
                  <option value="bg-dark">{props.t("Dark")}</option>
                  <option value="bg-warning">{props.t("Warning")}</option>
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
                  value={categoryValidation.values.shared_with || ""}
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
              <Button type="submit" color="success" id="btn-save-event">
                {props.t("Save")}
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default withTranslation()(Modal)
