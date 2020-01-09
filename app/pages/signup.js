import React, { Component } from "react";
import fetch from "isomorphic-unfetch";
import { signup } from "../utils/auth";

class Signup extends Component {
  static getInitialProps() {
    const apiUrl = "/api/signup";

    return { apiUrl };
  }

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: ""
    };
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeConfirmPassword = this.handleChangeConfirmPassword.bind(
      this
    );
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  handleChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleChangeConfirmPassword(event) {
    this.setState({ confirmPassword: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ error: "" });
    const username = this.state.username;
    const email = this.state.email;
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;
    const url = this.props.apiUrl;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email, confirmPassword })
      });
      if (response.ok) {
        const { token } = await response.json();
        signup({ token });
      } else {
        // https://github.com/developit/unfetch#caveats
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    } catch (error) {
      console.error(
        "You have an error in your code or there are Network issues.",
        error
      );
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <div>
        <div className="login">
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="username">Enter username</label>

            <input
              type="text"
              id="username"
              name="username"
              value={this.state.username}
              onChange={this.handleChangeUsername}
            />
            <label htmlFor="email">Enter email</label>

            <input
              type="text"
              id="email"
              name="email"
              value={this.state.email}
              onChange={this.handleChangeEmail}
            />
            <label htmlFor="username">Enter Password</label>
            <input
              type="text"
              id="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChangePassword}
            />
            <label htmlFor="username">Confirm Password</label>
            <input
              type="text"
              id="confirmPassword"
              name="confirmPassword"
              value={this.state.confirmPassword}
              onChange={this.handleChangeConfirmPassword}
            />

            <button type="submit">Signup</button>

            <p className={`error ${this.state.error && "show"}`}>
              {this.state.error && `Error: ${this.state.error}`}
            </p>
          </form>
        </div>
        <style jsx>{`
          .login {
            max-width: 340px;
            margin: 0 auto;
            padding: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          form {
            display: flex;
            flex-flow: column;
          }

          label {
            font-weight: 600;
          }

          input {
            padding: 8px;
            margin: 0.3rem 0 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
          }

          .error {
            margin: 0.5rem 0 0;
            display: none;
            color: brown;
          }

          .error.show {
            display: block;
          }
        `}</style>
      </div>
    );
  }
}

export default Signup;
