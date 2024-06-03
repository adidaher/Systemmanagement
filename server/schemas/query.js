const { db } = require("../pgAdaptor");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLList,
  GraphQLString,
} = require("graphql");
const { UserType } = require("./types");

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
  },
});

exports.query = RootQuery;
