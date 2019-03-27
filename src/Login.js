// Login
import React from "react";

const Login = props => (
  <div className="login">
    <p>Please click button below to sign in!</p>
    <button className="github">Log In With Gitub</button>
    <button className="facebook">Log In With Facebook</button>
  </div>
);

export default Login;

// UserInfo
import React, { Component } from "react";
import Login from "./Login";

class UserInfo extends Component {
  render() {
    return <Login />;
    return (
      <div className="user-info">
        <label>Email:</label>
        <span type="text" id="email">
          test@test.com
        </span>
      </div>
    );
  }
}

export default UserInfo;