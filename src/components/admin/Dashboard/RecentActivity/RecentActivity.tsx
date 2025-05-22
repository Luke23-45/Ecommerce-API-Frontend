// src/components/Admin/Dashboard/RecentActivity/RecentActivity.tsx (Adjusted)
import React from 'react';
import {
  RecentActivityContainer,
  ActivityHeader,
  ActivityList,
  ActivityItem,
  ActivityDetails,
  ActivityMeta,
  ActivityStatusBadge,
} from './RecentActivity.styles';

interface RecentActivityItem {
  id: string;
  name: string; // e.g., customer name or order ID
  type: string; // e.g., 'New Order', 'Review', 'Refund'
  date: string;
  value?: string | null; // Can be string or null for types like New Customer
  status?: 'pending' | 'shipped' | 'returned' | 'paid'; // Order status
}

const dummyActivities: RecentActivityItem[] = [
  { id: 'oa1', name: 'Order #2023-001', type: 'New Order', date: 'Just now', value: '$250.00', status: 'pending' },
  { id: 'oa2', name: 'Ella Thompson', type: 'New Customer', date: '5 mins ago', value: null, status: null },
  { id: 'oa3', name: 'Order #2023-002', type: 'Shipped', date: '1 hr ago', value: '$120.00', status: 'shipped' },
  { id: 'oa4', name: 'Product Review', type: 'Vase Collection', date: '2 hrs ago', value: '5 stars', status: null },
  { id: 'oa5', name: 'Order #2023-003', type: 'New Order', date: 'Today', value: '$85.00', status: 'paid' },
  { id: 'oa6', name: 'Olivia Martinez', type: 'New Customer', date: 'Today', value: null, status: null },
  { id: 'oa7', name: 'Order #2023-004', type: 'Pending', date: 'Yesterday', value: '$310.00', status: 'pending' },
  { id: 'oa8', name: 'Refund Initiated', type: 'Order #2023-005', date: '2 days ago', value: '-$70.00', status: 'returned' },
];

interface RecentActivityProps {
    title: string;
    activities?: RecentActivityItem[]; // Make optional or accept prop for specific activities
}

const RecentActivity: React.FC<RecentActivityProps> = ({ title, activities = dummyActivities }) => {
  return (
    <RecentActivityContainer>
      <ActivityHeader>{title}</ActivityHeader>
      <ActivityList>
        {activities.length > 0 ? (
            activities.map((activity) => (
            <ActivityItem key={activity.id}>
                <ActivityDetails>
                <span className="name">{activity.name}</span>
                <span className="type">{activity.type}</span>
                </ActivityDetails>
                <ActivityMeta>
                {activity.status ? (
                    <ActivityStatusBadge $status={activity.status}>
                    {activity.status}
                    </ActivityStatusBadge>
                ) : (
                    <span className="date">{activity.date}</span>
                )}
                {activity.value && <span className="value">{activity.value}</span>}
                </ActivityMeta>
            </ActivityItem>
            ))
        ) : (
            <li style={{ textAlign: 'center', color: '#999', padding: '20px' }}>No recent activity.</li>
        )}
      </ActivityList>
    </RecentActivityContainer>
  );
};

export default RecentActivity;