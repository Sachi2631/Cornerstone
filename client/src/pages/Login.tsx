import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Container
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = (): React.ReactElement => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(true);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      {/* <Header /> */}

      <Box
        component="main"
        flexGrow={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={3}
      >
        <Container maxWidth="xs">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box textAlign="center" mb={3}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/9288/9288684.png"
                alt="Cat"
                width={80}
                style={{ marginBottom: '12px' }}
              />
              <Typography variant="h5" fontWeight="bold">
                Welcome Back!
              </Typography>
              <Typography variant="body2">
                Let's log back in and learn more Japanese!
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email or Username"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2, borderRadius: 2 }}
              >
                Login
              </Button>
              <Box mt={2} textAlign="center">
                <Button variant="text" size="small">
                  Forgot password?
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Login;