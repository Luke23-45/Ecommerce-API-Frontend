

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { verifyEmailWithOtp, resendPendingRegistrationOtp, getLoggedInUserProfile } from '@/api/auth/authApi'; 
import { setAuthenticated, logout } from '@/store/slices/authSlice'; 

import {
  type VerifyOtpPayload,
  type ResendOtpPayload,
  type ApiResponse
} from '@/types/auth'; 

import { type User } from '@/types/auth'; 


import {
  StyledForm,
  FormField,
  StyledLabel,
  StyledInput,
  ErrorMessage,
  SuccessMessage,
  SubmitButton,
  SecondaryButton,
  ButtonContainer
} from './AuthForms';


function VerifyOtpForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const [email, setEmail] = useState<string>(location.state?.email || '');
  const [otp, setOtp] = useState('');

  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [resendMessage, setResendMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
      if (location.state?.email) {
          setEmail(location.state.email);
      }
  }, [location.state?.email]);


  const verifyMutation: UseMutationResult<ApiResponse<any>, any, VerifyOtpPayload, unknown> = useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyEmailWithOtp(payload),
    onSuccess: async (data: ApiResponse<any>) => {
      console.log('Email verification successful:', data);
      setMessage({
        type: 'success',
        text: data.message || 'Email verified successfully! Redirecting...',
      });
      setOtp('');

      try {
        
        
        const user: User = await queryClient.fetchQuery({
          queryKey: ['userProfile'], 
          queryFn: getLoggedInUserProfile, 
          staleTime: Infinity,
          retry: false,
        });

        console.log('User profile fetched after verification:', user);

        if (user) {
          
          dispatch(setAuthenticated(user)); 
          queryClient.invalidateQueries({ queryKey: ['userProfile'] }); 
          queryClient.invalidateQueries({ queryKey: ["sellerProfile"] }); 

          console.log('Navigating to home page after verification...');
          navigate('/', { replace: true }); 
        } else {
          console.warn('Fetch user profile succeeded after verification but returned no user data. Logging out frontend.');
          dispatch(logout());
          setMessage({ type: 'error', text: 'Verification successful, but failed to load profile data.' });
        }

      } catch (profileError: any) {
        console.error('Failed to fetch user profile after verification:', profileError);
        dispatch(logout());
        setMessage({ type: 'error', text: 'Verification successful, but failed to fetch user profile. Please try logging in again.' });
      }
    },
    onError: (err: any) => {
      console.error('Verification error:', err);
       const errorMessage = err.response?.data?.message
                           || err.message
                           || 'An unexpected error occurred during verification.';
      setMessage({ type: 'error', text: errorMessage });
    },
  });

  const resendMutation: UseMutationResult<ApiResponse<any>, any, ResendOtpPayload, unknown> = useMutation({
    mutationFn: (payload: ResendOtpPayload) => resendPendingRegistrationOtp(payload),
    onSuccess: (data: ApiResponse<any>) => {
      console.log('Resend OTP successful:', data);
      setResendMessage({
        type: 'success',
        text: data.message || 'OTP resent! Please check your email.',
      });
      setMessage(null);
    },
    onError: (err: any) => {
      console.error('Resend OTP error:', err);
      const errorMessage = err.response?.data?.message
                           || err.message
                           || 'An unexpected error occurred while resending OTP.';
      setResendMessage({ type: 'error', text: errorMessage });
      setMessage(null);
    },
  });


  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setResendMessage(null);

    const payload: VerifyOtpPayload = { email, otp };

    verifyMutation.mutate(payload);
  };

  const handleResendOtpClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setResendMessage(null);
      setMessage(null);

      const payload: ResendOtpPayload = { email };

      resendMutation.mutate(payload);
  };


  const isAnyMutationPending = verifyMutation.isPending || resendMutation.isPending;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h2>Verify Your Email</h2>

      <p style={{textAlign: 'center', fontSize: '0.9em', color: '#555'}}>
        Please enter the OTP sent to your email address.
      </p>

      {/* Display verification message */}
      {message && (
          message.type === 'success' ? (
            <SuccessMessage>{message.text}</SuccessMessage>
          ) : (
            <ErrorMessage>{message.text}</ErrorMessage>
          )
      )}
        {/* Display resend message */}
        {resendMessage && (
          resendMessage.type === 'success' ? (
            <SuccessMessage>{resendMessage.text}</SuccessMessage>
          ) : (
            <ErrorMessage>{resendMessage.text}</ErrorMessage>
          )
        )}


      {/* The actual form for OTP input */}
      <form onSubmit={handleVerifySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <FormField>
            <StyledLabel htmlFor="verify-email">Email:</StyledLabel>
            <StyledInput
              id="verify-email"
              type="email"
              value={email}
              onChange={(e:any) => setEmail(e.target.value)}
              required
              disabled={isAnyMutationPending}
            />
          </FormField>

          <FormField>
            <StyledLabel htmlFor="verify-otp">OTP:</StyledLabel>
            <StyledInput
              id="verify-otp"
              type="text"
              value={otp}
              onChange={(e:any) => setOtp(e.target.value)}
              required
                disabled={isAnyMutationPending}
            />
          </FormField>

          <SubmitButton
            type="submit"
            disabled={verifyMutation.isPending}
          >
            {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
          </SubmitButton>
      </form>

      {/* Resend OTP Button */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
           <SecondaryButton
                type="button"
                onClick={handleResendOtpClick}
                disabled={resendMutation.isPending}
           >
                {resendMutation.isPending ? 'Resending...' : 'Resend OTP'}
           </SecondaryButton>
      </div>
    </div>
  );
}

export default VerifyOtpForm;