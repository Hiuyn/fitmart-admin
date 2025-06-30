// src/components/AuthRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = ({ isLoggedIn }) => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AuthRoute;
