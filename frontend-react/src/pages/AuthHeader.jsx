import {Typography, AppBar, Toolbar, Button, Stack, Box} from "@mui/material";
import {Link} from "react-router-dom";
import logo from '../logo.svg';

const AuthNavBar = () => {
  return (
    <>
      <AppBar position="static" sx={{backgroundColor: "black"}}>
        <Toolbar>
          <Box
            component="img"
            sx={{
              height: 64,
              padding: 2
            }}
            alt="II Logo"
            src={logo}
          />
          <Stack direction="row" sx={{justifyContent: 'space-between', flexGrow: 1}}>
            <Typography variant="h3">
              Invoice Innovators
            </Typography>
            <Stack spacing={2} direction="row" justifyContent="flex-end" pr={1}>
              <Button component={Link} to="/about" variant="contained" color="primary">About Us</Button>
              <Button component={Link} to="/login" variant="contained" color="primary">Login</Button>
              <Button component={Link} to="/signup" variant="contained" color="primary">Signup</Button>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  )
};

export default AuthNavBar;
