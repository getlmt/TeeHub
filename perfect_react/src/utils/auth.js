

const ACCESS_KEY = "accessToken";
const ROLE_KEY   = "role";
const EMAIL_KEY  = "email";
const ID_KEY     = "userId"; 

export function getAccessToken() {
  
  const t = localStorage.getItem(ACCESS_KEY); 
  if (!t) return null;
  const s = String(t).trim().toLowerCase();
  if (s === "null" || s === "undefined" || s === "") return null;
  return t;
}

export function setAccessToken(t) {
  
  if (t) localStorage.setItem(ACCESS_KEY, t);
  else localStorage.removeItem(ACCESS_KEY);
}

export function setAuth({ accessToken, role, email, userId }) { 
  setAccessToken(accessToken);
  
  if (role)  localStorage.setItem(ROLE_KEY, role);
  if (email) localStorage.setItem(EMAIL_KEY, email);
  
  if (userId !== null && userId !== undefined) localStorage.setItem(ID_KEY, String(userId)); 
  window.dispatchEvent(new Event('authChange'));
}

export function clearAuth() {
  
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(ID_KEY); 
  window.dispatchEvent(new Event('authChange'));
}

export function getRole() { 
  return localStorage.getItem(ROLE_KEY); 
}

export function getEmail() {
  return localStorage.getItem(EMAIL_KEY) || "";
}

export function getUserId() { 
    const id = localStorage.getItem(ID_KEY);
    
    return id ? parseInt(id, 10) : null; 
}


export function normalizeRole(r = "") {
  const up = String(r).trim().toUpperCase();
  if (!up) return "";
  return up.startsWith("ROLE_") ? up : `ROLE_${up}`;
}
export function hasAnyRole(required = []) {
  const current = normalizeRole(getRole() || "");
  const set = required.map(normalizeRole);
  return !!current && set.includes(current);
}


export function isAuthenticated() {
  const t = getAccessToken();
  const id = getUserId();
  
  return !!(t && t.split(".").length === 3 && t.length > 20 && id !== null); 
}
export const getUserRole = () => {
  return localStorage.getItem(ROLE_KEY);
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.role; 
    } catch (e) {
      return null;
    }
  }
  return null;
};