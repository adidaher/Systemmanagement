const graphql = require("graphql");

const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLList } =
  graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  type: "Query",
  fields: {
    user_id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    phone: { type: GraphQLString },
    role: { type: GraphQLString },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    manager_id: { type: GraphQLID },
    office_id: { type: GraphQLID },
  },
});

const TaskType = new GraphQLObjectType({
  name: "Task",
  type: "Query",
  fields: {
    task_id: { type: GraphQLID },
    task_name: { type: GraphQLString },
    task_partners: {
      type: new GraphQLList(GraphQLString),
      resolve: (parent) => parent.task_partners.split(","),
    },
    task_status: { type: GraphQLString },
    task_deadline: { type: GraphQLString },
    task_description: { type: GraphQLString },
  },
});

const EventsType = new GraphQLObjectType({
  name: "Event",
  type: "Query",
  fields: {
    id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    title: { type: GraphQLString },
    start_timestamp: { type: GraphQLString },
    end_timestamp: { type: GraphQLString },
    event_class: { type: GraphQLString },
    shared_with: { type: GraphQLString },
  },
});

const OfficeType = new GraphQLObjectType({
  name: "office",
  type: "Query",
  fields: {
    id: { type: GraphQLID },
    office_id: { type: GraphQLID },
    name: { type: GraphQLString },
    manager: { type: GraphQLString },
    location: { type: GraphQLString },
    phone: { type: GraphQLString },
  },
});

const CustomersType = new GraphQLObjectType({
  name: "customers",
  type: "Query",
  fields: {
    customer_id: { type: GraphQLID },
    office_id: { type: GraphQLID },
    last_name: { type: GraphQLString },
    first_name: { type: GraphQLString },
    email: { type: GraphQLString },
    gov_id: { type: GraphQLString },
  },
});
exports.UserType = UserType;
exports.TaskType = TaskType;
exports.EventsType = EventsType;
exports.OfficeType = OfficeType;
exports.CustomersType = CustomersType;
