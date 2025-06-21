import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
   const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem("admin")));

   useEffect(() => {
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
     setAdmin(JSON.parse(localStorage.getItem("admin")));
};

   window.addEventListener("storage", handleStorageChange);
   return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  return (
     <AuthContext.Provider value={{ user, setUser, admin, setAdmin }}>
       {children}
     </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);