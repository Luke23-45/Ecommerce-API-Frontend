// src/components/Admin/Customers/CustomerDetail.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from 'styled-components';
import { FaArrowLeft, FaEdit, FaTrashAlt, FaUserCircle, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaUserPlus, FaCalendarAlt, FaEye, FaDollarSign, FaBox, FaSyncAlt, FaPencilAlt } from 'react-icons/fa';

import {
  CustomerDetailContainer,
  CustomerDetailHeader,
  CustomerInfoGroup,
  CustomerMetrics,
  CustomerDetailLayout,
  MainContentColumn,
  SidebarContentColumn,
  StickyActionBar,
  InfoSectionTitle,
  InfoGrid,
  AddressCard,
  AddressActions,
  OrderHistoryTable,
  AdminTextAreaAdjustable
} from './CustomerDetail.styles';

// Corrected relative imports for consistency
import { ProductStatusBadge } from '../Products/ProductList.styles'; // Re-use for order status badges in history
import { AdminButton } from '../Dashboard/Common/Common.styles';
import AdminSelect from '../common/AdminSelect/AdminSelect';
import { FormLabel } from '../common/FormSectionWrapper/FormSectionWrapper.styles';
import { InfoBox } from '../Orders/OrderDetail.styles';

import { CustomerStatusBadge } from './CustomerList.styles';
import { AdminInput } from '../Dashboard/Common/Common.styles';






import type{ Customer, CustomerAccountStatus, CustomerAddress } from '@/types/customer';
import type { Order, PaymentStatus, FulfillmentStatus } from '@/types/order'; 

// Helper function definition (needs to be outside component if not part of its state/logic)
const getCustomerAvatar = (url?: string) => url || 'https://i.pravatar.cc/150?u=default';

// Dummy Order data (simplified, just for this customer's history)
// This should ideally be passed as a prop from AdminPage as part of the overall `allDummyOrders`
// For now, it will be local.
const dummyCustomerOrders: any = [
    { _id: 'ORD-A001', customer: { customerId: 'cust001', customerName: 'Alice Johnson', customerEmail: 'alice@example.com' }, totalAmount: 770, currency: 'USD', paymentStatus: 'paid', fulfillmentStatus: 'delivered', createdAt: '2023-10-25T10:00:00Z', updatedAt: '2023-10-28T10:00:00Z', orderItems: [] as any },
    { _id: 'ORD-A002', customer: { customerId: 'cust001', customerName: 'Alice Johnson', customerEmail: 'alice@example.com' }, totalAmount: 250, currency: 'USD', paymentStatus: 'paid', fulfillmentStatus: 'shipped', createdAt: '2023-09-15T10:00:00Z', updatedAt: '2023-09-18T10:00:00Z', orderItems: [] as any },
    { _id: 'ORD-A003', customer: { customerId: 'cust001', customerName: 'Alice Johnson', customerEmail: 'alice@example.com' }, totalAmount: 120, currency: 'USD', paymentStatus: 'pending', fulfillmentStatus: 'processing', createdAt: '2023-08-01T10:00:00Z', updatedAt: '2023-08-01T10:00:00Z', orderItems: [] as any },
];


interface CustomerDetailProps {
  customersData: Customer[]; // All customers data passed from AdminPage
  customerId: string | null; // ID of the specific customer to view (null if not found)
  onBackToList: () => void;
  onViewOrderDetails: (orderId: string) => void; // Prop to navigate to order details
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customersData, customerId, onBackToList, onViewOrderDetails }) => {
  // --- ALL HOOKS MUST BE DECLARED AT THE TOP LEVEL AND UNCONDITIONALLY ---
  const theme = useTheme();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [editingCustomerState, setEditingCustomerState] = useState<Customer | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [accountStatusUpdate, setAccountStatusUpdate] = useState<CustomerAccountStatus | 'select'>('select');

  // --- Effect to load customer data (runs unconditionally) ---
  useEffect(() => {
    if (customerId && customersData.length > 0) {
      const fetchedCustomer = customersData.find(c => c._id === customerId) || null;
      setCustomer(fetchedCustomer);
      if (fetchedCustomer) {
        setEditingCustomerState(fetchedCustomer); // Initialize editable state
        setNotes(fetchedCustomer.notes || '');
        setAccountStatusUpdate(fetchedCustomer.accountStatus);
      } else {
        setEditingCustomerState(null);
        setNotes('');
        setAccountStatusUpdate('select');
      }
    } else {
      setCustomer(null);
      setEditingCustomerState(null);
      setNotes('');
      setAccountStatusUpdate('select');
    }
  }, [customerId, customersData]);


  // --- Handlers for Form Fields (useCallback also must be unconditional) ---
  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingCustomerState(prev => prev ? { ...prev, [name]: value } : null);
  }, []);

  const handleAccountStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as CustomerAccountStatus | 'select';
    setAccountStatusUpdate(newStatus);
    // When changing status, update the internal editing state for consistency
    setEditingCustomerState(prev => prev ? { ...prev, accountStatus: newStatus === 'select' ? prev.accountStatus : newStatus } : null);
  }, []);

  const handleSaveNotes = useCallback(() => {
    // These handlers will only execute if 'customer' is not null, due to later conditional render.
    console.log(`Saving notes for ${customer?._id}:`, notes);
    const updatedCustomer = customer ? { ...customer, notes: notes } : null;
    if (updatedCustomer) setCustomer(updatedCustomer); // Update main customer state
    alert('Customer notes saved! (Check console)');
  }, [customer, notes]);


  // --- Actions (useCallback also must be unconditional) ---
  const handleUpdateAccountStatus = useCallback(() => {
    // These handlers will only execute if 'customer' is not null, due to later conditional render.
    if (accountStatusUpdate === 'select') {
      alert('Please select a valid status to update.');
      return;
    }
    console.log(`Updating customer ${customer?._id} status to: ${accountStatusUpdate}`);
    const updatedCustomer = customer ? { ...customer, accountStatus: accountStatusUpdate } : null;
    if (updatedCustomer) setCustomer(updatedCustomer);
    alert(`Account status updated to ${accountStatusUpdate}.`);
  }, [customer, accountStatusUpdate]);

  const handleSaveProfile = useCallback(() => {
    // These handlers will only execute if 'customer' is not null, due to later conditional render.
    if (editingCustomerState) {
        console.log(`Saving updated customer profile for ${customer?.['email']}:`, editingCustomerState); // Access email safely
        setCustomer(editingCustomerState);
        alert('Customer profile saved! (Check console)');
    }
  }, [customer, editingCustomerState]); // Include customer as dependency if its properties are used inside

  const handleDeleteCustomer = useCallback(() => {
    // These handlers will only execute if 'customer' is not null, due to later conditional render.
    if (customer && window.confirm(`Are you sure you want to delete customer ${customer._id} (${customer.firstName} ${customer.lastName})? This cannot be undone.`)) {
        console.log(`Deleting customer: ${customer._id}`);
        alert('Customer deleted! (Check console)');
        onBackToList();
    }
  }, [customer, onBackToList]);

  const handleResetPassword = useCallback(() => {
    // These handlers will only execute if 'customer' is not null, due to later conditional render.
    console.log(`Resetting password for: ${customer?.email}`);
    alert('Password reset link sent to customer (simulated).');
  }, [customer]);


  // --- Memoized Customer's Order History (useMemo also must be unconditional) ---
  const customerOrderHistory = useMemo(() => {
      // Return empty array if customer is null to prevent errors in access
      // In a real app, this would be fetched specific to the customer ID or filtered from global `allDummyOrders`
      return dummyCustomerOrders.filter(order => order.customer.customerId === customer?._id);
  }, [customer]);


  // --- Conditional Render Returns (Must be after all hooks are called) ---

  // Display message if customerId is null (no customer selected yet)
  if (!customerId) {
    return (
      <CustomerDetailContainer>
        <AdminButton $variant="secondary" onClick={onBackToList} style={{ marginBottom: '20px', alignSelf: 'flex-start' }}>
          <FaArrowLeft /> Back to Customer List
        </AdminButton>
        <InfoBox>
          <h3 style={{ textAlign: 'center', color: theme.colors.adminTextSecondary, padding: '50px', fontFamily: theme.typography.admin.fontFamily }}>Please select a customer to view details.</h3>
        </InfoBox>
      </CustomerDetailContainer>
    );
  }
  // Check if customer is null (means customerId was provided, but customer was not found in data)
  if (!customer) {
    return (
      <CustomerDetailContainer>
        <AdminButton $variant="secondary" onClick={onBackToList} style={{ marginBottom: '20px', alignSelf: 'flex-start' }}>
          <FaArrowLeft /> Back to Customer List
        </AdminButton>
        <InfoBox>
          <h3 style={{ textAlign: 'center', color: theme.colors.adminStatusError, padding: '50px', fontFamily: theme.typography.admin.fontFamily }}>Customer with ID "{customerId}" not found.</h3>
        </InfoBox>
      </CustomerDetailContainer>
    );
  }

  // --- Main JSX (Only reachable if customerId is valid AND customer data is found/loaded) ---
  return (
    <CustomerDetailContainer>
      {/* Back Button */}
      <AdminButton $variant="secondary" onClick={onBackToList} style={{ marginBottom: '20px', alignSelf: 'flex-start' }}>
        <FaArrowLeft /> Back to Customer List
      </AdminButton>

      {/* Header Summary */}
      <CustomerDetailHeader>
        <CustomerInfoGroup>
          <img src={getCustomerAvatar(customer.avatarUrl)} alt={`${customer.firstName} ${customer.lastName} avatar`} />
          <div>
            <h2>{customer.firstName} {customer.lastName}</h2>
            <span style={{ fontSize: '0.9em', color: theme.colors.adminTextSecondary }}>
              <FaEnvelope style={{ marginRight: '5px' }} /> {customer.email}
              {customer.phone && <> / <FaPhone style={{ marginLeft: '10px', marginRight: '5px' }} /> {customer.phone}</>}
            </span>
            <CustomerStatusBadge $status={customer.accountStatus}>{customer.accountStatus.replace(/_/g, ' ')}</CustomerStatusBadge>
          </div>
        </CustomerInfoGroup>

        <CustomerMetrics>
          <div>
            <span>Total Orders</span>
            <span>{customer.totalOrders} <FaBox style={{marginLeft: '5px'}} /></span>
          </div>
          <div>
            <span>Total Spent</span>
            <span>${customer.totalSpent.toFixed(2)} <FaDollarSign style={{marginLeft: '5px'}} /></span>
          </div>
          <div>
            <span>Registered</span>
            <span><FaCalendarAlt style={{marginRight: '5px'}} /> {new Date(customer.registrationDate).toLocaleDateString()}</span>
          </div>
        </CustomerMetrics>
      </CustomerDetailHeader>

      {/* Main Detail Layout */}
      <CustomerDetailLayout>
        {/* Left Column: Basic Info, Addresses */}
        <MainContentColumn>
          <InfoBox>
            <InfoSectionTitle>Basic Information <FaEdit size="0.8em" style={{verticalAlign: 'middle', marginLeft: '5px'}}/></InfoSectionTitle>
            <InfoGrid>
                <div>
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <AdminInput type="text" id="firstName" name="firstName" value={editingCustomerState?.firstName || ''} onChange={handleFieldChange} />
                </div>
                <div>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <AdminInput type="text" id="lastName" name="lastName" value={editingCustomerState?.lastName || ''} onChange={handleFieldChange} />
                </div>
                <div>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <AdminInput type="email" id="email" name="email" value={editingCustomerState?.email || ''} onChange={handleFieldChange} />
                </div>
                <div>
                    <FormLabel htmlFor="phone">Phone</FormLabel>
                    <AdminInput type="text" id="phone" name="phone" value={editingCustomerState?.phone || ''} onChange={handleFieldChange} />
                </div>
            </InfoGrid>
            <AdminButton $variant="primary" onClick={handleSaveProfile} style={{marginTop: '20px'}}>
                Save Profile Changes
            </AdminButton>
          </InfoBox>

          <InfoBox>
            <InfoSectionTitle>Addresses <FaMapMarkerAlt size="0.8em" style={{verticalAlign: 'middle', marginLeft: '5px'}} /></InfoSectionTitle>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: theme.spacing(4)}}>
                {customer.addresses?.map((address, index) => (
                    <AddressCard key={index}>
                        <h5>{address.type ? address.type.toUpperCase() + ' Address' : 'Address'} {address.isDefault ? '(Default)' : ''}</h5>
                        <span className="address-type-badge">{address.country}</span>
                        <p>
                            {address.street}<br />
                            {address.city}, {address.state} {address.zipCode}
                        </p>
                        <AddressActions>
                            <button onClick={() => console.log('Edit Address', address)} title="Edit Address"><FaEdit /></button>
                            <button onClick={() => console.log('Delete Address', address)} title="Delete Address" style={{color: theme.colors.adminStatusError}}><FaTrashAlt /></button>
                        </AddressActions>
                    </AddressCard>
                )) || <p style={{color: theme.colors.adminTextSecondary, textAlign: 'center', gridColumn: '1 / -1'}}>No addresses saved for this customer.</p>}
            </div>
            <AdminButton $variant="secondary" style={{marginTop: '20px'}}>
                <FaUserPlus /> Add New Address
            </AdminButton>
          </InfoBox>

        </MainContentColumn>

        {/* Right Column: Order History, Account Actions, Admin Notes */}
        <SidebarContentColumn>
<InfoBox>
    <InfoSectionTitle>
        Order History <FaBox size="0.8em" style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
    </InfoSectionTitle>
    <div style={{ overflowX: 'auto' }}>
        {customerOrderHistory.length > 0 ? (
            <OrderHistoryTable>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {customerOrderHistory.map((orderItem) => (
                        <tr key={orderItem._id}>
                            <td>{orderItem._id}</td>
                            <td>{orderItem.currency} {orderItem.totalAmount.toFixed(2)}</td>
                            <td>
                                <ProductStatusBadge $status={orderItem.fulfillmentStatus as any}>
                                    {orderItem.fulfillmentStatus.replace(/_/g, ' ')}
                                </ProductStatusBadge>
                            </td>
                            <td>{new Date(orderItem.createdAt).toLocaleDateString()}</td>
                            <td>
                                <button
                                    onClick={() => onViewOrderDetails(orderItem._id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: theme.colors.accent1,
                                        cursor: 'pointer'
                                    }}
                                >
                                    <FaEye />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </OrderHistoryTable>
        ) : (
            <p
                style={{
                    color: theme.colors.adminTextSecondary,
                    textAlign: 'center',
                    padding: theme.spacing(4)
                }}
            >
                No orders found for this customer.
            </p>
        )}
    </div>
</InfoBox>

            <InfoBox>
                <InfoSectionTitle>Account Actions <FaSyncAlt size="0.8em" style={{verticalAlign: 'middle', marginLeft: '5px'}} /></InfoSectionTitle>
                <InfoGrid style={{gridTemplateColumns: '1fr', gap: theme.spacing(2)}}>
                    <div>
                        <FormLabel htmlFor="accountStatusUpdate">Change Status</FormLabel>
                        <AdminSelect 
                            id="accountStatusUpdate" 
                            name="accountStatusUpdate"
                            value={accountStatusUpdate} 
                            onChange={handleAccountStatusChange}
                            options={[
                                {value: 'select', label: 'Select New Status'},
                                {value: 'active', label: 'Active'}, {value: 'suspended', label: 'Suspended'},
                                {value: 'blocked', label: 'Blocked'}, {value: 'pending_verification', label: 'Pending Verification'}
                            ]}
                        />
                    </div>
                    <AdminButton $variant="secondary" onClick={handleUpdateAccountStatus} disabled={accountStatusUpdate === 'select'}>
                        Apply Status Change
                    </AdminButton>
                    <AdminButton $variant="secondary" onClick={handleResetPassword}>
                        Reset Password
                    </AdminButton>
                    <AdminButton $variant="danger" onClick={handleDeleteCustomer}>
                        Delete Customer Account
                    </AdminButton>
                </InfoGrid>
            </InfoBox>

            <InfoBox>
                <InfoSectionTitle>Internal Admin Notes <FaPencilAlt size="0.8em" style={{verticalAlign: 'middle', marginLeft: '5px'}} /></InfoSectionTitle>
                <AdminTextAreaAdjustable
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add private notes about this customer account here."
                />
                <AdminButton $variant="secondary" onClick={handleSaveNotes} style={{marginTop: '15px'}}>
                    Save Notes
                </AdminButton>
            </InfoBox>

        </SidebarContentColumn>
      </CustomerDetailLayout>

      {/* Sticky Action Bar */}
      <StickyActionBar>
        <AdminButton $variant="secondary" onClick={onBackToList}>
            <FaArrowLeft /> Back to Customer List
        </AdminButton>
      </StickyActionBar>
    </CustomerDetailContainer>
  );
};

export default CustomerDetail;