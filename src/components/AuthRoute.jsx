// src/components/AuthRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AuthRoute = ({ isLoggedIn }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthRoute;
