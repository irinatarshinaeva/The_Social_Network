import React from 'react';
import { useSelector } from 'react-redux';
import style from './index.module.css';
import { Link } from 'react-router-dom';
import Logout from '../Logout/logout';
import logo from './logo2.jpg';
import people from './people.png';
import news from './new.png';
import advice from './advice.png';
import tape from './tape.png';
import account from './account.png';
import newLogo from './NothingWrong.png';
import entry from './entry.png';
import reg from './reg.png';
import WrongIs from '../Header/WrongIs.png';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Drawer,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

function Header() {
  const RandomButton = withStyles(() => ({
    root: {
      color: '#67a3a3',
      width: '100px',
      border: '2px solid white',
      fontSize: '16px',
      boxShadow: '0 0 10px #0000007d',
      marginTop: '10px',
      fontWeight: 'bold',
      marginLeft: '10px',
      paddingTop: '10px',
      backgroundColor: '#FFF',
    },
  }))(Button);

  const login = useSelector((state) => state.users);
  const toMePost = useSelector((state) => state.toMePost);
  const emoji = [account, tape, people, news, advice];
  const emoji2 = [entry, reg];

  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {login ? (
        <div>
          <List className={style.headerDiv}>
            <img className={style.headerLogo} src={logo} alt="pic" />
            <img className={style.headerNewLogo} src={newLogo} alt="pic" />

            {[
              <Link to="/account">Все посты</Link>,
              <Link to="/feed">Лента</Link>,
              <Link to="/people">Люди</Link>,
              <Link to="/makewrong">Создать пост</Link>,
              <Link to="/advice">Советы</Link>,
            ].map((text, index) => (
              <ListItem button key={index}>
                <ListItemIcon>
                  <img
                    className={style.headerLogo2}
                    src={emoji[index]}
                    alt="pic"
                  />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
            <Logout className={style.logout_btn} />
          </List>
        </div>
      ) : (
        <div className={style.headerDiv}>
          <List>
            <img className={style.headerLogoEnter} src={logo} alt="pic" />
            <img className={style.headerNewLogo} src={newLogo} alt="pic" />
            {[
              <Link to="/">Войти</Link>,
              <Link to="/register">Регистрация</Link>,
            ].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  <img
                    className={style.headerLogo3}
                    src={emoji2[index]}
                    alt="pic"
                  />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </div>
      )}
    </div>
  );

  return (
    <>
      {
        <React.Fragment key={'left'}>
          <div className={style.flexBox}>
            <div>
              <RandomButton onClick={toggleDrawer('left', true)}>
                {'Меню'}
              </RandomButton>
            </div>
            {!(login && toMePost) ? (
              <img
                className={style.forImg}
                src={WrongIs}
                width="180"
                height="35"
                alt="pic"
              />
            ) : (
              <div className={style.bell}>
                {login}, 🔔 {toMePost.length}
              </div>
            )}
          </div>
          <Drawer
            anchor={'left'}
            open={state['left']}
            onClose={toggleDrawer('left', false)}
          >
            {list('left')}
          </Drawer>
        </React.Fragment>
      }
    </>
  );
}

export default Header;
