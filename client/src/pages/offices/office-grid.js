import React, { useEffect, useMemo, useState } from "react"
import { Container, Row } from "reactstrap"

import withRouter from "components/Common/withRouter"

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb"

//Import Cards
import CardProject from "../Projects/card-project"

import { getProjects as onGetProjects } from "store/actions"

//redux
import { useSelector, useDispatch } from "react-redux"
import { createSelector } from "reselect"
import Spinners from "components/Common/Spinner"
import Paginations from "components/Common/Pagination"

import { withTranslation } from "react-i18next"
import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client"

const GET_OFFICES = gql`
  query {
    allOffice {
      office_id
      name
      manager
      location
      phone
    }
  }
`

const OfficesGrid = props => {
  //meta title
  document.title = "Office Grid |  CPALINK "

  const dispatch = useDispatch()

  const [offices, setOffices] = useState([])
  const [officesList, setOfficesList] = useState([])
  /*
  const ProjectsProjectProperties = createSelector(
    state => state.projects,
    Projects => ({
      projects: Projects.projects,
      loading: Projects.loading,
    })
  )
*/
  //  const { loading, projects } = useSelector(ProjectsProjectProperties)

  // const [projectsList, setProjectsList] = useState()

  const { data, loading: queryLoading } = useQuery(
    GET_OFFICES,

    {
      onCompleted: data => {
        if (data) {
          console.log(data)
          setOffices(data.allOffice)
        }
      },
    }
  )

  //const [isLoading, setLoading] = useState(queryLoading)
  /*
  useEffect(() => {
    dispatch(onGetProjects())
  }, [dispatch])*/

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const perPageData = 6
  const indexOfLast = currentPage * perPageData
  const indexOfFirst = indexOfLast - perPageData
  const currentdata = useMemo(
    () => offices?.slice(indexOfFirst, indexOfLast),
    [offices, indexOfFirst, indexOfLast]
  )

  useEffect(() => {
    setOfficesList(currentdata)
  }, [currentdata])

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs
            title={props.t("Office")}
            breadcrumbItem={props.t("Office Grid")}
          />

          <Row>
            {/* Import Cards */}
            {queryLoading ? (
              <Spinners setLoading={queryLoading} />
            ) : (
              <>
                <CardProject offices={officesList} />
                <Row>
                  <Paginations
                    perPageData={perPageData}
                    data={offices}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isShowingPageLength={false}
                    paginationDiv="col-12"
                    paginationClass="pagination pagination-rounded justify-content-center mt-2 mb-5"
                  />
                </Row>
              </>
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default withRouter(withTranslation()(OfficesGrid))
