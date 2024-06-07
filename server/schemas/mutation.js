const graphql = require("graphql");
const db = require("../pgAdaptor").db;
const { GraphQLObjectType, GraphQLID, GraphQLString } = graphql;
const { UserType, TaskType } = require("./types");

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    addUser: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        phone: { type: GraphQLString },
        role: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO users(username, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [
          args.username,
          args.email,
          args.password,
          args.phone,
          args.role,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
    updateUser: {
      type: UserType,
      args: {
        user_id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        phone: { type: GraphQLString },
        role: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `
          UPDATE users
          SET username = $1, email = $2, password = $3, phone = $4, role = $5
          WHERE user_id = $6
          RETURNING *`;
        const values = [
          args.username,
          args.email,
          args.password,
          args.phone,
          args.role,
          args.user_id,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    addTask: {
      type: TaskType,
      args: {
        task_name: { type: GraphQLString },
        task_partners: { type: GraphQLString },
        task_status: { type: GraphQLString },
        task_deadline: { type: GraphQLString },
        task_description: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO tasks(task_name, task_partners, task_status, task_deadline, task_description) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [
          args.task_name,
          args.task_partners,
          args.task_status,
          args.task_deadline,
          args.task_description,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
  },
});

exports.mutation = RootMutation;
