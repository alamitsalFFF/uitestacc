import React, { useState, useRef } from 'react'; // Import useRef
import {
    TextField,
    Button,
    Box,
    Typography,
    Paper,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { API_BASE, URL } from '../api/url';
import tawan from '../../components/img/tawan.jpg';
import tawanlogo1 from '../../components/img/tawanlogo1.png';

function LoginForm() {
    const [username, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // สร้าง ref สำหรับ TextField ของ Password
    const passwordRef = useRef(null);

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const API_LOGIN_URL = `${API_BASE}/Auth/login`;

            const response = await fetch(API_LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                let errorMessage = 'Login failed. Please check your credentials.';
                try {
                    // ลองอ่านเป็น text ก่อนเพื่อความปลอดภัย
                    const errorText = await response.text();
                    try {
                        // ลองแปลงเป็น json
                        const errorData = JSON.parse(errorText);
                        errorMessage = errorData.message || errorMessage;
                    } catch (e) {
                        // ถ้าขี้เกียจ parse หรือไม่ใช่ json ให้ใช้ text โดยตรง
                        errorMessage = errorText || errorMessage;
                    }
                } catch (readErr) {
                    console.error('Error reading error response:', readErr);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            if (data && data.token) {
                Swal.fire({
                    icon: 'success',
                    title: 'เข้าสู่ระบบสำเร็จ',
                    text: `ยินดีต้อนรับคุณ ${username}`,
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });

                localStorage.setItem('userToken', data.token);
                localStorage.setItem("userName", username);
                localStorage.setItem("src", data.src);

                setTimeout(() => {
                    window.location.href = `${URL}`;
                }, 2000);

                console.log('Login successful, token:', data.token);
            } else {
                throw new Error('เข้าสู่ระบบสำเร็จแต่ไม่ได้รับ Token จากระบบ');
            }

        } catch (err) {
            // setError(err.message || 'An error occurred during login. Please try again.');
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: err.message || 'กรุณาตรวจสอบ UserID และ Password อีกครั้ง',
                confirmButtonColor: '#f70300',
            });
            console.error('Login Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // ฟังก์ชันที่จะถูกเรียกเมื่อมีการกดปุ่มบนช่อง UserID
    const handleUsernameKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // ป้องกันการ submit form โดยอัตโนมัติเมื่อกด Enter
            if (passwordRef.current) {
                passwordRef.current.focus(); // โฟกัสไปที่ช่อง Password
            }
        }
    };

    // ฟังก์ชันที่จะถูกเรียกเมื่อมีการกดปุ่มบนช่อง Password
    const handlePasswordKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // ป้องกันการ submit form โดยอัตโนมัติเมื่อกด Enter
            handleLoginSubmit(event); // เรียกฟังก์ชัน submit form
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(to right bottom,hsla(0, 0%, 100%, 1.00),rgba(255, 255, 255, 1))',
                position: 'relative',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {/* Circles */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -150,
                    left: -150,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    bgcolor: 'white',
                    opacity: 0.5,
                    filter: 'blur(50px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: -150,
                    right: -150,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    bgcolor: 'white',
                    opacity: 0.5,
                    filter: 'blur(50px)',
                }}
            />
            <Box sx={{ color: '#00008b', zIndex: 1, width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'center' }}>
                    <img
                        src={tawan}
                        alt="Logo"
                        style={{ height: 100, marginRight: 20 }}
                    />
                </Box>

                {/* Main Content Card (Login Form) */}
                <Paper
                    elevation={3}
                    sx={{
                        width: '90%',
                        maxWidth: '400px',
                        borderRadius: '30px',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        zIndex: 1,
                        backgroundColor: '#00008b',
                        boxShadow: '0 4px 6px rgba(0, 0, 139, 0.5)',
                    }}
                >
                    <Box component="form" onSubmit={handleLoginSubmit} noValidate sx={{ width: '100%' }}>
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
                            sx={{
                                mb: 3,
                                '& .MuiInputBase-input': { color: 'white' },
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'red' },
                                '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'white' },
                                '& .MuiInput-underline:after': { borderBottomColor: 'white' },
                            }}
                            onKeyDown={handleUsernameKeyDown} // เพิ่ม onKeyDown ที่นี่
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
                            sx={{
                                mb: 1,
                                '& .MuiInputBase-input': { color: 'white' },
                                '& .MuiInputLabel-root': { color: 'white' },
                                '& .MuiInputLabel-root.Mui-focused': { color: 'red' },
                                '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'white' },
                                '& .MuiInput-underline:after': { borderBottomColor: 'white' },
                            }}
                            inputRef={passwordRef} // กำหนด ref ให้ TextField ของ Password
                            onKeyDown={handlePasswordKeyDown} // เพิ่ม onKeyDown ที่นี่
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            onMouseDown={(e) => e.preventDefault()}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOffIcon sx={{ color: 'white' }} /> : <VisibilityIcon sx={{ color: 'white' }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button variant="text" sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 'bold' }}>
                            Forgot password?
                        </Button>
                    </Box> */}
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 5,
                                mb: 2,
                                py: 1.8,
                                borderRadius: '16px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                background: 'linear-gradient(to right bottom,hsla(347, 90%, 55%, 1.00),#f70300)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                '&:hover': {
                                    background: 'linear-gradient(to right bottom,hsla(347, 90%, 55%, 1.00),#f70300)',
                                    boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
                                },
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'SIGN IN'}
                        </Button>
                    </Box>

                    {/* Don't have account? Sign up */}
                    {/* <Box sx={{ textAlign: 'center', mt: 3, mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Don't have account?{' '}
                        <Button
                            variant="text"
                            sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 'bold' }}
                            onClick={() => {`**Handle navigation to Sign up page**` }}
                        >
                            Sign up
                        </Button>
                    </Typography>
                </Box> */}
                </Paper>
            </Box>
        </Box>
    );
}

export default LoginForm;