import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { BrowserRouter } from "react-router-dom"
import "./i18n"
import { Provider } from "react-redux"

import store from "./store"
import { ApolloClient, InMemoryCache } from "@apollo/client"
import { ApolloProvider } from "@apollo/client"
//https://systemmanagement.onrender.com/graphql
//http://localhost:4000/graphql
//https://systemmanagement-two.vercel.app
//https://systemmanagement-two.vercel.app/graphql
const client = new ApolloClient({
  uri: "https://systemmanagement-two.vercel.app/graphql",
  cache: new InMemoryCache(),
})

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </Provider>
)

serviceWorker.unregister()
