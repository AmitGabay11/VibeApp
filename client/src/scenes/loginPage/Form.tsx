import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../state'; 
import Dropzone, { Accept } from 'react-dropzone';
import FlexBetween from '../../components/FlexBetween'; 

// 🔹 Define Type for Register Values
interface RegisterValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
  occupation: string;
  picture: File | null;
}

// 🔹 Define Type for Login Values
interface LoginValues {
  email: string;
  password: string;
  firstName?: string;
    lastName?: string;
    location?: string;
    occupation?: string;
    picture?: File | null;
}

// 🔹 Define Validation Schemas
const registerSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
  location: yup.string().required("Required"),
  occupation: yup.string().required("Required"),
  picture: yup.mixed().required("Required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
});

// 🔹 Define Initial Values
const initialValuesRegister: RegisterValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: null,
};

const initialValuesLogin: LoginValues = {
  email: "",
  password: "",
};

// 🔹 Define Component
const Form: React.FC = () => {
  const [pageType, setPageType] = useState<"login" | "register">("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  // 🔹 Register User
  const register = async (
    values: RegisterValues,
    onSubmitProps: FormikHelpers<RegisterValues>
  ) => {
    try {
      // 🔹 Convert to JSON format (instead of FormData)
      const requestBody = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        location: values.location,
        occupation: values.occupation,
        picture: values.picture?.name || "", // ✅ Send only the filename
      };
  
      // 🔹 Send JSON request
      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // ✅ Ensure correct header
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
  
      const savedUser = await response.json();
      onSubmitProps.resetForm();
  
      if (savedUser) {
        navigate("/"); // ✅ Redirect to login page
      }
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };
  

  // 🔹 Login User
  const login = async (
    values: LoginValues,
    onSubmitProps: FormikHelpers<LoginValues>
  ) => {
    const loggedInResponse = await fetch("http://localhost:5001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();

    if (loggedIn) {
      dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }));
      navigate("/home");
    }
  };

  // 🔹 Form Submission Handler
  const handleFormSubmit = async (
    values: RegisterValues | LoginValues,
    onSubmitProps: FormikHelpers<RegisterValues | LoginValues>
  ) => {
    if (isLogin) await login(values as LoginValues, onSubmitProps);
    if (isRegister) await register(values as RegisterValues, onSubmitProps as FormikHelpers<RegisterValues>);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName || ""}
                  error={Boolean(touched.firstName && errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName || ""}
                  error={Boolean(touched.lastName && errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Location"
                  name="location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location || ""}
                  error={Boolean(touched.location && errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  name="occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation || ""}
                  error={Boolean(touched.occupation && errors.occupation)}
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: "span 4" }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.grey[500]}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    accept={{ 'image/*': [] } as Accept}
                    multiple={false}
                    onDrop={(acceptedFiles) => setFieldValue("picture", acceptedFiles[0])}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <Typography>Add Picture Here</Typography>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email || ""}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password || ""}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          <Box>
            <Button fullWidth type="submit" sx={{ m: "2rem 0", p: "1rem" }}>
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
    onClick={() => {
      setPageType(isLogin ? "register" : "login");
      resetForm();
    }}
    sx={{
      textDecoration: "underline",
      color: palette.primary.main,
      "&:hover": {
        cursor: "pointer",
        color: palette.primary.light,
      },
    }}
  >
    {isLogin
      ? "Don't have an account? Sign Up here."
      : "Already have an account? Login here."}
  </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
