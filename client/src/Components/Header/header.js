import { useSelector } from 'react-redux'

import {
  Link,
} from 'react-router-dom';
import Logout from '../Logout/logout';

function Header() {

  const login = useSelector(state => state.users)
  return (
    <>
      <div>
        {login ? (
          <div >
            <div><Link to="/lk">Личный кабинет</Link></div>
            <div><Link to="/lenta">Лента</Link></div>
            <div><Link to="/peoples">Люди</Link></div>
            <div><Link to="/stats">Статистика</Link></div>
            <div><Link to="/advices">Советы</Link></div>
            <div><Link to="/makewrong">Создать обидку</Link></div>
            <div><Link to="/chat">Обсудить</Link></div>
            <hr />
            <div><Logout /></div>
          </div>
        ) : (
            <div>
              <div><Link to="/">Войти</Link></div>
              <div><Link to="/register">Регистрация</Link></div>
              <hr />
            </div>
          )}

      </div>
    </>
  )
}

export default Header
