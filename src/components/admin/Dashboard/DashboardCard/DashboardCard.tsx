// src/components/Admin/Dashboard/DashboardCard/DashboardCard.tsx
import React from 'react';
import {
    DashboardCardContainer,
    CardHeader,
    CardTitle,
    CardContent,
} from './DashboardCard.styles';

interface DashboardCardProps {
    title?: string;
    children: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, children }) => (
    <DashboardCardContainer>
        {title && (
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
        )}
        <CardContent>
            {children}
        </CardContent>
    </DashboardCardContainer>
);

export default DashboardCard;