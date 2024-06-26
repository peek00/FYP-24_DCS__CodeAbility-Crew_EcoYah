import { useState, useEffect } from "react";
import "../../styles/App.css";
import {
  Box,
  Alert,
  Stack,
  Typography,
  FormHelperText,
  Link,
} from "@mui/material";
import logo from "../../assets/EcoYah.png";
import TextFields from "../../components/TextFields/FormTextFields";
import Checkboxes from "../../components/Checkbox/FormCheckBox";
import BasicButton from "../../components/Button/BasicButton";
import SuccessCard from "../../components/Card/SuccessCard";
import { Link as ReactRouterLink } from "react-router-dom";
import { makeHttpRequest } from "../../utils/Utility";
import axios from "axios";
import { PARENT_ROUTES } from "../../services/routes";

export default function SignUp() {
  const passwordCriteria: string[] = [
    "At least 12 characters",
    "1 uppercase letter",
    "1 lowercase letter",
    "1 number",
    "1 symbol",
  ];
  const signUpCriteria: string[] = [
    "By signing up, you agree to the Terms of Service and Privacy Policy.",
  ];

  const [step, setStep] = useState(1);
  const [validateForm, setValidateForm] = useState(false);
  const [dupEmail, setDupEmail] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [passwordText, setPasswordText] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordSame, setIsPasswordSame] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [signUpError, setSignUpError] = useState(false);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const handlePwdCriteria = (status: boolean) => {
    setIsPasswordValid(status);
  };

  const handleSignUpCriteria = (status: boolean) => {
    setIsChecked(status);
  };

  const handleButtonChange = async (status: boolean) => {
    setValidateForm(status);

    if (isPasswordValid && isPasswordSame && isChecked) {
      // POST user to database
      try {
        const res: any = await makeHttpRequest("POST", PARENT_ROUTES.USERS, {
          email: formData["email"],
          name: formData["name"],
          contactNum: formData["number"],
          passwordDigest: formData["password"],
        });
        if (res) {
          localStorage.setItem("ecoyah-id", res.id);
          localStorage.setItem("ecoyah-email", formData["email"]);
          setStep(2);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle Axios errors
          const statusCode = error.response?.status;
          if (statusCode === 409) {
            setEmailExists(true);
            setDupEmail(formData["email"]);
          } else if (statusCode === 400) {
            setSignUpError(true);
          }
          console.log("Error status code:", statusCode);
        } else {
          // Handle non-Axios errors
          console.log("Non-Axios error occurred:", error);
        }
      }
    }
  };

  const handleData = (type: string, data: string) => {
    setFormData((prevData) => ({ ...prevData, [type]: data }));

    if (type === "password") {
      setPasswordText(data);
    }
  };

  useEffect(() => {
    if (
      formData["confirm password"] &&
      passwordText === formData["confirm password"]
    ) {
      setIsPasswordSame(true);
    } else {
      setIsPasswordSame(false);
    }

    if (validateForm && dupEmail === formData["email"]) {
      setEmailExists(true);
    } else {
      setEmailExists(false);
    }
  }, [formData, passwordText]);

  return (
    <>
      <Box
        component="img"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          position: "relative",
          m: "auto",
          marginTop: 3,
          width: "10rem",
          height: "10rem",
          borderRadius: "50%",
          boxShadow:
            "0px 10px 10px 0px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 0, 0, 0.2) inset",
        }}
        alt="EcoYah"
        src={logo}
      ></Box>
      <Box
        component="form"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: 420,
          m: "auto",
          "& > :not(style)": { m: 2, p: 2 },
          boxShadow: 5,
          borderRadius: 2,
        }}
        noValidate
        autoComplete="off"
      >
        {step === 1 ? (
          <Stack spacing={3}>
            {signUpError && (
              <Alert severity="error">
                The request encountered an issue. Please refresh and try again!
              </Alert>
            )}
            <Typography variant="h5" align="center" gutterBottom>
              Let's Get Started!
            </Typography>
            <hr></hr>
            <TextFields
              label="Email"
              type="email"
              form="sign up"
              validate={validateForm}
              data={handleData}
              error={emailExists}
            ></TextFields>
            <TextFields
              label="Name"
              type="name"
              validate={validateForm}
              data={handleData}
            ></TextFields>
            <TextFields
              label="Contact Number"
              type="number"
              validate={validateForm}
              data={handleData}
            ></TextFields>
            <TextFields
              label="Password"
              type="password"
              form="sign up"
              validate={validateForm}
              data={handleData}
              error={isPasswordValid}
            ></TextFields>
            <Box
              sx={{
                backgroundColor: "rgba(7, 83, 142, 0.25)",
                padding: 2,
                borderRadius: 2,
                width: 330,
              }}
            >
              <Typography variant="body2" gutterBottom>
                <b>Your password must contain:</b>
              </Typography>
              <Checkboxes
                type="password"
                label={passwordCriteria}
                text={passwordText}
                isChecked={handlePwdCriteria}
              ></Checkboxes>
            </Box>
            <TextFields
              label="Confirm Password"
              type="confirm password"
              validate={validateForm}
              data={handleData}
              error={isPasswordSame}
            ></TextFields>
            <Checkboxes
              label={signUpCriteria}
              type="sign up"
              text="none"
              isChecked={handleSignUpCriteria}
            ></Checkboxes>
            {validateForm && !isChecked && (
              <FormHelperText error>
                Please indicate that you have read the Terms of Service and Privacy Policy.
              </FormHelperText>
            )}
            <BasicButton
              label="Sign Up"
              variant="contained"
              onButtonChange={handleButtonChange}
            />
          </Stack>
        ) : (
          <SuccessCard type="sign up" />
        )}
      </Box>
      {step === 1 ? (
        <Typography sx={{ m: 2 }} align="center" variant="body2" gutterBottom>
          Already Have An Account?&nbsp;
          <b>
            <Link
              color="primary.light"
              component={ReactRouterLink}
              to="/sign-in"
            >
              Sign In
            </Link>
          </b>
        </Typography>
      ) : (
        <Typography sx={{ m: 2 }} align="center" variant="body2" gutterBottom>
          <b>
            <Link color="primary.light" component={ReactRouterLink} to="/">
              Go to Home
            </Link>
          </b>
        </Typography>
      )}
    </>
  );
}
