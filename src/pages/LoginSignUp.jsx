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
  Container,
  Grid,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PermissionConsentDialog from "../screens/components/SSO";

const LoginSignUp = () => {
  const navigate = useNavigate();
  const [consentOpen, setConsentOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    email: "",
    company_name: "",
    industry_type: "",
    password: "",
  });

  const industryTypes = [
    "Manufacturing",
    "Retail",
    "Technology",
    "Healthcare",
    "Finance",
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  // Handle select change
  const handleSelectChange = (e) => {
    setFormData((prev) => ({ ...prev, industry_type: e.target.value }));
    setError("");
  };

  // Validate form
  const validateForm = () => {
    if (!formData.first_name.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.last_name.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.mobile_number.trim()) {
      setError("Mobile number is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  // Handle signup
  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await api.post("/auth/signup", formData);

      if (data.status === "Success") {
        setSuccess(data.message || "Registration successful!");

        // Store account number and user_id for later use
        if (data.data?.account_number) {
          localStorage.setItem("account_number", data.data.account_number);
        }
        if (data.data?.user_id) {
          localStorage.setItem("user_id", data.data.user_id);
        }

        // Navigate to verify page after a brief delay
        setTimeout(() => {
          navigate("/verify", {
            state: {
              email: formData.email,
              mobile: formData.mobile_number,
            },
          });
        }, 1500);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSsoSignUp = () => setConsentOpen(true);
  const handleConsentAccept = () => {
    setConsentOpen(false);
    navigate("/verify");
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
        src="https://c.animaapp.com/Xt0WpHb0/img/image-1.png"
        alt="Cloud top left"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 600,
          height: 450,
          objectFit: "cover",
          zIndex: 1,
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
        src="https://c.animaapp.com/Xt0WpHb0/img/image-2@2x.png"
        alt="Cloud bottom right"
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 313,
          height: 313,
          objectFit: "cover",
          zIndex: 1,
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

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        <Paper
          elevation={4}
          sx={{
            width: 1107,
            height: 626,
            mx: "auto",
            display: "flex",
            borderRadius: 2,
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
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
          <Paper
            elevation={0}
            sx={{
              width: 411,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 2,
              p: 3,
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
            <Box sx={{ width: 285, height: 200, position: "relative" }}>
              <Box
                component="img"
                src="https://c.animaapp.com/Xt0WpHb0/img/background@2x.png"
                alt="Signup Illustration"
                sx={{
                  width: 221,
                  height: 179,
                  position: "absolute",
                  top: 13,
                  left: 32,
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
            </Box>
            <Typography
              variant="h6"
              fontWeight={800}
              color="#FFFFFF"
              textAlign="center"
              mt={3}
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
              Get Start Now
            </Typography>
            <Typography
              variant="body2"
              color="#FFFFFF"
              textAlign="center"
              mt={1}
              sx={{
                animation: "fadeInUp 1s ease-out 0.5s both",
              }}
            >
              All your Demand Forecast, Supply, Sales, Finance, Inventory, and
              Promotion in one place.
            </Typography>
          </Paper>

          <Box
            sx={{
              flex: 1,
              p: 5,
              overflowY: "auto",
              animation: "slideInRight 0.8s ease-out",
              "@keyframes slideInRight": {
                from: {
                  opacity: 0,
                  transform: "translateX(50px)",
                },
                to: {
                  opacity: 1,
                  transform: "translateX(0)",
                },
              },
            }}
          >
            <Stack spacing={2.5}>
              <Typography
                variant="h6"
                fontWeight={600}
                color="#FFFFFF"
                sx={{
                  animation: "fadeInUp 1s ease-out 0.2s both",
                }}
              >
                Signup
              </Typography>

              {/* Error/Success Messages */}
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

              <Grid
                container
                spacing={2}
                sx={{
                  animation: "fadeInUp 1s ease-out 0.3s both",
                }}
              >
                <Grid item xs={6}>
                  <TextField
                    name="first_name"
                    label="First Name"
                    placeholder="First Name"
                    fullWidth
                    size="small"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                    sx={{
                      bgcolor: "#FFFFFF",
                      borderRadius: 1,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="last_name"
                    label="Last Name"
                    placeholder="Last Name"
                    fullWidth
                    size="small"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                    sx={{
                      bgcolor: "#FFFFFF",
                      borderRadius: 1,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Grid
                container
                spacing={2}
                sx={{
                  animation: "fadeInUp 1s ease-out 0.4s both",
                }}
              >
                <Grid item xs={6}>
                  <TextField
                    name="mobile_number"
                    label="Mobile Number"
                    placeholder="Mobile Number"
                    fullWidth
                    size="small"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                    sx={{
                      bgcolor: "#FFFFFF",
                      borderRadius: 1,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    name="email"
                    label="Email Address"
                    placeholder="Email Address"
                    type="email"
                    fullWidth
                    size="small"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                    sx={{
                      bgcolor: "#FFFFFF",
                      borderRadius: 1,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <TextField
                name="company_name"
                label="Company Name (Optional)"
                placeholder="Enter company name"
                fullWidth
                size="small"
                value={formData.company_name}
                onChange={handleInputChange}
                disabled={loading}
                sx={{
                  bgcolor: "#FFFFFF",
                  borderRadius: 1,
                  animation: "fadeInUp 1s ease-out 0.5s both",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              />

              <Select
                name="industry_type"
                displayEmpty
                value={formData.industry_type}
                onChange={handleSelectChange}
                disabled={loading}
                fullWidth
                size="small"
                IconComponent={KeyboardArrowDownIcon}
                sx={{
                  bgcolor: "#FFFFFF",
                  borderRadius: 1,
                  animation: "fadeInUp 1s ease-out 0.6s both",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
                renderValue={(selected) =>
                  selected ? (
                    selected
                  ) : (
                    <Typography color="text.secondary">
                      Select Industry Type (Optional)
                    </Typography>
                  )
                }
              >
                {industryTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                name="password"
                label="Password"
                placeholder="Minimum 8 characters"
                type="password"
                fullWidth
                size="small"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                required
                helperText="Password must be at least 8 characters"
                sx={{
                  bgcolor: "#FFFFFF",
                  borderRadius: 1,
                  animation: "fadeInUp 1s ease-out 0.7s both",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              />

              <Button
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  textTransform: "none",
                  borderRadius: 1,
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
                onClick={handleSignup}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign up"
                )}
              </Button>

              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{
                  animation: "fadeInUp 1s ease-out 0.9s both",
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
                  py: 1.5,
                  textTransform: "none",
                  borderRadius: 1,
                  animation: "fadeInUp 1s ease-out 1s both",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  },
                  "&:active": {
                    transform: "translateY(-1px)",
                  },
                }}
                onClick={handleSsoSignUp}
              >
                Sign up with SSO
              </Button>

              <Typography
                variant="caption"
                color="#FFFFFF"
                textAlign="center"
                sx={{
                  animation: "fadeInUp 1s ease-out 1.1s both",
                }}
              >
                Already have an account?{" "}
                <Link
                  component="button"
                  underline="always"
                  color="#FFFFFF"
                  onClick={() => navigate("/")}
                  disabled={loading}
                  sx={{
                    transition: "all 0.3s ease",
                    "&:hover": {
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Paper>

        <Typography
          variant="caption"
          color="#FFFFFF"
          sx={{
            position: "absolute",
            bottom: -28,
            width: "100%",
            textAlign: "center",
            animation: "fadeInUp 1s ease-out 1.2s both",
          }}
        >
          © Copyright Cloud BC Labs. All Rights Reserved
        </Typography>
      </Container>

      <PermissionConsentDialog
        open={consentOpen}
        appName="SSO for Demand Planning"
        onAccept={handleConsentAccept}
        onCancel={handleConsentCancel}
      />
    </Box>
  );
};

export default LoginSignUp;