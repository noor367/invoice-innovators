import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {requestAuth} from '../utils/helpers';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';
import AuthNavBar from './AuthHeader';
import ErrorModal from "../utils/Error";

function RegisterPage () {
  const navigate = useNavigate();

  // eslint-disable-next-line
  useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      navigate('/dashboard');
    }
    // eslint-disable-next-line
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameFirst, setNameFirst] = useState('');
  const [nameLast, setNameLast] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
      try {
        const response = await requestAuth('/register', {
          email: email,
          password: password,
          nameFirst: nameFirst,
          nameLast: nameLast
        });
        handleResponse(response);
      } catch (e) {
        setError(e.message);
      }
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
      <Container
        component="main"
        maxWidth="sm"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        {error && <ErrorModal message={error} onClose={closeError} />}
        <Grid justifyContent="center" pt={5}>
          <Grid item xs={12}>
            <Typography
              component="h1"
              variant="h5"
              align="center"
              pb={3}
              style={{ marginTop: '10px' }}
            >
              Signup
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={handleRegister}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    required
                    variant="outlined"
                    fullWidth
                    label="First Name"
                    type="text"
                    value={nameFirst}
                    onChange={(e) => setNameFirst(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    variant="outlined"
                    fullWidth
                    label="Last Name"
                    type="text"
                    value={nameLast}
                    onChange={(e) => setNameLast(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    variant="outlined"
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    variant="outlined"
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    variant="outlined"
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
              >
                Sign Up
              </Button>
            </form>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <Typography>
              <Link to="/login" variant="body1">
                Already have an account? Click here to Log In!
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}

export default RegisterPage;
