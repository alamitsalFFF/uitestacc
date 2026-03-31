import React, { useState, useRef } from "react";
import {
  Dialog, DialogTitle, DialogContent, TextField, Button, Box, InputAdornment, IconButton, Alert, CircularProgress
} from "@mui/material";
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from "@mui/icons-material";
import { API_BASE } from "../api/url";

export default function LoginModal({ open, onSuccess }) {
  const [username, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef(null);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_LOGIN_URL = `${API_BASE}/Auth/login`;

      const response = await fetch(API_LOGIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        console.log(response);
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed. Please check your credentials.');
      }

      const data = await response.json();

      if (data && data.token) {
        // ส่ง token กลับไปที่ AuthContext
        onSuccess(data.token);
      } else {
        throw new Error('Login successful but no token received from server.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (passwordRef.current) passwordRef.current.focus();
    }
  };

  const handlePasswordKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleLoginSubmit(event);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle style={{ textAlign: 'center' }}>Login</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleLoginSubmit} sx={{ width: 300, mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="UserID"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUserID(e.target.value)}
            variant="standard"
            onKeyDown={handleUsernameKeyDown}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="standard"
            inputRef={passwordRef}
            onKeyDown={handlePasswordKeyDown}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 4, mb: 2, borderRadius: '16px', fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'SIGN IN'}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}