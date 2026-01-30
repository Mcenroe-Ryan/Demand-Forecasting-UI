import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const LoginVerify = () => {
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const next = [...otpValues];
      next[index] = value.replace(/\D/g, "");
      setOtpValues(next);

      if (value && index < otpValues.length - 1) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleVerify = () => {
    navigate("/dashboard");
  };

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
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
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
      >
        <img
          src="https://c.animaapp.com/VnOr3e3w/img/image-1.png"
          alt="Cloud"
          style={{ width: 600, height: 450, objectFit: "cover" }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
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
      >
        <img
          src="https://c.animaapp.com/VnOr3e3w/img/image-2@2x.png"
          alt="Cloud"
          style={{ width: 313, height: 313, objectFit: "cover" }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box
          sx={{
            width: "100%",
            height: 626,
            backgroundColor: "rgba(204, 192, 192, 0.1)",
            borderRadius: 2,
            backdropFilter: "blur(17.5px)",
            display: "flex",
            justifyContent: "space-between",
            padding: 4,
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
          <Box
            sx={{
              width: 411,
              height: 552,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 3,
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
            <Box sx={{ width: 217, height: 173, position: "relative", mb: 3 }}>
              <img
                src="https://c.animaapp.com/VnOr3e3w/img/background@2x.png"
                alt="Verification"
                style={{
                  width: 206,
                  height: 163,
                  position: "absolute",
                  top: 4,
                  left: 6,
                  animation: "bounce 2s ease-in-out infinite",
                }}
              />
              <style>
                {`
                  @keyframes bounce {
                    0%, 100% {
                      transform: translateY(0);
                    }
                    50% {
                      transform: translateY(-10px);
                    }
                  }
                `}
              </style>
            </Box>
            <Stack spacing={2} alignItems="center" width="100%">
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
                Verify Your Identity
              </Typography>
              <Typography
                variant="body2"
                color="#FFFFFF"
                textAlign="center"
                sx={{
                  animation: "fadeInUp 1s ease-out 0.5s both",
                }}
              >
                We've just sent a text message with your security code on the
                number +91 ********26
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              width: 409,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: 2,
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
            <Stack spacing={3}>
              <Typography
                variant="h6"
                fontWeight={800}
                color="#FFFFFF"
                sx={{
                  animation: "fadeInUp 1s ease-out 0.2s both",
                }}
              >
                Verify Your Identity
              </Typography>
              <Typography
                variant="body2"
                color="#FFFFFF"
                sx={{
                  animation: "fadeInUp 1s ease-out 0.3s both",
                }}
              >
                We've just sent a text message with your security code on the
                number +91 ********26
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                width="200px"
                sx={{
                  animation: "fadeInUp 1s ease-out 0.4s both",
                }}
              >
                {otpValues.map((val, idx) => (
                  <TextField
                    key={idx}
                    id={`otp-input-${idx}`}
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    variant="outlined"
                    inputProps={{
                      maxLength: 1,
                      inputMode: "numeric",
                      style: { textAlign: "center", padding: 8 },
                    }}
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        borderRadius: 1,
                        height: 38,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        },
                        "&:focus-within": {
                          transform: "scale(1.05)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                        },
                      },
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleVerify();
                    }}
                  />
                ))}
              </Stack>

              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: 1,
                  py: 1.2,
                  animation: "fadeInUp 1s ease-out 0.5s both",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  },
                  "&:active": {
                    transform: "translateY(-1px)",
                  },
                }}
                onClick={handleVerify}
              >
                Verify
              </Button>

              <Link
                component="button"
                variant="body2"
                underline="always"
                color="#FFFFFF"
                sx={{
                  fontSize: 12,
                  animation: "fadeInUp 1s ease-out 0.6s both",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  },
                }}
                onClick={() => setOtpValues(["", "", "", ""])}
              >
                Resend OTP
              </Link>
            </Stack>
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="#FFFFFF"
          sx={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            textAlign: "center",
            animation: "fadeInUp 1s ease-out 0.7s both",
          }}
        >
          © Copyright Cloud BC Labs. All Rights Reserved
        </Typography>
      </Container>
    </Box>
  );
};

export default LoginVerify;