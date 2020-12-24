import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginPersonThunk } from '../../redux/creators/users';
import {
  makeStyles,
  Button,
  withStyles,
  TextField,
  Icon,
} from '@material-ui/core';
import style from './index.module.css';

function Login() {
  const RandomButton = withStyles(() => ({
    root: {
      color: '#67a3a3',
      marginTop: '20px',
      marginLeft: '65%',
      '&:hover': {
        backgroundColor: '#FFE0A1',
        color: 'white !important',
      },
    },
  }))(Button);
  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1.5),
      },
      button: {
        margin: theme.spacing(1),
      },
    },
  }));

  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  function handlerLogin(e) {
    e.preventDefault();
    dispatch(loginPersonThunk({ email, pass }));
    history.push('/makewrong');
  }

  return (
    <div className={style.formDiv}>
      {/* <img className={style.headerNewLogo} src={newLogo} alt="pic" /> */}
      <h2>Вход</h2>
      <form className={classes.root} autoComplete="off">
        <TextField
          size="small"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          label="Email"
          type="email"
          required
          error={email === ' '}
          helperText={email === ' ' ? 'Empty!' : ' '}
        />
        <TextField
          size="small"
          value={pass}
          onChange={(event) => setPass(event.target.value)}
          label="Пароль"
          type="password"
          required
          error={pass === ' '}
          helperText={pass === ' ' ? 'Empty!' : ' '}
        />
        <RandomButton
          variant="outlined"
          endIcon={<Icon>login</Icon>}
          onClick={handlerLogin}
        >
          Войти
        </RandomButton>
        <p>Еще не зарегистрированы?</p>
        <RandomButton
          variant="outlined"
          endIcon={<Icon>how_to_reg</Icon>}
          onClick={() => {
            history.push('/register');
          }}
        >
          Создать аккаунт
        </RandomButton>
      </form>
    </div>
  );
}

export default Login;
