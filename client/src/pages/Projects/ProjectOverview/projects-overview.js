import React, { useEffect } from "react"
import PropTypes from "prop-types"
import withRouter from "components/Common/withRouter"
import { isEmpty } from "lodash"
import { Col, Container, Row } from "reactstrap"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

import { getProjectDetail as onGetProjectDetail } from "store/projects/actions"
import ProjectDetail from "./projectDetail"
import TeamMembers from "./teamMembers"
import OverviewChart from "./overviewChart"
import { options, series } from "common/data/projects"
import AttachedFiles from "./attachedFiles"
import Comments from "./comments"
import { useLocation } from "react-router-dom"
//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import ActivityComp from "./ActivityComp"

const ProjectsOverview = props => {
  //meta title
  document.title = "Project Overview | CPALINK"

  const location = useLocation()
  const { userData } = location.state || {}

  console.log("userData is ", userData)

  const dispatch = useDispatch()

  const ProjectsDetailProperties = createSelector(
    state => state.projects,
    Projects => ({
      projectDetail: Projects.projectDetail,
    })
  )
  const params = props.router.params
  const { projectDetail } = useSelector(ProjectsDetailProperties)

  useEffect(() => {
    if (params && params.id) {
      dispatch(onGetProjectDetail(params.id))
    } else {
      dispatch(onGetProjectDetail(1)) //remove this after full integration
    }
  }, [onGetProjectDetail])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Projects" breadcrumbItem="Project Overview" />

          {!isEmpty(projectDetail) && (
            <>
              <Row>
                <Col lg="8">
                  <ProjectDetail
                    project={projectDetail}
                    projectDetails={userData}
                  />
                </Col>

                <Col lg="4">
                  <ActivityComp case_id={userData.case_id} />
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  )
}

ProjectsOverview.propTypes = {
  match: PropTypes.object,
}

export default withRouter(ProjectsOverview)
