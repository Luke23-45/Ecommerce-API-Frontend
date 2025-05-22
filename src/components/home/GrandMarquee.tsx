// src/components/GrandMarquee/GrandMarquee.tsx (Updated import)
import React from 'react';
import { StyledGrandMarquee, MarqueeContent, ElanLogo } from './styles/GrandMarquee.styles';
import PrimaryNav from './PrimaryNav'; // Updated import path here!
import UtilityNav from './UtilityNav';

const GrandMarquee: React.FC = () => {
    return (
        <StyledGrandMarquee>
            <MarqueeContent>
                <PrimaryNav />
                <ElanLogo><a href="/">ÉLAN HOMEWARES</a></ElanLogo>
                <UtilityNav />
            </MarqueeContent>
        </StyledGrandMarquee>
    );
};

export default GrandMarquee;