const graphql = require("graphql");
const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema } = graphql;
const { query } = require("./schemas/query");
const { mutation } = require("./schemas/mutation");

const schema = new GraphQLSchema({
  query,
  mutation,
});

const app = express();
app.use(
  "/",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(3000, () => console.log("GraphQL server running on localhost:3000"));
