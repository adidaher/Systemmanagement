import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client"

export const GET_USER_EVENTS = gql`
  query GetUserEvents($userEmail: String!) {
    userEvents(userEmail: $userEmail) {
      id
      user_id
      title
      start_timestamp
      end_timestamp
      event_class
      shared_with
    }
  }
`

export const INSERT_EVENT = gql`
  mutation InsertEvent(
    $user_id: ID!
    $title: String!
    $start_timestamp: String
    $event_class: String
    $shared_with: String
  ) {
    addEvent(
      user_id: $user_id
      title: $title
      start_timestamp: $start_timestamp
      event_class: $event_class
      shared_with: $shared_with
    ) {
      id
      user_id
      title
      start_timestamp
      end_timestamp
      event_class
      shared_with
    }
  }
`
export const UPDATE_EVENT = gql`
  mutation UpdateEvent(
    $id: ID!
    $user_id: ID!
    $title: String
    $start_timestamp: String
    $end_timestamp: String
    $event_class: String
    $shared_with: String
  ) {
    updateEvent(
      id: $id
      user_id: $user_id
      title: $title
      start_timestamp: $start_timestamp
      end_timestamp: $end_timestamp
      event_class: $event_class
      shared_with: $shared_with
    ) {
      id
      user_id
      title
      start_timestamp
      end_timestamp
      event_class
      shared_with
    }
  }
`
export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
      user_id
      title
      start_timestamp
      end_timestamp
      event_class
      shared_with
    }
  }
`
