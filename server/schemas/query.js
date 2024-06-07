const { db } = require("../pgAdaptor");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
} = require("graphql");
const { UserType, TaskType } = require("./types");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parentValue, args) {
        const query = `SELECT * FROM users WHERE user_id = $1`;
        const values = [args.id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    allUsers: {
      type: new GraphQLList(UserType),
      resolve() {
        const query = `SELECT * FROM users`;

        return db
          .any(query)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    getUserByUsername: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
      },
      resolve(parent, args) {
        const query = `SELECT * FROM users WHERE username = $1`;
        const values = [args.username];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    GetUserByEmail: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
      },

      resolve(parent, args) {
        const { email } = args;
        const query = `SELECT * FROM users WHERE email = $1`;
        const values = [email];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => {
            console.error("Error in GetUserByEmail resolver:", err);
          });
      },
    },

    getTasksByStatus: {
      type: new GraphQLList(TaskType),
      args: {
        status: { type: GraphQLString },
      },
      resolve(parent, args) {
        const { status } = args;
        const query = `SELECT * FROM tasks WHERE task_status = $1`;
        const values = [status];

        return db
          .manyOrNone(query, values)
          .then((res) => res)
          .catch((err) => {
            console.error("Error in GetUserByEmail resolver:", err);
          });
      },
    },

    getAllTasks: {
      type: new GraphQLList(TaskType),
      resolve() {
        const query = `SELECT * FROM tasks`;
        return db
          .manyOrNone(query)
          .then((res) => res)
          .catch((err) => {
            console.error("Error in getAllTasks resolver:", err);
          });
      },
    },
  },
});

exports.query = RootQuery;
