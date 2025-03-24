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
import { GoogleLogin } from '@react-oauth/google';

// 🔹 Unified Type for Both Login & Register
interface FormValues {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  occupation?: string;
  picture?: File | null;
}

// 🔹 Validation Schemas
const registerSchema = yup.object().shape({
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().required('Required'),
  location: yup.string().required('Required'),
  occupation: yup.string().required('Required'),
  picture: yup.mixed().required('Required'),
});

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().required('Required'),
});

// 🔹 Initial Values
const initialValuesRegister: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  location: '',
  occupation: '',
  picture: null,
};

const initialValuesLogin: FormValues = {
  email: '',
  password: '',
};

const Form: React.FC = () => {
  const [pageType, setPageType] = useState<'login' | 'register'>('login');
  const [googleProfile, setGoogleProfile] = useState<Partial<FormValues> | null>(null);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const isLogin = pageType === 'login';
  const isRegister = pageType === 'register';

  const register = async (values: FormValues, onSubmitProps: FormikHelpers<FormValues>) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await fetch('http://localhost:5001/auth/register', {
        method: 'POST',
        body: formData,
      });

      const savedUser = await response.json();
      onSubmitProps.resetForm();

      if (savedUser.success) {
        setPageType('login');
        navigate('/', { replace: true });
      }
    } catch (error) {
      console.error('Registration Error:', error);
    }
  };

  const login = async (values: FormValues, onSubmitProps: FormikHelpers<FormValues>) => {
    const loggedInResponse = await fetch('http://localhost:5001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();

    if (loggedIn) {
      dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token }));
      navigate('/home');
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch('http://localhost:5001/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (data.success) {
        dispatch(setLogin({ user: data.user, token: data.token }));
        navigate('/home');
      }
    } catch (error) {
      console.error('Google Login Error:', error);
    }
  };

  const handleGoogleRegisterSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch('http://localhost:5001/auth/google-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await response.json();
      if (data.success) {
        setGoogleProfile({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
        setPageType('register');
      }
    } catch (error) {
      console.error('Google Profile Fetch Error:', error);
    }
  };

  const handleFormSubmit = async (
    values: FormValues,
    onSubmitProps: FormikHelpers<FormValues>
  ) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) {
      const finalValues = { ...values, ...googleProfile };
      await register(finalValues, onSubmitProps);
    }
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : { ...initialValuesRegister, ...googleProfile }}
      validationSchema={isLogin ? loginSchema : registerSchema}
      enableReinitialize
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
            sx={{ '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' } }}
          >
            {isRegister && (
              <>
                <TextField label="First Name" name="firstName" onBlur={handleBlur} onChange={handleChange} value={values.firstName || ''} error={Boolean(touched.firstName && errors.firstName)} helperText={touched.firstName && errors.firstName} sx={{ gridColumn: 'span 2' }} disabled={!!googleProfile?.firstName} />
                <TextField label="Last Name" name="lastName" onBlur={handleBlur} onChange={handleChange} value={values.lastName || ''} error={Boolean(touched.lastName && errors.lastName)} helperText={touched.lastName && errors.lastName} sx={{ gridColumn: 'span 2' }} disabled={!!googleProfile?.lastName} />
                <TextField label="Email" name="email" onBlur={handleBlur} onChange={handleChange} value={values.email || ''} error={Boolean(touched.email && errors.email)} helperText={touched.email && errors.email} sx={{ gridColumn: 'span 4' }} disabled={!!googleProfile?.email} />
                <TextField label="Password" name="password" type="password" onBlur={handleBlur} onChange={handleChange} value={values.password || ''} error={Boolean(touched.password && errors.password)} helperText={touched.password && errors.password} sx={{ gridColumn: 'span 4' }} />
                <TextField label="Location" name="location" onBlur={handleBlur} onChange={handleChange} value={values.location || ''} error={Boolean(touched.location && errors.location)} helperText={touched.location && errors.location} sx={{ gridColumn: 'span 4' }} />
                <TextField label="Occupation" name="occupation" onBlur={handleBlur} onChange={handleChange} value={values.occupation || ''} error={Boolean(touched.occupation && errors.occupation)} helperText={touched.occupation && errors.occupation} sx={{ gridColumn: 'span 4' }} />
                <Box gridColumn="span 4" border={`1px solid ${palette.grey[500]}`} borderRadius="5px" p="1rem">
                  <Dropzone
                    accept={{ 'image/*': [] } as Accept}
                    multiple={false}
                    onDrop={(acceptedFiles) => setFieldValue('picture', acceptedFiles[0])}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ '&:hover': { cursor: 'pointer' } }}
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

            {!isRegister && (
              <>
                <TextField label="Email" name="email" onBlur={handleBlur} onChange={handleChange} value={values.email || ''} error={Boolean(touched.email && errors.email)} helperText={touched.email && errors.email} sx={{ gridColumn: 'span 4' }} />
                <TextField label="Password" name="password" type="password" onBlur={handleBlur} onChange={handleChange} value={values.password || ''} error={Boolean(touched.password && errors.password)} helperText={touched.password && errors.password} sx={{ gridColumn: 'span 4' }} />
              </>
            )}
          </Box>

          <Box>
            <Button fullWidth type="submit" sx={{ m: '2rem 0', p: '1rem' }}>
              {isLogin ? 'LOGIN' : 'REGISTER'}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? 'register' : 'login');
                resetForm();
              }}
              sx={{
                textDecoration: 'underline',
                color: palette.primary.main,
                '&:hover': {
                  cursor: 'pointer',
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : 'Already have an account? Login here.'}
            </Typography>
          </Box>

          {/* Google Login and Registration Buttons */}
          {isLogin && (
            <Box sx={{ mt: '1rem' }}>
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => console.error('Google Login Failed')}
              />
            </Box>
          )}
          {isRegister && (
            <Box sx={{ mt: '1rem' }}>
              <GoogleLogin
                onSuccess={handleGoogleRegisterSuccess}
                onError={() => console.error('Google Register Failed')}
              />
            </Box>
          )}
        </form>
      )}
    </Formik>
  );
};

export default Form;
