// src/pages/auth/AuthPage.tsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import the authentication form components
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import VerifyOtpForm from '@/components/auth/VerifyOtpForm';

// Import styled components
import {
    AuthContainer,
    AuthTitle,
    AuthNav,
    AuthNavLink,
} from './AuthPage.styled';

function AuthPage() {
    const location = useLocation();

    // Define paths for navigation
    const loginPath = '/auth/login';
    const registerPath = '/auth/register';

    return (
        <AuthContainer>
            <AuthTitle>Authentication</AuthTitle>

            {/* Navigation between forms */}
            <AuthNav>
                <AuthNavLink
                    to="login"
                    $isActive={location.pathname === loginPath || location.pathname === '/auth'}
                >
                    Login
                </AuthNavLink>
                <AuthNavLink
                    to="register"
                    $isActive={location.pathname === registerPath}
                >
                    Register
                </AuthNavLink>
            </AuthNav>

            {/* Render the nested Routes */}
            <Routes>
                <Route path="login" element={<LoginForm />} />
                <Route path="register" element={<RegisterForm />} />
                <Route path="verify" element={<VerifyOtpForm />} />
                <Route index element={<Navigate to="login" replace />} />
            </Routes>
        </AuthContainer>
    );
}

export default AuthPage;
