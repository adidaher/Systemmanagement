const graphql = require("graphql");
const db = require("../pgAdaptor").db;
const { GraphQLObjectType, GraphQLID, GraphQLString } = graphql;
const { UserType } = require("./types");

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
        id: { type: GraphQLID },
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
          WHERE id = $6
          RETURNING *`;
        const values = [
          args.username,
          args.email,
          args.password,
          args.phone,
          args.role,
          args.id,
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
