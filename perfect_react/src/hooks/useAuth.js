
import { useState, useEffect, useCallback } from "react";
import { login as doLogin, logout as doLogout } from "../services/authService";
import { getAccessToken } from "../services/httpClient";

export default function useAuthState() {
  const [accessToken, setToken] = useState(() => getAccessToken());
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null); 

  const login = useCallback(async (email, password) => {
    const info = await doLogin(email, password);
    setToken(info.accessToken);
    setEmail(info.email);
    setRole(info.role);
  }, []);

  const logout = useCallback(async () => {
    await doLogout();
    setToken(null);
    setEmail(null);
    setRole(null);
  }, []);

  
  

  useEffect(() => {
    
  }, []);

  return { accessToken, email, role, login, logout };
}
