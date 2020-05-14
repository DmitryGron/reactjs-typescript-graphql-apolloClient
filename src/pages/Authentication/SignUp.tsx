import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouterProps, withRouter } from 'react-router';
import { useMutation } from '@apollo/react-hooks';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import gql from 'graphql-tag';
import Box from '@material-ui/core/Box';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { isRegistered } from 'store/auth/reducers';
import { register } from '../../store/auth/actions';
import { AppPath } from 'layout/App/appRoutes';
import { RegisterInput } from 'types/AuthDataTypes';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const CREATE_USER_MUTATION =  gql`
mutation register($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
  register(data: {firstName: $firstName, lastName: $lastName, email: $email, password: $password}) {
    user{
      id
    }
    errors{
      message
    }
  }
}`;

const SignUp: React.FC<RouterProps> = (props) => {
  const classes = useStyles();
  const [submitted, setSubmitted] = useState(false);
  const registered =  useSelector(isRegistered);
  const dispatch = useDispatch();
  const [createUser, { error, data, loading }] = useMutation(CREATE_USER_MUTATION);

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const redirectToLogin = useCallback(() => {
    props.history.push(AppPath.LOGIN);
  }, [props.history]);

  useEffect(() => {
    if (registered) {
      redirectToLogin();
    }
}, [redirectToLogin, registered]);


  function handleChange(e: any) {
        e.preventDefault();
        const { name, value } = e.target;
        setUser(user => ({ ...user, [name]: value }));
    }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitted(true);
    if (user.firstName.length > 0 && user.password.length > 0 && user.email.length > 0 && user.lastName.length > 0) {
        await createUser({variables: user});
        }
    }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PermIdentityIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                value={user.firstName}
                onChange={handleChange}
                autoComplete="firstName"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={user.lastName}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lastName"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={user.email}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={user.password}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href={AppPath.LOGIN} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default withRouter(SignUp);
