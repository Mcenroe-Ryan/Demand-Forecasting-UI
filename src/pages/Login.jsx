import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../src/screens/utils/api";
import {
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import PermissionConsentDialog from "../screens/components/SSO";

const Login = () => {
  const navigate = useNavigate();
  const [consentOpen, setConsentOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    account_number: "",
    password: "",
  });

  const loginData = {
    title: "Enter Into Play Ground",
    description:
      "All your Demand Forecast, Supply, Sales, Finance, Inventory, and Promotion in one place.",
    copyright: "© Copyright Cloud BC Labs. All Rights Reserved",
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Validate form
  const validateForm = () => {
    if (!formData.account_number.trim()) {
      setError("Account number is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await api.post("/auth/login", {
        account_number: formData.account_number,
        password: formData.password,
        ip_address: null,
      });

      if (data.status === "Success") {
        setSuccess("Login successful!");

        // Store user data and JWT token
        if (data.data?.user_id) {
          localStorage.setItem("user_id", data.data.user_id);
        }
        if (data.data) {
          localStorage.setItem("user_data", JSON.stringify(data.data));
        }
        if (data.data?.account_number) {
          localStorage.setItem("account_number", data.data.account_number);
        }
        // Store JWT token
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // Navigate to dashboard after brief delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSsoSignIn = () => setConsentOpen(true);
  const handleConsentAccept = () => {
    setConsentOpen(false);
    navigate("/dashboard");
  };
  const handleConsentCancel = () => setConsentOpen(false);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(72deg, rgba(14,66,164,1) 0%, rgba(103,156,255,1) 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Images */}
      <Box
        component="img"
        src="https://c.animaapp.com/VbjHLlVw/img/image-1.png"
        alt="Cloud Top Left"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 600,
          height: 450,
          objectFit: "cover",
          animation: "floatTopLeft 20s ease-in-out infinite",
          "@keyframes floatTopLeft": {
            "0%, 100%": {
              transform: "translate(0, 0)",
            },
            "50%": {
              transform: "translate(-20px, -20px)",
            },
          },
        }}
      />
      <Box
        component="img"
        src="https://c.animaapp.com/VbjHLlVw/img/image-2@2x.png"
        alt="Cloud Bottom Right"
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 313,
          height: 313,
          objectFit: "cover",
          animation: "floatBottomRight 15s ease-in-out infinite",
          "@keyframes floatBottomRight": {
            "0%, 100%": {
              transform: "translate(0, 0)",
            },
            "50%": {
              transform: "translate(20px, 20px)",
            },
          },
        }}
      />

      {/* Main Login Card with Fade-in Animation */}
      <Paper
        elevation={4}
        sx={{
          width: 1107,
          height: 626,
          borderRadius: 3,
          backgroundColor: "rgba(204, 192, 192, 0.1)",
          backdropFilter: "blur(17.5px)",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          animation: "fadeIn 0.8s ease-in-out",
          "@keyframes fadeIn": {
            from: {
              opacity: 0,
              transform: "scale(0.95)",
            },
            to: {
              opacity: 1,
              transform: "scale(1)",
            },
          },
        }}
      >
        {/* Left Side Info Panel with Slide-in Animation */}
        <Paper
          elevation={0}
          sx={{
            width: 411,
            height: 552,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            m: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "slideInLeft 0.8s ease-out",
            "@keyframes slideInLeft": {
              from: {
                opacity: 0,
                transform: "translateX(-50px)",
              },
              to: {
                opacity: 1,
                transform: "translateX(0)",
              },
            },
          }}
        >
          <Stack alignItems="center" spacing={2} sx={{ width: 363 }}>
            <Box
              component="img"
              src="https://c.animaapp.com/VbjHLlVw/img/background@2x.png"
              alt="Login Illustration"
              sx={{
                width: 267,
                height: 251,
                animation: "bounce 2s ease-in-out infinite",
                "@keyframes bounce": {
                  "0%, 100%": {
                    transform: "translateY(0)",
                  },
                  "50%": {
                    transform: "translateY(-10px)",
                  },
                },
              }}
            />
            <Typography
              variant="h6"
              fontWeight={800}
              color="#FFFFFF"
              textAlign="center"
              sx={{
                animation: "fadeInUp 1s ease-out 0.3s both",
                "@keyframes fadeInUp": {
                  from: {
                    opacity: 0,
                    transform: "translateY(20px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              {loginData.title}
            </Typography>
            <Typography
              variant="body2"
              color="#FFFFFF"
              textAlign="center"
              sx={{
                animation: "fadeInUp 1s ease-out 0.5s both",
              }}
            >
              {loginData.description}
            </Typography>
          </Stack>
        </Paper>

        {/* Right Side Form with Slide-in Animation */}
        <Box
          sx={{
            flex: 1,
            pr: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "translateY(-32px)",
            animation: "slideInRight 0.8s ease-out",
            "@keyframes slideInRight": {
              from: {
                opacity: 0,
                transform: "translateX(50px) translateY(-32px)",
              },
              to: {
                opacity: 1,
                transform: "translateX(0) translateY(-32px)",
              },
            },
          }}
        >
          <Stack spacing={3} sx={{ width: 360, maxWidth: "90%" }}>
            <Typography
              variant="h6"
              fontWeight={600}
              color="#FFFFFF"
              sx={{
                animation: "fadeInUp 1s ease-out 0.2s both",
              }}
            >
              Signin
            </Typography>

            {/* Error/Success Messages with Slide Animation */}
            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
                sx={{
                  animation: "slideDown 0.3s ease-out",
                  "@keyframes slideDown": {
                    from: {
                      opacity: 0,
                      transform: "translateY(-10px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert
                severity="success"
                onClose={() => setSuccess("")}
                sx={{
                  animation: "slideDown 0.3s ease-out",
                }}
              >
                {success}
              </Alert>
            )}

            <Stack
              spacing={1.5}
              sx={{
                animation: "fadeInUp 1s ease-out 0.4s both",
              }}
            >
              <Typography variant="body1" fontWeight={600} color="#FFFFFF">
                Account Number
              </Typography>
              <TextField
                name="account_number"
                fullWidth
                placeholder="Ex. 0000 9999 XXXX"
                variant="outlined"
                size="small"
                value={formData.account_number}
                onChange={handleInputChange}
                disabled={loading}
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                  "& .MuiOutlinedInput-root": {
                    transition: "all 0.3s ease",
                    "&:focus-within": {
                      transform: "scale(1.02)",
                    },
                  },
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
              />
            </Stack>

            <Stack
              spacing={1.5}
              sx={{
                animation: "fadeInUp 1s ease-out 0.5s both",
              }}
            >
              <Typography variant="body1" fontWeight={600} color="#FFFFFF">
                Password
              </Typography>
              <TextField
                name="password"
                fullWidth
                type="password"
                placeholder="**********"
                variant="outlined"
                size="small"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                sx={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                  "& .MuiOutlinedInput-root": {
                    transition: "all 0.3s ease",
                    "&:focus-within": {
                      transform: "scale(1.02)",
                    },
                  },
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
              />
            </Stack>

            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                backgroundColor: "primary.main",
                borderRadius: 1,
                py: 1.5,
                textTransform: "none",
                animation: "fadeInUp 1s ease-out 0.6s both",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                },
                "&:active": {
                  transform: "translateY(-1px)",
                },
              }}
              onClick={handleLogin}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign in"
              )}
            </Button>

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                animation: "fadeInUp 1s ease-out 0.7s both",
              }}
            >
              <Box
                flex={1}
                height={1}
                sx={{ bgcolor: "rgba(255,255,255,0.5)" }}
              />
              <Typography variant="caption" color="#FFFFFF">
                Or
              </Typography>
              <Box
                flex={1}
                height={1}
                sx={{ bgcolor: "rgba(255,255,255,0.5)" }}
              />
            </Stack>

            <Button
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                borderRadius: 1,
                py: 1.5,
                textTransform: "none",
                animation: "fadeInUp 1s ease-out 0.8s both",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                },
                "&:active": {
                  transform: "translateY(-1px)",
                },
              }}
              onClick={handleSsoSignIn}
            >
              Sign in with SSO
            </Button>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                animation: "fadeInUp 1s ease-out 0.9s both",
              }}
            >
              <Link
                component="button"
                underline="always"
                color="#FFFFFF"
                variant="caption"
                disabled={loading}
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Forgot your password?
              </Link>
              <Link
                component="button"
                underline="always"
                color="#FFFFFF"
                variant="caption"
                disabled={loading}
                onClick={() => navigate("/signup")}
                sx={{
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Signup now
              </Link>
            </Box>
          </Stack>
        </Box>
      </Paper>

      <PermissionConsentDialog
        open={consentOpen}
        appName="SSO for Demand Planning"
        onAccept={handleConsentAccept}
        onCancel={handleConsentCancel}
      />
    </Box>
  );
};

export default Login;