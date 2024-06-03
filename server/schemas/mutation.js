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
  },
});

module.exports = { RootMutation };
