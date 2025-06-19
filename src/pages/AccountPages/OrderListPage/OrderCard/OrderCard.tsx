// src/components/orders/OrderCard/OrderCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { FaBoxOpen, FaCalendarAlt, FaHashtag, FaFileInvoiceDollar, FaEye } from 'react-icons/fa';
import { type OrderListItem } from '@/pages/AccountPages/OrderListPage/OrderListPage'; // Assuming type defined there for now
import { 
    OrderCardStyled, 
    OrderCardHeader,
    OrderInfo,
    OrderStatus,
    OrderCardBody,
    OrderItemsPreview,
    ItemImage,
    ItemCount,
    OrderCardFooter,
    OrderTotal,
} from './OrderCard.styles'; // We will define these styles next
// import { PrimaryButton, SecondaryButton } from '@/components/common/Button/Button'; // Assumed common buttons
// import { PrimaryCtaButton as PrimaryButton } from '@/pages/BecomeAPartnerPage/BecomeAPartnerPage.styles';
// import { SecondaryButton } from '@/components/auth/AuthForms';

import { PrimaryButton } from './OrderCard.styles';
import { SecondaryButton } from './OrderCard.styles';
interface OrderCardProps {
  order: OrderListItem;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleViewDetails = () => {
    navigate(`/account/orders/${order._id}`);
  };

  // Determine overall status to display (could be order.status or order.fulfillmentStatus)
  const displayStatus = order.status || order.fulfillmentStatus || 'Unknown';

  return (
    <OrderCardStyled>
      <OrderCardHeader>
        <OrderInfo>
          <FaHashtag />
          Order #{order.orderNumber}
        </OrderInfo>
        <OrderInfo>
          <FaCalendarAlt />
          {formatDate(order.createdAt)}
        </OrderInfo>
      </OrderCardHeader>
      <OrderCardBody>
        <OrderItemsPreview>
          {order.firstItemImage && <ItemImage src={order.firstItemImage} alt={order.firstItemName || 'Order Item'} />}
          <div className="item-summary">
            {order.firstItemName && <p className="main-item-name">{order.firstItemName}</p>}
            <ItemCount>{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</ItemCount>
          </div>
        </OrderItemsPreview>
        <div className="status-total-block">
            <OrderStatus $statusType={displayStatus.toLowerCase()}>
                {displayStatus.replace('_', ' ')}
            </OrderStatus>
            <OrderTotal>
                {order.currency === 'USD' ? '$' : order.currency}{order.grandTotal.toFixed(2)}
            </OrderTotal>
        </div>
      </OrderCardBody>
      <OrderCardFooter>
        {/* Placeholder for other actions like "Track Order" or "Reorder" */}
        <SecondaryButton size="small" $variant="outline" onClick={() => console.log("Track Order:", order._id)}>Track</SecondaryButton>
        <PrimaryButton size="small" onClick={handleViewDetails} style={{marginLeft: 'auto'}}>
          <FaEye style={{ marginRight: theme.spacing(1.5)}} /> View Details
        </PrimaryButton>
      </OrderCardFooter>
    </OrderCardStyled>
  );
};

export default OrderCard;