// src/components/admin/Application/SellerApplications/SellerApplicationDetail.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from 'styled-components';
import {
  FaArrowLeft, FaUserCircle, FaBuilding, FaDollarSign, FaIdCard, FaRegAddressCard,
  FaBriefcase, FaFileAlt, FaShieldAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf,
  FaPhone, FaEnvelope, FaGlobe, FaCalendarAlt, FaMapMarkerAlt,
  FaPaperclip, FaSpinner
} from 'react-icons/fa';

import {
  DetailContainer,
  DetailHeader,
  HeaderInfo,
  HeaderActions,
  DetailLayout,
  MainContentColumn,
  SidebarContentColumn,
  InfoBox,
  InfoSectionTitle,
  InfoGrid,
  InfoItem,
  CurrentStatusDisplay,
  ActionPanel,
  // BasicInput, // Remove if BasicTextarea covers it or not used
  BasicTextarea // Make sure this is imported from your styles if you have it
} from './SellerApplicationDetail.styles';
// Assuming DocumentLink might be in a shared place or Vendor specific for now
import { DocumentLink } from '../VendorApplications/VendorApplicationDetail.styles';
// Import styled components if they were created globally, or define fallback/inline
import styled from 'styled-components'; // Keep for fallback if needed

import { AdminButton } from '../../Dashboard/Common/Common.styles';
import { ApplicationStatusBadge } from './SellerApplicationList.styles'; // Assuming path, not list.styles
import AdminSelect from '../../common/AdminSelect/AdminSelect';
import { FormLabel } from '../../common/FormSectionWrapper/FormSectionWrapper.styles';

import type { IIndividualSellerProfile, IAddress, ISellerStatus as IndividualSellerProfileStatus } from '@/types/seller'; // Path for seller types
import {
    useGetIndividualSellerApplication as useGetIndividualSellerApplicationById,        
    useUpdateIndividualSellerProfileStatusById   
} from '@/hooks/admin/application/useSeller'; 

// Helper utilities
import { getValidNextStatuses, isRejectionReasonRequired } from '@/utils/applicationUtils';
import { useNotification } from '@/contexts/NotificationContext';


// --- Fallback Styled Components (Define in Detail.styles.ts or a shared file preferably) ---
const FallbackLoadingOverlay = styled.div`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(255, 255, 255, 0.85); backdrop-filter: blur(4px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 10; border-radius: ${(props) => props.theme.borderRadius.medium};
  color: ${(props) => props.theme.colors.adminText};
  .spinner-icon { font-size: 2.5rem; color: ${(props) => props.theme.colors.accent1}; margin-bottom: 1rem; animation: spin 1s linear infinite; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  p { margin: 0; font-size: 1rem; }
`;
const FallbackErrorMessage = styled.div`
  padding: 20px; text-align: center; color: ${(props) => props.theme.colors.adminStatusError};
  border: 1px solid ${(props) => props.theme.colors.adminStatusError}; margin: 20px;
  background-color: ${(props) => props.theme.colors.adminErrorBg || 'rgba(255,0,0,0.05)'};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  button { margin-top: 10px; }
`;
// Fallback for BasicTextarea if not defined in SellerApplicationDetail.styles.ts
// It's better to import this from a common/FormControls/FormControls.styles.ts file
// const FallbackBasicTextarea = styled.textarea` /* ... common input styles ... */ `;
// --- End Fallbacks ---

type ApplicationActionForHeader = 'approve' | 'reject' | 'suspend';

interface SellerApplicationDetailProps {
  applicationId: string | null;
  onBackToList: () => void;
  onApplicationAction: (
    applicationId: string,
    applicationType: 'seller' | 'vendor',
    action: ApplicationActionForHeader,
    applicantName: string,
    rejectionReason?: string
  ) => void;
}

const ALL_POSSIBLE_STATUS_LABELS: Record<IndividualSellerProfileStatus, string> = {
  submitted: 'Submitted (Needs Review)',
  processing: 'Processing Application',
  approved: 'Approved',
  active: 'Active (Live)',
  inactive: 'Inactive',
  rejected: 'Rejected',
  suspended: 'Suspended',
  withdrawn: 'Withdrawn by Applicant',
  closed: 'Closed by Admin',
};

const SellerApplicationDetail: React.FC<SellerApplicationDetailProps> = ({
  applicationId,
  onBackToList,
  onApplicationAction,
}) => {
  const theme = useTheme();
  const { showNotification } = useNotification(); // Get notification function

  const [newStatus, setNewStatus] = useState<IndividualSellerProfileStatus | ''>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const {
    data: application, // This is IIndividualSellerProfile | undefined
    error: fetchError,
    isError,
    isLoading,
    refetch,
  } = useGetIndividualSellerApplicationById(applicationId, { // Hook to fetch ONE application
    enabled: !!applicationId, // Only run if applicationId exists
    onSuccess: (fetchedApplication) => {
      if (fetchedApplication) {
        setNewStatus(''); // Always reset to "Select..."
      }
    },
  });

  const { mutate: updateStatusMutation, isPending: isUpdatingStatus } =
    useUpdateIndividualSellerProfileStatusById();

  // Effect to reset newStatus if application.status changes due to external factors/refetch
  // and to clear rejection reason if status is no longer 'rejected'
  useEffect(() => {
    if (application) {
      // setNewStatus(application.status || ''); // No, we want user to pick from valid *next* states
      if (newStatus !== '' && application.status !== newStatus) {
         // If a newStatus was selected, but then application.status changed (e.g. another admin updated it)
         // and the selected newStatus is no longer valid for the *new* current application.status,
         // then reset the selection.
         const validNext = getValidNextStatuses(application.status);
         if (!validNext.includes(newStatus as IndividualSellerProfileStatus)) {
            setNewStatus('');
         }
      }
      if (application.status !== 'rejected') {
        setRejectionReason('');
      }
    } else {
      setNewStatus('');
      setRejectionReason('');
    }
  }, [application, newStatus]); // Added newStatus to dependencies

  const validStatusOptions = useMemo(() => {
    if (!application?.status) {
      return [{ value: '', label: 'Select New Status...', disabled: true }];
    }
    const nextStatuses = getValidNextStatuses(application.status);
    const options = nextStatuses.map(status => ({
      value: status,
      label: ALL_POSSIBLE_STATUS_LABELS[status] || status.charAt(0).toUpperCase() + status.slice(1),
    }));
    return [{ value: '', label: 'Select a New Status...', disabled: true }, ...options];
  }, [application?.status]);

  const handleLocalStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value as IndividualSellerProfileStatus | '';
    setNewStatus(selectedStatus);
    if (selectedStatus !== 'rejected') {
      setRejectionReason('');
    }
  }, []);

  const handleRejectionReasonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => { // Accept Input too
    setRejectionReason(e.target.value);
  }, []);

  const handleUpdateStatusFromDropdown = useCallback(async () => {
    if (!application || !newStatus || newStatus === '') {
      showNotification("Please select a valid new status from the dropdown.", "warning");
      return;
    }
    if (newStatus === application.status) {
        showNotification("No change in status selected.", "info");
        return;
    }
    // Client-side validation from utils (though dropdown should prevent this)
    if (!getValidNextStatuses(application.status).includes(newStatus as IndividualSellerProfileStatus)) {
        showNotification(`Transition from '${application.status}' to '${newStatus}' is not allowed.`, "error");
        return;
    }
    if (isRejectionReasonRequired(newStatus as IndividualSellerProfileStatus) && !rejectionReason.trim()) {
      showNotification("Rejection reason is required for this status.", "error");
      return;
    }

    const payload: { status: IndividualSellerProfileStatus; rejectionReason?: string } = {
      status: newStatus as IndividualSellerProfileStatus,
    };
    if (isRejectionReasonRequired(newStatus as IndividualSellerProfileStatus)) {
      payload.rejectionReason = rejectionReason.trim();
    }

    updateStatusMutation(
      { applicationId: application._id, ...payload },
      {
        onSuccess: (response) => {
          showNotification(`Application status updated to ${response.data?.status || newStatus}!`, "success");
          // Invalidation in the hook will trigger refetch. `onSuccess` of useGetIndividualSellerApplicationById
          // will then reset `newStatus` to `''`.
          setRejectionReason('');
        },
        onError: (error: Error) => {
          showNotification(`Failed to update status: ${error.message}`, "error");
        },
      }
    );
  }, [application, newStatus, rejectionReason, updateStatusMutation, showNotification]);

  const formatDate = (dateString?: string | Date): string => { /* ... (your existing formatter) ... */ return "N/A" };
  const formatBoolean = (value?: boolean): React.ReactNode => { /* ... (your existing formatter) ... */ return <span style={{fontStyle: 'italic'}}>N/A</span> };
  const renderAddress = (address?: IAddress): string => { /* ... (your existing formatter) ... */ return "N/A" };

  if (!applicationId) {
    return (
      <DetailContainer>
        <AdminButton $variant="secondary" onClick={onBackToList} style={{ alignSelf: 'flex-start' }}>
          <FaArrowLeft style={{marginRight: theme.spacing(1)}} /> Back to List
        </AdminButton>
        <InfoBox><p>No application ID provided.</p></InfoBox>
      </DetailContainer>
    );
  }

  if (isLoading) {
    return (
      <DetailContainer>
        <AdminButton $variant="secondary" onClick={onBackToList} style={{ alignSelf: 'flex-start', marginBottom: theme.spacing(4)}}>
            <FaArrowLeft style={{marginRight: theme.spacing(1)}}/> Back to List
        </AdminButton>
        <FallbackLoadingOverlay>
            <FaSpinner className="spinner-icon" />
            <p>Loading Application Details...</p>
        </FallbackLoadingOverlay>
      </DetailContainer>
    );
  }

  if (isError || !application) { // Check !application here too
    return (
      <DetailContainer>
        <AdminButton $variant="secondary" onClick={onBackToList} style={{ alignSelf: 'flex-start', marginBottom: theme.spacing(4) }}>
          <FaArrowLeft style={{marginRight: theme.spacing(1)}}/> Back to List
        </AdminButton>
        <FallbackErrorMessage>
          <p>{fetchError?.message || `Application with ID "${applicationId}" not found or failed to load.`}</p>
          <AdminButton $variant="neutral" onClick={() => refetch()}>Try Again</AdminButton>
        </FallbackErrorMessage>
      </DetailContainer>
    );
  }

  const documentToDisplay = application.documentURI ? {
    name: application.documentURI.split('/').pop() || "Attached Document",
    url: application.documentURI,
    type: application.documentURI.endsWith('.pdf') ? 'application/pdf' : (application.documentURI.match(/\.(jpeg|jpg|gif|png)$/) != null ? 'image/jpeg' : 'application/octet-stream')
  } : null;

  const currentAppStatus = application.status;
  const validNextForHeader = getValidNextStatuses(currentAppStatus);

  return (
    <DetailContainer>
      <AdminButton $variant="secondary" onClick={onBackToList} style={{ alignSelf: 'flex-start', marginBottom: theme.spacing(4) }}>
        <FaArrowLeft style={{marginRight: theme.spacing(1)}} /> Back to List
      </AdminButton>

      <DetailHeader>
        <HeaderInfo>
          <h2>{application.sellerName}</h2>
          <span className="applicant-id">App ID: {application._id}</span>
          <span className="applicant-id">User ID: {typeof application.userId === 'string' ? application.userId : (application.userId as any)?._id || 'N/A'}</span>
        </HeaderInfo>
        <HeaderActions>
          {validNextForHeader.includes('approved') && (
            <AdminButton $variant="success" onClick={() => onApplicationAction(application._id, 'seller', 'approve', application.sellerName)}>
              <FaCheckCircle style={{marginRight: theme.spacing(1)}} /> Approve
            </AdminButton>
          )}
          {validNextForHeader.includes('rejected') && (
            <AdminButton $variant="danger" onClick={() => {
              const reason = prompt("Reason for rejection (header action):");
              if (reason === null) return;
              if (!reason.trim() && isRejectionReasonRequired('rejected')) {
                  showNotification("Rejection reason is required.", "error");
                  return;
              }
              onApplicationAction(application._id, 'seller', 'reject', application.sellerName, reason.trim() || undefined);
            }}>
              <FaTimesCircle style={{marginRight: theme.spacing(1)}} /> Reject
            </AdminButton>
          )}
          {validNextForHeader.includes('suspended') && (
             <AdminButton $variant="warning" onClick={() => onApplicationAction(application._id, 'seller', 'suspend', application.sellerName)}>
              <FaHourglassHalf style={{marginRight: theme.spacing(1)}} /> Suspend
            </AdminButton>
          )}
           {/* Example for "Activate" if 'active' is a valid next state from current and meets conditions */}
          {validNextForHeader.includes('active') && (currentAppStatus === 'approved' || currentAppStatus === 'inactive') && (
             <AdminButton $variant="info" onClick={() => onApplicationAction(application._id, 'seller', 'approve', application.sellerName /* Adjust action if 'activate' is different */ )}>
                 Activate
            </AdminButton>
          )}
        </HeaderActions>
      </DetailHeader>

      <DetailLayout>
        <MainContentColumn>
            {/* Your InfoBox sections for Personal, Address, Business Info */}
            <InfoBox>
                <InfoSectionTitle><FaUserCircle /> Personal & Contact</InfoSectionTitle>
                <InfoGrid>
                    <InfoItem><label>Seller Display Name</label> <p>{application.sellerName || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Legal First Name</label> <p>{application.legalFirstName || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Legal Last Name</label> <p>{application.legalLastName || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Date of Birth</label> <p>{formatDate(application.dateOfBirth)}</p></InfoItem>
                    <InfoItem><label>Citizenship</label> <p>{application.citizenshipCountry || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Phone</label> <p><FaPhone size="0.9em" style={{ marginRight: theme.spacing(1) }}/> {application.phoneNumber || 'N/A'}</p></InfoItem>
                </InfoGrid>
            </InfoBox>
            <InfoBox>
                <InfoSectionTitle><FaRegAddressCard /> Address</InfoSectionTitle>
                <InfoGrid $columns={1}> {/* Prop for styled-component if it supports it */}
                    <InfoItem $fullWidth><label>Full Address</label> <p><FaMapMarkerAlt size="0.9em" style={{ marginRight: theme.spacing(1) }} /> {renderAddress(application.address)}</p></InfoItem>
                </InfoGrid>
            </InfoBox>
             <InfoBox>
                <InfoSectionTitle><FaBriefcase /> Business Info</InfoSectionTitle>
                <InfoGrid>
                    <InfoItem><label>Primary Categories</label> <p>{application.primaryProductCategories?.join(', ') || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Est. Monthly Sales</label> <p><FaDollarSign size="0.9em" style={{ marginRight: theme.spacing(1) }}/> {application.estimatedMonthlySales?.toLocaleString() || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Years Selling</label> <p>{application.yearsOfSellingExperience ?? 'N/A'} years</p></InfoItem>
                    <InfoItem $fullWidth><label>Other Platforms</label> <p>{application.otherPlatformsSoldOn || 'N/A'}</p></InfoItem>
                    <InfoItem $fullWidth><label>Description</label> <p style={{ whiteSpace: 'pre-wrap'}}>{application.briefDescription || 'N/A'}</p></InfoItem>
                    <InfoItem $fullWidth><label>Document</label>
                        {documentToDisplay ? (
                            <DocumentLink href={documentToDisplay.url} target="_blank" rel="noopener noreferrer">
                                {documentToDisplay.type?.includes('image') ?
                                    <img src={documentToDisplay.url} alt={documentToDisplay.name} style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'contain', border: `1px solid ${theme.colors.adminBorder}`, borderRadius: theme.borderRadius.small }}/> :
                                    <FaPaperclip style={{ marginRight: theme.spacing(1) }} />
                                }
                                {documentToDisplay.name}
                            </DocumentLink>
                        ) : <p>N/A</p>}
                    </InfoItem>
                </InfoGrid>
            </InfoBox>
        </MainContentColumn>

        <SidebarContentColumn>
            <InfoBox>
                <InfoSectionTitle><FaIdCard /> Identity & Payout</InfoSectionTitle>
                <InfoGrid style={{ gridTemplateColumns: '1fr' }}>
                    <InfoItem><label>Tax ID</label> <p>{application.taxIdentificationNumber || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Payout Method</label> <p>{application.payoutMethodPreference?.replace(/_/g, ' ').toUpperCase() || 'N/A'}</p></InfoItem>
                    {application.payoutMethodPreference === 'bank_transfer' && (
                        <>
                            <InfoItem><label>Acct Holder</label> <p>{application.bankAccountHolderName || 'N/A'}</p></InfoItem>
                            <InfoItem><label>Acct Number</label> <p>****{application.bankAccountNumber?.slice(-4) || '****'}</p></InfoItem>
                        </>
                    )}
                </InfoGrid>
            </InfoBox>
            <InfoBox>
                <InfoSectionTitle><FaShieldAlt /> Agreements</InfoSectionTitle>
                <InfoGrid style={{ gridTemplateColumns: '1fr' }}>
                    <InfoItem><label>Terms Agreed</label> {formatBoolean(application.agreedToTerms)}</InfoItem>
                    <InfoItem><label>Privacy Policy Agreed</label> {formatBoolean(application.agreedToPrivacyPolicy)}</InfoItem>
                </InfoGrid>
            </InfoBox>
            <InfoBox> {/* Application Status & History section */}
                <InfoSectionTitle><FaFileAlt /> Application Status</InfoSectionTitle>
                <CurrentStatusDisplay>
                <strong>Current Status:</strong>
                <ApplicationStatusBadge $status={application.status}>
                    {ALL_POSSIBLE_STATUS_LABELS[application.status] || application.status.toUpperCase()}
                </ApplicationStatusBadge>
                </CurrentStatusDisplay>
                <InfoGrid style={{gridTemplateColumns: '1fr'}}>
                    <InfoItem><label>Submitted On</label> <p><FaCalendarAlt size="0.9em" style={{marginRight: theme.spacing(1)}}/> {formatDate(application.createdAt)}</p></InfoItem>
                    <InfoItem><label>Last Updated</label> <p><FaCalendarAlt size="0.9em" style={{marginRight: theme.spacing(1)}}/> {formatDate(application.updatedAt)}</p></InfoItem>
                </InfoGrid>

                <ActionPanel>
                <FormLabel htmlFor="statusChangeSelect">Change Status To:</FormLabel>
                <AdminSelect
                    id="statusChangeSelect"
                    value={newStatus} // Controlled by newStatus state
                    onChange={handleLocalStatusChange}
                    options={validStatusOptions}
                />
                {newStatus === 'rejected' && (
                    <div style={{ marginTop: theme.spacing(3), width: '100%' }}>
                    <FormLabel htmlFor="rejectionReasonInput">Rejection Reason (Required):</FormLabel>
                    <BasicTextarea // This needs to be your styled BasicTextarea
                        id="rejectionReasonInput"
                        value={rejectionReason}
                        onChange={handleRejectionReasonChange}
                        placeholder="Provide a clear reason for rejection..."
                        rows={3}
                        style={{ width: '100%', marginTop: theme.spacing(1), resize: 'vertical' }} // Added resize
                    />
                    </div>
                )}
                <AdminButton
                    $variant="primary"
                    onClick={handleUpdateStatusFromDropdown}
                    disabled={
                        !newStatus ||
                        newStatus === application.status ||
                        isUpdatingStatus ||
                        (isRejectionReasonRequired(newStatus as IndividualSellerProfileStatus) && !rejectionReason.trim())
                    }
                    style={{ marginTop: theme.spacing(3), width: '100%' }}
                >
                    {isUpdatingStatus ? <FaSpinner style={{ marginRight: theme.spacing(1), animation: 'spin 1s linear infinite' }}/> : null}
                    Save Status Change
                </AdminButton>
                </ActionPanel>
            </InfoBox>
        </SidebarContentColumn>
      </DetailLayout>
    </DetailContainer>
  );
};

export default SellerApplicationDetail;