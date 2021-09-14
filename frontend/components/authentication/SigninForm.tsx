import React, { useState, useContext } from "react"

import Link from 'next/link';
import { useRouter } from 'next/router';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import { Icon } from '@iconify/react';
import googleFill from '@iconify/icons-eva/google-fill';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';

import { setCookie } from 'nookies';

import { AuthContext } from "../../pages/_app"
import { signIn } from "../../hooks/auth"
import { SignInParams } from "../../types/authitem"

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link href="https://material-ui.com/">
        <Button color="inherit">
          Your Website
        </Button>
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
    marginTop: theme.spacing(1),
  },
  authsocial: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignIn = () => {
  const classes = useStyles();
  const router = useRouter();
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };
  const loginTwitter = () => {
    window.location.href = process.env.NEXT_PUBLIC_BACKENDBASEURL + "auth/twitter?auth_origin_url=" + process.env.NEXT_PUBLIC_FRONTENDBASEURL
  }
  const loginGoogle = () => {
    window.location.href = process.env.NEXT_PUBLIC_BACKENDBASEURL + "auth/google_oauth2?auth_origin_url=" + process.env.NEXT_PUBLIC_FRONTENDBASEURL
  }
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const params: SignInParams = {
      email: email,
      password: password
    }

    try {
      const res = await signIn(params)
      if (res.status === 200) {
        // ログインに成功した場合はCookieに各値を格納
        setCookie(null, '_access_token', res.headers["access-token"], {
          maxAge: 30 * 24 * 60 * 60, // お好きな期限を
          path: '/',
        });

        setCookie(null, '_client', res.headers["client"], {
          maxAge: 30 * 24 * 60 * 60, // お好きな期限を
          path: '/',
        });

        setCookie(null, '_uid', res.headers["uid"], {
          maxAge: 30 * 24 * 60 * 60, // お好きな期限を
          path: '/',
        });

        setIsSignedIn(true)
        setCurrentUser(res.data.data)

        router.push("/")
      } else {
        router.push("/signin")
      }
    } catch (err) {
      router.push("/signin")
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          サインイン
        </Typography>

        <Grid container justifyContent="center" className={classes.authsocial} spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={loginGoogle}>
              <Icon icon={googleFill} color="#DF3E30" height={24} />
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button fullWidth size="large" color="inherit" variant="outlined" onClick={loginTwitter}>
              <Icon icon={twitterFill} color="#1C9CEA" height={24} />
            </Button>
          </Grid>
        </Grid>

        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="メールアドレス"
            name="email"
            autoComplete="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type={showPassword ? 'text' : 'password'}
            id="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            autoComplete="current-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="	ログイン状態を保持する"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}>
            サインイン
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgotpass">
                パスワードを忘れた方はこちら
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup">
                アカウントを作成
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default SignIn;