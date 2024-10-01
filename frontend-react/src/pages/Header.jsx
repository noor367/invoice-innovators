import {Typography, AppBar, Toolbar, Button, Box, Stack} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  }
  return (
    <>
      <AppBar position="static" sx={{backgroundColor: "black"}} maxWidth="none">
        <Toolbar maxWidth="none" disableGutters>
          <Box
            component="img"
            sx={{
              height: 64,
              padding: 2
            }}
            alt="Your logo."
            src="/logo.svg"
          />
          <Stack direction="row" sx={{justifyContent: 'space-between', flexGrow: 1}}>
            <Typography variant="h3">
              Invoice Innovators
            </Typography>
            <Stack spacing={2} direction="row" pr={2}>
              <Button component={Link} to="/about" variant="contained" color="primary">About Us</Button>
              <Button component={Link} to="/dashboard" variant="contained" color="primary">Dashboard</Button>
              <Button component={Link} to="/profile" variant="contained" color="primary">Profile</Button>
              <Button variant="contained" color="primary" onClick={handleLogout}>Logout</Button>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  )
};

export default NavBar;
