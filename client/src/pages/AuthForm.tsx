import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

const AuthForm = (): React.ReactElement => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    rememberMe: true,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const endpoint = mode === 'login' ? '/login' : '/signup';
      const url = `http://localhost:5000/api/auth${endpoint}`;

      const payload =
        mode === 'login'
          ? {
              email: formData.email,
              password: formData.password,
            }
          : {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              password: formData.password,
            };

      console.log('🟡 Submitting to:', url);
      console.log('📦 Payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log('✅ Server Response:', data);

      if (!response.ok) {
        console.error('❌ Server returned error status:', response.status);
        throw new Error(data.message || 'Something went wrong');
      }

      localStorage.setItem('token', data.token);
      console.log('🔐 Token saved to localStorage');
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('🔥 Submission failed:', error);
      alert(error.message);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
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
              {mode === 'login' && (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/9288/9288684.png"
                  alt="Cat"
                  width={80}
                  style={{ marginBottom: '12px' }}
                />
              )}
              <Typography variant="h5" fontWeight="bold">
                {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
              </Typography>
              <Typography variant="body2">
                {mode === 'login'
                  ? "Let's log back in and learn more Japanese!"
                  : 'Join us and start learning Japanese today!'}
              </Typography>
            </Box>

            <ToggleButtonGroup
              color="primary"
              value={mode}
              exclusive
              onChange={(_, newMode) => {
                if (newMode) {
                  setMode(newMode);
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    rememberMe: true,
                  });
                }
              }}
              fullWidth
              sx={{ mb: 2 }}
            >
              <ToggleButton value="login" sx={{ textTransform: 'none' }}>Login</ToggleButton>
              <ToggleButton value="signup" sx={{ textTransform: 'none' }}>Sign Up</ToggleButton>
            </ToggleButtonGroup>

            <form onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <>
                  <TextField
                    label="First Name"
                    name="firstName"
                    fullWidth
                    margin="normal"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    fullWidth
                    margin="normal"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </>
              )}

              <TextField
                label={mode === 'login' ? 'Email or Username' : 'Email'}
                name="email"
                type="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {mode === 'login' && (
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2, borderRadius: 2 }}
              >
                {mode === 'login' ? 'Login' : 'Sign Up'}
              </Button>
              {mode === 'login' && (
                <Box mt={2} textAlign="center">
                  <Button variant="text" size="small">
                    Forgot password?
                  </Button>
                </Box>
              )}
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthForm;
