const graphql = require("graphql");
const db = require("../pgAdaptor").db;
const { GraphQLObjectType, GraphQLID, GraphQLString } = graphql;
const { UserType, TaskType, EventsType } = require("./types");

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

    updateEvent: {
      type: EventsType,
      args: {
        id: { type: GraphQLID },
        user_id: { type: GraphQLID },
        title: { type: GraphQLString },
        start_timestamp: { type: GraphQLString },
        end_timestamp: { type: GraphQLString },
        event_class: { type: GraphQLString },
        shared_with: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `
          UPDATE events 
          SET user_id = $1, title = $2, start_timestamp = $3, end_timestamp = $4, event_class = $5, shared_with = $6
          WHERE id = $7
          RETURNING *`;
        const values = [
          args.user_id,
          args.title,
          args.start_timestamp,
          args.end_timestamp,
          args.event_class,
          args.shared_with,
          args.id,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    addEvent: {
      type: EventsType,
      args: {
        user_id: { type: GraphQLID },
        title: { type: GraphQLString },
        start_timestamp: { type: GraphQLString },
        event_class: { type: GraphQLString },
        shared_with: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        const query = `INSERT INTO events(user_id, title, start_timestamp, event_class, shared_with) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [
          args.user_id,
          args.title,
          args.start_timestamp,
          args.event_class,
          args.shared_with,
        ];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    deleteEvent: {
      type: EventsType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        const query = `DELETE FROM events WHERE id = $1 RETURNING *`;
        const values = [args.id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },

    deleteTask: {
      type: TaskType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parentValue, args) {
        const query = `DELETE FROM tasks WHERE task_id = $1 RETURNING *`;
        const values = [args.id];

        return db
          .one(query, values)
          .then((res) => res)
          .catch((err) => err);
      },
    },
  },
});

exports.mutation = RootMutation;
