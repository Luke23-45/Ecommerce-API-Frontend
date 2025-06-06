// src/components/admin/Application/VendorApplications/VendorApplicationDetail.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from 'styled-components';
import styled from 'styled-components'; // For fallback styled components
import {
  FaArrowLeft, FaUserTie, FaBuilding, FaDollarSign, FaIdCard, FaRegAddressCard,
  FaBriefcase, FaFileAlt, FaShieldAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf,
  FaPhone, FaEnvelope, FaGlobe, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaPaperclip, FaSpinner
} from 'react-icons/fa';

// --- Styled Components Imports ---
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
  DocumentLink, // Assuming this comes from a shared or vendor-specific style file
  MemberList,
  MemberItem,
  
} from './VendorApplicationDetail.styles';
import { BasicTextarea } from '../SellerApplications/SellerApplicationDetail.styles';

import { AdminButton } from '../../Dashboard/Common/Common.styles';

import { VendorApplicationStatusBadge,type VendorApplicationStatusType } from './VendorApplicationList.styles';

import AdminSelect from '../../common/AdminSelect/AdminSelect';
import { FormLabel } from '../../common/FormSectionWrapper/FormSectionWrapper.styles';

import {type ISellerStatus as VendorApplicationStatus } from '@/types/seller';

import {type IAddress } from '@/types/seller';


import { useGetVendorApplication as useGetVendorApplicationById,useUpdateVendorProfileStatusById as useUpdateVendorApplicationStatusById } from '@/hooks/admin/application/useVendor';


import { useNotification } from '@/contexts/NotificationContext';

import { getValidNextStatuses as getValidNextVendorStatuses, isRejectionReasonRequired as isVendorRejectionReasonRequired } from '@/utils/applicationUtils';



const FallbackLoadingOverlay = styled.div`
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(255, 255, 255, 0.85); backdrop-filter: blur(4px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 10; border-radius: ${(props) => props.theme.borderRadius.medium || '8px'};
  color: ${(props) => props.theme.colors.adminText || '#333'};
  .spinner-icon { font-size: 2.5rem; color: ${(props) => props.theme.colors.accent1 || 'blue'}; margin-bottom: 1rem; animation: spin 1s linear infinite; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  p { margin: 0; font-size: 1rem; }
`;
const FallbackErrorMessage = styled.div`
  padding: 20px; text-align: center; color: ${(props) => props.theme.colors.adminStatusError || 'red'};
  border: 1px solid ${(props) => props.theme.colors.adminStatusError || 'red'}; margin: 20px;
  background-color: ${(props) => props.theme.colors.adminErrorBg || 'rgba(255,0,0,0.05)'};
  border-radius: ${(props) => props.theme.borderRadius.medium || '8px'};
  button { margin-top: 10px; }
`;
// --- End Fallbacks ---

type ApplicationActionForHeader = 'approve' | 'reject' | 'suspend' | 'activate' | 'deactivate' | 'close' | 'withdraw';

interface VendorApplicationDetailProps {
  applicationId: string | null;
  onBackToList: () => void;
  onApplicationAction: (
    applicationId: string,
    applicationType: 'vendor',
    action: ApplicationActionForHeader,
    applicantName: string, // Company Name
    rejectionReason?: string
  ) => void;
}

const ALL_VENDOR_STATUS_LABELS: Record<VendorApplicationStatus, string> = {
  pending: 'Pending Review',
  approved: 'Approved (Needs Activation)',
  active: 'Active',
  inactive: 'Made Inactive',
  rejected: 'Rejected',
  suspended: 'Suspended',
  closed: 'Closed by Admin',
  withdrawn: 'Withdrawn by Applicant',
  // Add other vendor-specific statuses like 'processing' if you have them in VendorApplicationStatus type
  processing: 'Processing', // Example if you add it
};

const VendorApplicationDetail: React.FC<VendorApplicationDetailProps> = ({
  applicationId,
  onBackToList,
  onApplicationAction,
}) => {
  const theme = useTheme();
  const { showNotification } = useNotification();
  const [newStatus, setNewStatus] = useState<VendorApplicationStatus | ''>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const {
    data: application, // IVendorProfile | undefined
    error: fetchError,
    isError,
    isLoading,
    refetch,
  } = useGetVendorApplicationById(applicationId, {
    enabled: !!applicationId,
    onSuccess: (fetchedApplication) => {
      if (fetchedApplication) {
        setNewStatus(''); // Reset dropdown to "Select..." when new data loads
      }
    },
  });

  const { mutate: updateStatusMutation, isPending: isUpdatingStatus } =
    useUpdateVendorApplicationStatusById();

  useEffect(() => {
    if (application) {
      if (newStatus && newStatus !== application.status) {
        const validNext = getValidNextVendorStatuses(application.status);
        if (!validNext.includes(newStatus as VendorApplicationStatus)) {
          setNewStatus(''); // Reset if selection becomes invalid due to app status change
        }
      }
      if (application.status !== 'rejected') {
        setRejectionReason('');
      }
    } else {
      setNewStatus('');
      setRejectionReason('');
    }
  }, [application, newStatus]);


  const validStatusOptions = useMemo(() => {
    if (!application?.status) {
      return [{ value: '', label: 'Select New Status...', disabled: true }];
    }
    const nextStatuses = getValidNextVendorStatuses(application.status);
    const options = nextStatuses.map(status => ({
      value: status,
      label: ALL_VENDOR_STATUS_LABELS[status] || status.charAt(0).toUpperCase() + status.slice(1),
    }));
    return [{ value: '', label: 'Select a New Status...', disabled: true }, ...options];
  }, [application?.status]);

  const handleLocalStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value as VendorApplicationStatus | '';
    setNewStatus(selectedStatus);
    if (selectedStatus !== 'rejected') {
      setRejectionReason('');
    }
  }, []);

  const handleRejectionReasonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRejectionReason(e.target.value);
  }, []);

  const handleUpdateStatusFromDropdown = useCallback(async () => {
    if (!application || !newStatus || newStatus === '') {
      showNotification("Please select a valid new status.", "warning");
      return;
    }
    if (newStatus === application.status && (newStatus !== 'rejected' || rejectionReason === (application as any).rejectionReason)) {
      showNotification("No changes to save.", "info");
      return;
    }
    if (newStatus !== application.status && !getValidNextVendorStatuses(application.status).includes(newStatus as VendorApplicationStatus) ) {
         showNotification(`Transition from '${application.status}' to '${newStatus}' is not allowed.`, "error");
         return;
    }
    if (isVendorRejectionReasonRequired(newStatus as VendorApplicationStatus) && !rejectionReason.trim()) {
      showNotification("Rejection reason is required when changing status to 'Rejected'.", "error");
      return;
    }

    const payload: { status: VendorApplicationStatus; rejectionReason?: string } = {
      status: newStatus as VendorApplicationStatus,
    };
    if (isVendorRejectionReasonRequired(newStatus as VendorApplicationStatus)) {
      payload.rejectionReason = rejectionReason.trim();
    }

    updateStatusMutation(
      { applicationId: application._id, ...payload }, // Variables for mutation hook
      {
        onSuccess: (response) => {
          showNotification(`Application status successfully updated to ${response.data?.status || newStatus}!`, "success");
          setRejectionReason('');
          // setNewStatus(''); // Let useEffect handle resetting this based on refetched 'application'
        },
        onError: (error: Error) => {
          showNotification(`Failed to update status: ${error.message}`, "error");
        },
      }
    );
  }, [application, newStatus, rejectionReason, updateStatusMutation, showNotification]);

  const formatDate = (dateString?: string | Date | number): string => {
    if (!dateString) return 'N/A';
    try { return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch (error) { return "Invalid Date"; }
  };
  const formatBoolean = (value?: boolean): React.ReactNode => {
    if (value === undefined || value === null) return <span style={{ fontStyle: 'italic' }}>N/A</span>;
    return value ? <span className="boolean-true" style={{ color: theme.colors.adminStatusSuccess || 'green' }}>Yes</span> : <span className="boolean-false" style={{ color: theme.colors.adminStatusError || 'red' }}>No</span>;
  };
  const renderAddress = (address?: IAddress): string => {
    if (!address) return 'N/A';
    return `${address.street || ''}, ${address.city || ''}, ${address.state || ''} ${address.zip || ''}, ${address.country || ''}`.replace(/, ,/g, ', ').replace(/^, |, $/g, '').trim() || 'N/A';
  };

  if (!applicationId) {
    return (
      <DetailContainer>
        <AdminButton $variant="secondary" onClick={onBackToList} style={{ alignSelf: 'flex-start' }}>
          <FaArrowLeft style={{marginRight: theme.spacing(1)}} /> Back
        </AdminButton>
        <InfoBox><p>No application ID provided. Please select an application from the list.</p></InfoBox>
      </DetailContainer>
    );
  }
  if (isLoading) {
    return (
      <DetailContainer>
        <AdminButton $variant="secondary" onClick={onBackToList} style={{ alignSelf: 'flex-start', marginBottom: theme.spacing(4)}}>
            <FaArrowLeft style={{marginRight: theme.spacing(1)}}/> Back
        </AdminButton>
        <FallbackLoadingOverlay>
            <FaSpinner className="spinner-icon" /> <p>Loading Vendor Application...</p>
        </FallbackLoadingOverlay>
      </DetailContainer>
    );
  }
  if (isError || !application) {
    return (
      <DetailContainer>
        <AdminButton $variant="secondary" onClick={onBackToList} style={{ alignSelf: 'flex-start', marginBottom: theme.spacing(4) }}>
          <FaArrowLeft style={{marginRight: theme.spacing(1)}}/> Back
        </AdminButton>
        <FallbackErrorMessage>
          <p>{fetchError?.message || `Vendor Application with ID "${applicationId}" not found or failed to load.`}</p>
          <AdminButton $variant="neutral" onClick={() => refetch()}>Try Again</AdminButton>
        </FallbackErrorMessage>
      </DetailContainer>
    );
  }

  const doc = application.businessDocument;
  const businessDocumentDisplay = doc ? (typeof doc === 'string' ? doc : doc.name) : 'N/A';
  const businessDocumentUrl = doc && typeof doc !== 'string' ? doc.url : '#';

  const currentAppStatus = application.status;
  const validNextForHeader = getValidNextVendorStatuses(currentAppStatus);

  return (
    <DetailContainer>
      <AdminButton $variant="secondary" onClick={onBackToList} style={{ alignSelf: 'flex-start', marginBottom: theme.spacing(4) }}>
        <FaArrowLeft style={{marginRight: theme.spacing(1)}} /> Back to List
      </AdminButton>

      <DetailHeader>
        <HeaderInfo>
          <h2><FaBuilding style={{marginRight: theme.spacing(2)}} /> {application.companyName}</h2>
          <span className="applicant-id">App ID: {application._id}</span>
          <span className="applicant-id">Contact User ID: {typeof application.userId === 'string' ? application.userId : (application.userId as any)?._id || 'N/A'}</span>
        </HeaderInfo>
        <HeaderActions>
          {validNextForHeader.includes('approved') && (currentAppStatus === 'pending' || currentAppStatus === 'submitted' || currentAppStatus === 'processing') && (
            <AdminButton $variant="success" onClick={() => onApplicationAction(application._id, 'vendor', 'approve', application.companyName)}>
              <FaCheckCircle style={{marginRight: theme.spacing(1)}} /> Approve App
            </AdminButton>
          )}
          {validNextForHeader.includes('rejected') && (currentAppStatus === 'pending' || currentAppStatus === 'submitted' || currentAppStatus === 'processing') && (
            <AdminButton $variant="danger" onClick={() => {
              const reason = prompt("Reason for rejection (required for header action):");
              if (reason === null) return;
              if (!reason.trim() && isVendorRejectionReasonRequired('rejected')) {
                  showNotification("Rejection reason is required.", "error"); return;
              }
              onApplicationAction(application._id, 'vendor', 'reject', application.companyName, reason.trim() || undefined);
            }}><FaTimesCircle style={{marginRight: theme.spacing(1)}} /> Reject App</AdminButton>
          )}
          {validNextForHeader.includes('active') && currentAppStatus === 'approved' && (
            <AdminButton $variant="success" onClick={() => onApplicationAction(application._id, 'vendor', 'activate', application.companyName)}>
              <FaCheckCircle style={{marginRight: theme.spacing(1)}} /> Activate Vendor
            </AdminButton>
          )}
          {validNextForHeader.includes('suspended') && currentAppStatus === 'active' && (
            <AdminButton $variant="warning" onClick={() => onApplicationAction(application._id, 'vendor', 'suspend', application.companyName)}>
              <FaHourglassHalf style={{marginRight: theme.spacing(1)}} /> Suspend Vendor
            </AdminButton>
          )}
          {validNextForHeader.includes('inactive') && currentAppStatus === 'active' && (
             <AdminButton $variant="danger" onClick={() => onApplicationAction(application._id, 'vendor', 'deactivate', application.companyName)}>
              <FaTimesCircle style={{marginRight: theme.spacing(1)}} /> Deactivate Vendor
            </AdminButton>
          )}
        </HeaderActions>
      </DetailHeader>

      <DetailLayout>
        <MainContentColumn>
            <InfoBox>
                <InfoSectionTitle><FaBuilding /> Company Information</InfoSectionTitle>
                <InfoGrid>
                    <InfoItem><label>Company Name</label> <p>{application.companyName}</p></InfoItem>
                    <InfoItem><label>Business Reg. No.</label> <p>{application.businessRegistrationNumber || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Legal Entity Type</label> <p>{application.legalEntityType?.toUpperCase() || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Year Established</label> <p>{application.yearEstablished || 'N/A'}</p></InfoItem>
                    <InfoItem $fullWidth><label>Website</label> {application.website ? <a href={application.website.startsWith('http') ? application.website : `//${application.website}`} target="_blank" rel="noopener noreferrer"><FaGlobe style={{marginRight: theme.spacing(1)}}/> {application.website}</a> : <p>N/A</p>}</InfoItem>
                    <InfoItem $fullWidth><label>Company Address</label> <p><FaMapMarkerAlt style={{marginRight: theme.spacing(1)}} /> {renderAddress(application.companyAddress)}</p></InfoItem>
                </InfoGrid>
            </InfoBox>

            <InfoBox>
                <InfoSectionTitle><FaUserTie /> Contact Person</InfoSectionTitle>
                <InfoGrid>
                    <InfoItem><label>Full Name</label> <p>{application.contactPersonFirstName} {application.contactPersonLastName}</p></InfoItem>
                    <InfoItem><label>Email</label> <p><FaEnvelope style={{marginRight: theme.spacing(1)}}/> {application.contactPersonEmail}</p></InfoItem>
                    <InfoItem><label>Phone</label> <p><FaPhone style={{marginRight: theme.spacing(1)}}/> {application.contactPersonPhone || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Role</label> <p>{application.contactPersonRole || 'N/A'}</p></InfoItem>
                </InfoGrid>
            </InfoBox>

            <InfoBox>
                <InfoSectionTitle><FaBriefcase /> Business Details & Categories</InfoSectionTitle>
                <InfoGrid>
                    <InfoItem><label>Primary Categories</label> <p>{application.primaryProductCategories?.join(', ') || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Est. Monthly Sales</label> <p><FaDollarSign style={{marginRight: theme.spacing(1)}} /> {application.estimatedMonthlySales?.toLocaleString() || 'N/A'}</p></InfoItem>
                    <InfoItem $fullWidth><label>Business Document</label>
                        {doc ? (
                            <DocumentLink href={businessDocumentUrl} target="_blank" rel="noopener noreferrer">
                                {typeof doc !== 'string' && doc.type?.includes('image') ? <img src={doc.url} alt={doc.name} style={{maxWidth: '150px', maxHeight: '150px', objectFit: 'contain', border: `1px solid ${theme.colors.adminBorder || '#ddd'}`, borderRadius: theme.borderRadius?.small || '4px'}}/> : <FaPaperclip style={{marginRight: theme.spacing(1)}}/>}
                                {businessDocumentDisplay}
                            </DocumentLink>
                        ) : <p>N/A</p>}
                    </InfoItem>
                </InfoGrid>
            </InfoBox>
        </MainContentColumn>

        <SidebarContentColumn>
            <InfoBox>
                <InfoSectionTitle><FaIdCard /> Financial & Tax Information</InfoSectionTitle>
                <InfoGrid style={{gridTemplateColumns: '1fr'}}>
                    <InfoItem><label>Company Tax ID</label> <p>{application.companyTaxId || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Business Bank Name</label> <p>{application.businessBankName || 'N/A'}</p></InfoItem>
                    <InfoItem><label>Business Acct No.</label> <p>****{application.businessBankAccountNumber?.slice(-4) || '****'}</p></InfoItem>
                </InfoGrid>
            </InfoBox>

            <InfoBox>
                <InfoSectionTitle><FaUsers /> Vendor Team Members</InfoSectionTitle>
                {application.members && application.members.length > 0 ? (
                <MemberList>
                    {application.members.map((member, index) => (
                    <MemberItem key={(member.userId || 'member') + index}> {/* More robust key */}
                        <span className="member-id">User ID: {member.userId || 'N/A'}</span>
                        <span className="member-roles">{member.roles?.join(', ').replace(/_/g, ' ') || 'No roles'}</span>
                        {member.addedAt && <span className="added-info">Added: {formatDate(member.addedAt)} by {member.addedBy || 'System'}</span>}
                    </MemberItem>
                    ))}
                </MemberList>
                ) : (<p style={{color: theme.colors.adminTextSecondary, fontStyle: 'italic'}}>No additional team members.</p>)}
            </InfoBox>

            <InfoBox>
                <InfoSectionTitle><FaShieldAlt /> Agreements</InfoSectionTitle>
                <InfoGrid style={{gridTemplateColumns: '1fr'}}>
                <InfoItem><label>Agreed to Terms</label> {formatBoolean(application.agreedToTerms)}</InfoItem>
                <InfoItem><label>Agreed to Privacy Policy</label> {formatBoolean(application.agreedToPrivacyPolicy)}</InfoItem>
                </InfoGrid>
            </InfoBox>

            <InfoBox>
                <InfoSectionTitle><FaFileAlt /> Application Status</InfoSectionTitle>
                <CurrentStatusDisplay>
                <strong>Current Status:</strong>
                <VendorApplicationStatusBadge $status={application.status as VendorApplicationStatusType}>
                    {ALL_VENDOR_STATUS_LABELS[application.status as VendorApplicationStatusType] || application.status.toUpperCase()}
                </VendorApplicationStatusBadge>
                </CurrentStatusDisplay>
                <InfoGrid style={{gridTemplateColumns: '1fr'}}>
                    <InfoItem><label>Submitted On:</label> <p><FaCalendarAlt style={{marginRight: theme.spacing(1)}}/> {formatDate(application.createdAt)}</p></InfoItem>
                    <InfoItem><label>Last Updated:</label> <p><FaCalendarAlt style={{marginRight: theme.spacing(1)}}/> {formatDate(application.updatedAt)}</p></InfoItem>
                    {application.approvedBy && <InfoItem><label>Processed By:</label><p>{typeof application.approvedBy === 'string' ? application.approvedBy : (application.approvedBy as any)?.name || 'System'}</p></InfoItem>}
                    {application.activatedAt && <InfoItem><label>Activated On:</label><p><FaCalendarAlt style={{marginRight: theme.spacing(1)}}/> {formatDate(application.activatedAt)}</p></InfoItem>}
                </InfoGrid>

                <ActionPanel>
                    <FormLabel htmlFor="statusChangeSelectVendor">Change Status To:</FormLabel>
                    <AdminSelect
                        id="statusChangeSelectVendor"
                        value={newStatus}
                        onChange={handleLocalStatusChange}
                        options={validStatusOptions}
                    />
                    {newStatus === 'rejected' && (
                        <div style={{ marginTop: theme.spacing(3), width: '100%' }}>
                        <FormLabel htmlFor="rejectionReasonInputVendor">Rejection Reason (Required):</FormLabel>
                        <BasicTextarea // Use your actual styled BasicTextarea
                            id="rejectionReasonInputVendor"
                            value={rejectionReason}
                            onChange={handleRejectionReasonChange}
                            placeholder="Provide a clear reason for rejection..."
                            rows={3}
                            style={{ width: '100%', marginTop: theme.spacing(1), resize: 'vertical' }}
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
                            (isVendorRejectionReasonRequired(newStatus as VendorApplicationStatus) && !rejectionReason.trim())
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

export default VendorApplicationDetail;