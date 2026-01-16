/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AuthContext = createContext();
const backendUrl = "https://demo-auth-server.onrender.com";

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);

  const getUserData = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/user/data");
      res.data.success
        ? setUserData(res.data.userData)
        : toast.error(res.data.message);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const onRegister = async (e, name, email, password, passwordStrength) => {
    e.preventDefault();
    if (loading) return;

    if (mode === "signup" && passwordStrength === "weak") {
      toast.error("Password is too weak");
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const url = mode === "signup" ? "/api/auth/register" : "/api/auth/login";

      const payload =
        mode === "signup" ? { name, email, password } : { email, password };

      const res = await axios.post(backendUrl + url, payload);

      if (res.data.success) {
        setIsLoggedIn(true);
        getUserData();
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    axios.defaults.withCredentials = true;
    try {
      const res = await axios.post(backendUrl + "/api/auth/logout");
      if (res.data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAuthState = async () => {
    axios.defaults.withCredentials = true;
    try {
      const res = await axios.get(backendUrl + "/api/auth/is-auth");
      if (res.data.success) {
        setIsLoggedIn(true);
        getUserData();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    isLoggedIn,
    userData,
    onRegister,
    getUserData,
    mode,
    setMode,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};
