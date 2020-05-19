import React, { Component } from 'react';
import axios from 'axios';
import {
  Input,
  FormControl,
  InputLabel,
  Avatar,
  Button,
  Link,
} from '@material-ui/core';

import Alert from '@material-ui/lab/Alert';


export default class Register extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      password2: '',
      error: '',
    };
  }

  onSubmit = (e) => {
    e.preventDefault();

    const { username, password, password2, email } = this.state;

    axios({
      url: 'http://localhost:3001/auth/register',
      method: 'POST',
      data: {
        username: username,
        password: password,
        password2: password2
      },
    }).then((res) => {
      const { msg } = res.data;
      if (msg === 'User Created') {
        sessionStorage.setItem('message', 'Successfully Logged In!');
        sessionStorage.setItem('token', res.data.token);
        return (window.location = '/citizen');
      }

      this.setState({
        error: msg,
      });

      console.log(res.data);
    });
  };

  handleUsername = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  handlePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  handlePassword2 = (e) => {
    this.setState({
      password2: e.target.value,
    });
  };


  render() {
    const { username, password, password2, email, error } = this.state;
    return (
      <form className='login-box' onSubmit={this.onSubmit}>
        {/* avatar */}
        <div>
          <Avatar style={{ transform: 'scale(1)' }} />
        </div>
        <h1>Create an account</h1>

        {error ? (
          <Alert className="alert-box" variant='filled' severity='warning'>
            {error}
          </Alert>
        ) : null}

        {/* Username */}
        <FormControl fullWidth style={{ marginTop: '40px' }}>
          <InputLabel htmlFor='username'>Please Enter your username</InputLabel>
          <Input
            type='text'
            id='username'
            value={username}
            onChange={this.handleUsername}
          />
        </FormControl>

        {/* Password */}
        <FormControl fullWidth style={{ marginTop: '20px' }}>
          <InputLabel htmlFor='password'>Please Enter your password</InputLabel>
          <Input
            type='password'
            id='password'
            value={password}
            onChange={this.handlePassword}
          />
        </FormControl>

        {/* Password */}
        <FormControl fullWidth style={{ marginTop: '20px' }}>
          <InputLabel htmlFor='password2'>
            Please Confirm your password
          </InputLabel>
          <Input
            type='password'
            id='password2'
            value={password2}
            onChange={this.handlePassword2}
          />
           <div style={{ marginTop: '5px' }}>
            Already have an account?{' '}
            <Link href='/auth/login' color='primary'>
              Login Here
            </Link>
          </div>
        </FormControl>

        <FormControl fullWidth style={{ marginTop: '20px' }}>
          <Button type='submit' variant='contained' color='primary'>
            Register
          </Button>
        </FormControl>
      </form>
    );
  }
}