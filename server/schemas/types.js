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

exports.UserType = UserType;
exports.TaskType = TaskType;
