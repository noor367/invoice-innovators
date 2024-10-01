// LoginPage component
import React, { useState, useEffect } from 'react';
import ErrorModal from "../utils/Error";
import {Button, Typography, Container, Grid, TextField} from '@mui/material';
import { requestAuth } from "../utils/helpers";
import { Link, useNavigate } from "react-router-dom";
import AuthNavBar from "./AuthHeader";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // eslint-disable-next-line
  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      navigate('/dashboard');
    }
    // eslint-disable-next-line
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await requestAuth('/login', {email: email, password: password});
      handleResponse(response);
    } catch (e) {
      setError(e.message); // Display error message to the user
    }
  };

  const handleResponse = (response) => {
    if (response.error) {
      setError(response.error);
    } else {
      localStorage.setItem('token', response.token);
      localStorage.setItem('id', response.uId);
      navigate('/dashboard');
    }
  }

  const closeError = () => {
    setError('');
  };

  return (
    <Container maxWidth="none" disableGutters>
      <AuthNavBar/>
      <Container component="main" maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {error && <ErrorModal message={error} onClose={closeError} />}
        <Grid justifyContent="center" pt={5}>
          <Grid item xs={12}>
            <Typography component="h2" variant="h5" align="center" style={{ marginTop: '10px' }}>
              Log In
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={handleLogin}>
              <TextField
                required
                variant="outlined"
                margin="normal"
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                required
                variant="outlined"
                margin="normal"
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
              >
                Log in
              </Button>
            </form>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <Typography variant="body1">
              <Link to="/signup" variant="body1">
                Not a member? Click Here to Sign Up!
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}

export default LoginPage;
