import React from "react";
import { Route, Switch } from "react-router-dom";

import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import Card from "./containers/Card";
import NotFound from "./containers/NotFound";
import Product from "./containers/Product";
import Orders from "./containers/Orders";

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <AuthenticatedRoute exact path="/card">
        <Card />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/orders">
        <Orders />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/product/:id">
        <Product />
      </AuthenticatedRoute>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      {/* Finally, catch all unmatched routes */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
