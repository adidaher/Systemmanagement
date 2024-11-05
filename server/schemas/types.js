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

const CaseType = new GraphQLObjectType({
  name: "Case",
  type: "Query",
  fields: {
    id: { type: GraphQLID },
    office_id: { type: GraphQLID },
    case_description: { type: GraphQLString },
  },
});
const SubTaskType = new GraphQLObjectType({
  name: "SubTask",
  fields: {
    subtask_id: { type: GraphQLID },
    subtask_name: { type: GraphQLString },
    subtask_status: { type: GraphQLString },
    subtask_description: { type: GraphQLString },
    subtask_deadline: { type: GraphQLString },
    task_id: { type: GraphQLID }, // Reference to the parent task
  },
});
const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    task_id: { type: GraphQLID },
    task_name: { type: GraphQLString },
    task_partners: {
      type: new GraphQLList(GraphQLString),
      resolve: (parent) => parent.task_partners.split(","),
    },
    task_status: { type: GraphQLString },
    task_deadline: { type: GraphQLString },
    task_description: { type: GraphQLString },
    case: { type: CaseType },
    subtasks: { type: new GraphQLList(SubTaskType) },
  }),
});

/*
const CaseOfCustomersType = new GraphQLObjectType({
  name: "CaseOfCustomers",
  description: "Represents a case associated with a customer and an office.",
  fields: () => ({
    case_id: { type: GraphQLID },
    customer_id: { type: GraphQLID },
    office_id: { type: GraphQLID },
  }),
});*/

const CaseOfCustomersType = new GraphQLObjectType({
  name: "CaseOfCustomers",
  description: "Represents a case associated with a customer and an office.",
  fields: {
    case_id: { type: GraphQLID },
    customer: { type: CustomersType },
    office: { type: OfficeType },
    case_details: { type: CaseType },
  },
});

const CaseDetailsType = new GraphQLObjectType({
  name: "CaseDetails",
  description: "Represents a case associated with a customer and an office.",
  fields: () => ({
    case_id: { type: GraphQLID },
    customer_id: { type: GraphQLID },
    office_id: { type: GraphQLID },
    first_name: { type: GraphQLString },
    email: { type: GraphQLString },
    office_name: { type: GraphQLString },
    case_description: { type: GraphQLString },
  }),
});

const ChatType = new GraphQLObjectType({
  name: "Chat",
  fields: () => ({
    id: { type: GraphQLID },
    message: { type: GraphQLString },
    sent_at: { type: GraphQLString },
    sender: { type: UserType },
    office: { type: OfficeType },
  }),
});
exports.UserType = UserType;
exports.TaskType = TaskType;
exports.EventsType = EventsType;
exports.OfficeType = OfficeType;
exports.CustomersType = CustomersType;
exports.CaseType = CaseType;
exports.CaseOfCustomersType = CaseOfCustomersType;
exports.CaseDetailsType = CaseDetailsType;
exports.ChatType = ChatType;
exports.SubTaskType = SubTaskType;
