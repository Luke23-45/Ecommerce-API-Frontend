// src/components/Admin/Orders/OrderDetail.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from 'styled-components'; // Correctly import useTheme
import { FaArrowLeft, FaCheckCircle, FaTrashAlt, FaPrint, FaUserCircle, FaMoneyBillWave, FaTruckMoving, FaPencilAlt, FaInfoCircle } from 'react-icons/fa';
import { FieldGroup } from '../common/FormSectionWrapper/FormSectionWrapper.styles';
import {
  OrderDetailContainer,
  OrderDetailHeader,
  OrderTitleGroup,
  OrderSummaryMetrics,
  OrderDetailLayout,
  MainContentColumn,
  SidebarContentColumn,
  StickyActionBar,
  InfoSectionTitle,
  InfoGrid,
  ItemListTable,
  ActivityLogList,
  ActivityLogItem,
  AdminTextAreaAdjustable,
  InfoBox,
} from './OrderDetail.styles';

// Corrected relative imports for consistency
import { ProductStatusBadge } from '../Products/ProductList.styles';
import { AdminButton } from '../Dashboard/Common/Common.styles';
import AdminSelect from '../common/AdminSelect/AdminSelect';
import { FormField } from '@/components/auth/AuthForms';
import type { Order, OrderItem, PaymentStatus, FulfillmentStatus } from '@/types/order';


// --- Dummy Order Data (for demonstration) ---
// This will be sourced from AdminPage.tsx as `ordersData` prop.
// Removed internal dummyOrders here to ensure single source of truth.

interface OrderDetailProps {
  ordersData: Order[]; // Accept all orders data via prop
  orderId: string | null; // ID of the specific order to view
  onBackToList: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ ordersData, orderId, onBackToList }) => {
  // --- All Hooks must be declared at the top level, unconditionally ---
  const theme = useTheme();
  const [order, setOrder] = useState<Order | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [paymentStatusUpdate, setPaymentStatusUpdate] = useState<PaymentStatus | 'select'>('select');
  const [fulfillmentStatusUpdate, setFulfillmentStatusUpdate] = useState<FulfillmentStatus | 'select'>('select');

  // Handlers (useCallback also must be unconditional)
  const handleUpdateStatus = useCallback((type: 'payment' | 'fulfillment') => {
      // Logic from before...
      const newStatus = type === 'payment' ? paymentStatusUpdate : fulfillmentStatusUpdate;
      if (newStatus === 'select') {
          alert(`Please select a valid ${type} status.`);
          return;
      }
      console.log(`Updating order ${order?._id} ${type} status to: ${newStatus}`); // Use optional chaining for order
      const updatedOrder = { ...order!, [type === 'payment' ? 'paymentStatus' : 'fulfillmentStatus']: newStatus }; // Use non-null assertion or check
      setOrder(updatedOrder);

      const now = new Date().toISOString();
      const statusNote = `Status updated to ${newStatus} (${type}) by Admin on ${new Date(now).toLocaleString()}.`;
      const updatedAdminNotes = order?.adminNotes ? `${order.adminNotes}\n${statusNote}` : statusNote; // Use optional chaining
      setOrder(prev => prev ? { ...prev, adminNotes: updatedAdminNotes } : null);
      setAdminNotes(updatedAdminNotes);
      
      alert(`Order ${type} status updated to ${newStatus}. (See console for mock API call)`);

  }, [order, paymentStatusUpdate, fulfillmentStatusUpdate]);

  const handleSaveAdminNotes = useCallback(() => {
    // Logic from before...
    console.log(`Saving Admin Notes for order ${order?._id}:`, adminNotes); // Optional chaining
    const updatedOrder = { ...order!, adminNotes: adminNotes }; // Non-null assertion
    setOrder(updatedOrder);
    alert('Admin notes saved! (See console for mock API call)');
  }, [order, adminNotes]);

  const handlePrintInvoice = useCallback(() => {
    // Logic from before...
    console.log(`Printing invoice for order: ${order?._id}`); // Optional chaining
    alert('Invoice printing initiated. (See console for mock call)');
  }, [order]);

  const handleContactCustomer = useCallback(() => {
    // Logic from before...
    console.log(`Contacting customer ${order?.customer.customerName} via email: ${order?.customer.customerEmail}`); // Optional chaining
    window.location.href = `mailto:${order?.customer.customerEmail}`;
  }, [order]);

  // Memoized activity log (also must be unconditional)
  const activityLog = useMemo(() => {
    // Logic from before...
    if (!order) return []; // Ensure order is not null before processing
    const logs = [];

    logs.push({ message: `Order Placed (ID: ${order._id})`, timestamp: new Date(order.createdAt).toLocaleString(), actor: 'Customer' });
    if (order.paymentStatus) { logs.push({ message: `Payment Status: ${order.paymentStatus.replace('_', ' ')}`, timestamp: new Date(order.createdAt).toLocaleString(), actor: 'System' }); }
    if (order.fulfillmentStatus) {
        let fulfillmentMessage = `Fulfillment Status: ${order.fulfillmentStatus.replace(/_/g, ' ')}`; // Use global replace for _
        if (order.trackingNumber) fulfillmentMessage += ` (Tracking: ${order.trackingNumber})`;
        logs.push({ message: fulfillmentMessage, timestamp: new Date(order.updatedAt).toLocaleString(), actor: 'System' });
    }
    
    if (order.adminNotes) {
        order.adminNotes.split('\n').forEach(note => {
            if (note.trim()) { logs.push({ message: note, timestamp: 'Latest notes', actor: 'Admin', notes: null }); }
        });
    }

    logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    return logs;
  }, [order]); // Depend on order state


  // --- EFFECT: Load / Re-Load Order Data when orderId or ordersData changes ---
  // This useEffect calls `setOrder`, which is fine, as setOrder is a setState.
  // This useEffect itself runs unconditionally on every render, its *effect body* is conditional.
  useEffect(() => {
    if (orderId && ordersData.length > 0) {
      const fetchedOrder = ordersData.find(o => o._id === orderId) || null;
      setOrder(fetchedOrder);
      if (fetchedOrder) {
          setAdminNotes(fetchedOrder.adminNotes || '');
          setPaymentStatusUpdate(fetchedOrder.paymentStatus);
          setFulfillmentStatusUpdate(fetchedOrder.fulfillmentStatus);
      } else {
          setAdminNotes('');
          setPaymentStatusUpdate('select');
          setFulfillmentStatusUpdate('select');
      }
    } else {
        setOrder(null);
        setAdminNotes('');
        setPaymentStatusUpdate('select');
        setFulfillmentStatusUpdate('select');
    }
  }, [orderId, ordersData]); // Depend on both orderId and the ordersData array


  // --- Conditional RENDER (not hooks) ---
  // These checks come *after* all hooks have been called.
  if (!orderId) {
    return (
        <OrderDetailContainer>
            <AdminButton $variant="secondary" onClick={onBackToList} style={{ marginBottom: '20px', alignSelf: 'flex-start' }}>
                <FaArrowLeft /> Back to Order List
            </AdminButton>
            <InfoBox>
                <h3 style={{textAlign: 'center', color: theme.colors.adminTextSecondary, padding: '50px', fontFamily: theme.typography.admin.fontFamily}}>Please select an order to view its details.</h3>
            </InfoBox>
        </OrderDetailContainer>
    );
  }
  // Check if order is null (means not found AFTER trying to fetch from ordersData)
  if (!order) {
    return (
        <OrderDetailContainer>
            <AdminButton $variant="secondary" onClick={onBackToList} style={{ marginBottom: '20px', alignSelf: 'flex-start' }}>
                <FaArrowLeft /> Back to Order List
            </AdminButton>
            <InfoBox>
                 <h3 style={{textAlign: 'center', color: theme.colors.adminStatusError, padding: '50px', fontFamily: theme.typography.admin.fontFamily}}>Order with ID "{orderId}" not found.</h3>
            </InfoBox>
        </OrderDetailContainer>
    );
  }

  // --- Main JSX (assuming order is not null from here) ---
  return (
    <OrderDetailContainer>
      {/* Back Button */}
      <AdminButton $variant="secondary" onClick={onBackToList} style={{ marginBottom: '20px', alignSelf: 'flex-start' }}>
        <FaArrowLeft /> Back to All Orders
      </AdminButton>

      {/* Order Header Summary */}
      <OrderDetailHeader>
        <OrderTitleGroup>
          <h2>Order # {order._id}</h2>
          <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
          <span style={{ fontSize: '1em', marginTop: '5px' }}>
              {/* Type assertion for $status prop of ProductStatusBadge */}
              <ProductStatusBadge $status={order.paymentStatus as any}>{order.paymentStatus.replace(/_/g, ' ')}</ProductStatusBadge>
              {' '}<ProductStatusBadge $status={order.fulfillmentStatus as any}>{order.fulfillmentStatus.replace(/_/g, ' ')}</ProductStatusBadge>
          </span>
        </OrderTitleGroup>

        <OrderSummaryMetrics>
            <div>
                <span>Total Amount</span>
                <span>{order.currency} {order.totalAmount.toFixed(2)}</span>
            </div>
            <div>
                <span>Items</span>
                <span>{order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            {order.trackingNumber && <div>
                <span>Tracking #</span>
                <span>{order.trackingNumber}</span>
            </div>}
        </OrderSummaryMetrics>
      </OrderDetailHeader>

      {/* Main Order Details Layout */}
      <OrderDetailLayout>
        {/* Left Column: Order Items, General Info, Notes */}
        <MainContentColumn>
          <InfoBox>
            <InfoSectionTitle>Order Items</InfoSectionTitle>
            <div style={{overflowX: 'auto', width: '100%'}}>
                <ItemListTable>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>SKU</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderItems.map(item => (
                            <tr key={item.productId + (item.variationAttributes ? item.variationAttributes.map(a => a.value).join('-') : '')}>
                                <td>
                                    {item.productMainImageUrl && <img src={item.productMainImageUrl} alt={item.productName} />}
                                    {item.productName}
                                    {item.variationAttributes && item.variationAttributes.length > 0 && (
                                        <div style={{ fontSize: '0.85em', color: theme.colors.adminTextSecondary }}>
                                            {item.variationAttributes.map(attr => `${attr.name}: ${attr.value}`).join('; ')}
                                        </div>
                                    )}
                                </td>
                                <td>{item.productSku || 'N/A'}</td>
                                <td>{item.quantity}</td>
                                <td>{order.currency} {item.priceAtTimeOfPurchase.toFixed(2)}</td>
                                <td>{order.currency} {(item.quantity * item.priceAtTimeOfPurchase).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'right' }}>Subtotal:</td>
                            <td>{order.currency} {(order.totalAmount * 0.9).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'right' }}>Shipping:</td>
                            <td>{order.currency} {(order.totalAmount * 0.1).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colSpan={4} style={{ textAlign: 'right' }}>Grand Total:</td>
                            <td>{order.currency} {order.totalAmount.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </ItemListTable>
            </div>

            </InfoBox>
            
            <InfoBox>
                <InfoSectionTitle>General Order Information</InfoSectionTitle>
                <InfoGrid>
                    <div><span>Shipping Method</span><span>{order.shippingMethod}</span></div>
                    {order.vendorId && <div><span>Vendor ID</span><span>{order.vendorId}</span></div>}
                    {order.sellerId && <div><span>Seller ID</span><span>{order.sellerId}</span></div>}
                    {order.trackingNumber && <div><span>Tracking #</span><span>{order.trackingNumber}</span></div>}
                    {order.carrier && <div><span>Carrier</span><span>{order.carrier}</span></div>}
                    {order.orderNotes && <div style={{gridColumn: '1 / -1'}}><span>Customer Notes</span><span style={{fontStyle: 'italic', color: theme.colors.darkGray}}>{order.orderNotes}</span></div>}
                </InfoGrid>
            </InfoBox>

            <InfoBox>
                <InfoSectionTitle>Internal Admin Notes <FaPencilAlt size="0.8em" style={{verticalAlign: 'middle', marginLeft: '5px'}} /></InfoSectionTitle>
                <AdminTextAreaAdjustable
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this order here. These are not visible to the customer."
                />
                <AdminButton $variant="secondary" onClick={handleSaveAdminNotes} style={{marginTop: '15px'}}>
                    Save Notes
                </AdminButton>
            </InfoBox>

        </MainContentColumn>

        {/* Right Column: Customer Info, Address, Activity Log, Quick Actions */}
        <SidebarContentColumn>
            <InfoBox>
                <InfoSectionTitle>Customer Information <FaUserCircle size="0.8em" style={{verticalAlign: 'middle', marginLeft: '5px'}} /></InfoSectionTitle>
                <InfoGrid>
                    <div><span>Name</span><span>{order.customer.customerName}</span></div>
                    <div><span>Email</span><a href={`mailto:${order.customer.customerEmail}`} style={{color: theme.colors.accent1}}>{order.customer.customerEmail}</a></div>
                    {order.customer.customerPhone && <div><span>Phone</span><a href={`tel:${order.customer.customerPhone}`} style={{color: theme.colors.accent1}}>{order.customer.customerPhone}</a></div>}
                    <div><span>Customer ID</span><span>{order.customer.customerId}</span></div>
                </InfoGrid>
                <AdminButton $variant="secondary" onClick={handleContactCustomer} style={{marginTop: '20px'}}>
                    Contact Customer
                </AdminButton>
            </InfoBox>
            
            <InfoBox>
                <InfoSectionTitle>Shipping Address <FaTruckMoving size="0.8em" style={{verticalAlign: 'middle', marginLeft: '5px'}} /></InfoSectionTitle>
                <p style={{fontSize: theme.typography.admin.sizes.dataCell, lineHeight: '1.5', color: theme.colors.adminText}}>
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.country}
                </p>
            </InfoBox>

            {order.billingAddress && (order.billingAddress.street !== order.shippingAddress.street) && (
                <InfoBox>
                    <InfoSectionTitle>Billing Address</InfoSectionTitle>
                    <p style={{fontSize: theme.typography.admin.sizes.dataCell, lineHeight: '1.5', color: theme.colors.adminText}}>
                        {order.billingAddress.street}<br />
                        {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}<br />
                        {order.billingAddress.country}
                    </p>
                </InfoBox>
            )}

            <InfoBox>
                <InfoSectionTitle>Order History / Activity Log <FaInfoCircle size="0.8em" style={{verticalAlign: 'middle', marginLeft: '5px'}} /></InfoSectionTitle>
                <ActivityLogList>
                    {activityLog.map((log, index) => (
                        <ActivityLogItem key={index}>
                            <span className="message">{log.message}</span>
                            <span className="timestamp">{log.timestamp} by <span className="actor" style={{color: theme.colors.accent1}}>{log.actor}</span></span>
                            {log.notes && <span className="notes" style={{fontStyle: 'italic', color: theme.colors.darkGray}}>{log.notes}</span>}
                        </ActivityLogItem>
                    ))}
                </ActivityLogList>
            </InfoBox>

        </SidebarContentColumn>
      </OrderDetailLayout>

      {/* Sticky Action Bar */}
      <StickyActionBar>
        <InfoGrid style={{marginRight: 'auto', gap: theme.spacing(8), gridTemplateColumns: 'repeat(2, 1fr)'}}>
            <div style={{borderRight: `1px solid ${theme.colors.adminBorder}`, paddingRight: theme.spacing(4)}}>
                <span>Payment:</span>
                <ProductStatusBadge $status={order.paymentStatus as any}>{order.paymentStatus.replace(/_/g, ' ')}</ProductStatusBadge>
            </div>
            <div>
                <span>Fulfillment:</span>
                <ProductStatusBadge $status={order.fulfillmentStatus as any}>{order.fulfillmentStatus.replace(/_/g, ' ')}</ProductStatusBadge>
            </div>
        </InfoGrid>

        <FieldGroup style={{flexDirection: 'row', gap: theme.spacing(2), marginRight: theme.spacing(4), width: '250px'}}>
            <AdminSelect 
                value={paymentStatusUpdate} 
                onChange={(e) => setPaymentStatusUpdate(e.target.value as PaymentStatus)}
                options={[
                    {value: 'select', label: 'Update Payment Status'},
                    {value: 'paid', label: 'Paid'}, {value: 'pending', label: 'Pending'},
                    {value: 'refunded', label: 'Refunded'}, {value: 'failed', label: 'Failed'},
                    {value: 'canceled', label: 'Canceled'}
                ]}
            />
            <AdminButton 
                $variant="secondary" 
                onClick={() => handleUpdateStatus('payment')}
                disabled={paymentStatusUpdate === 'select'}
                style={{whiteSpace: 'nowrap', flexShrink: 0, padding: `${theme.spacing(2)} ${theme.spacing(3)}`}}
            >
                <FaMoneyBillWave /> Apply
            </AdminButton>
        </FieldGroup>
        
        <FieldGroup style={{flexDirection: 'row', gap: theme.spacing(2), width: '250px'}}>
            <AdminSelect 
                value={fulfillmentStatusUpdate} 
                onChange={(e) => setFulfillmentStatusUpdate(e.target.value as FulfillmentStatus)}
                options={[
                    {value: 'select', label: 'Update Fulfillment Status'},
                    {value: 'processing', label: 'Processing'}, {value: 'shipped', label: 'Shipped'},
                    {value: 'delivered', label: 'Delivered'}, {value: 'canceled', label: 'Canceled'},
                    {value: 'returned', label: 'Returned'}
                ]}
            />
            <AdminButton 
                $variant="secondary" 
                onClick={() => handleUpdateStatus('fulfillment')}
                disabled={fulfillmentStatusUpdate === 'select'}
                style={{whiteSpace: 'nowrap', flexShrink: 0, padding: `${theme.spacing(2)} ${theme.spacing(3)}`}}
            >
                <FaTruckMoving /> Apply
            </AdminButton>
        </FieldGroup>

        <AdminButton $variant="secondary" onClick={handlePrintInvoice}>
            <FaPrint /> Print Invoice
        </AdminButton>
      </StickyActionBar>
    </OrderDetailContainer>
  );
};

export default OrderDetail;