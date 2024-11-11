import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const [token, setToken] = useState(cookies.token || null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = cookies.token;
    const tokenUser = cookies.user;
    if (token) {
      setUser(tokenUser);
      setIsLoggedIn(true);
    }
  }, [cookies]);

  const login = async (email, password) => {
    try {
      const UserName = email;
      const response = await axios.post('https://hxstudioauth.azurewebsites.net/api/auth/login', { UserName, password });
      if (response.data.isSuccess) {
        const { token, user } = response.data.result;
        setCookie('token', token, { path: '/' });
        setCookie('user', user, { path: '/' });
        setUser(user);
        setIsLoggedIn(true);
        setToken(token);
        return Promise.resolve();
      } else {
        return Promise.reject(response.data.message || 'Login failed');
      }
    } catch (error) {
      return Promise.reject(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    removeCookie('token', { path: '/' });
    removeCookie('user', { path: '/' });
    setUser(null);
    setIsLoggedIn(false);
  };

  return { user, login, logout, isLoggedIn };
};

export default useAuth;