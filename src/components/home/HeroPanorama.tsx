// src/components/HeroPanorama/HeroPanorama.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    StyledHeroPanorama,
    HeroVideo,
    HeroImage,
    HeroOverlay, // New!
    HeroContent,
    HeroHeadline,
    HeroSubheadline,
    HeroCtaButton,
    Hotspot,
    HotspotTooltip,
    ScrollIndicator, // New!
} from './styles/HeroPanorama.styles';
import heroVideo from '../../assets/video1.mp4'; // Ensure you have this file
import heroImage from '../../assets/hero-image.png'; // Ensure you have this file (fallback)
import { FaChevronDown } from 'react-icons/fa'; // New icon for scroll indicator


interface HotspotData {
    id: string;
    name: string;
    price: string;
    left: number; // percentage from left
    top: number;  // percentage from top
}

const dummyHotspots: HotspotData[] = [
    { id: '1', name: 'The Serenity Armchair', price: '$899', left: 30, top: 70 },
    { id: '2', name: 'Artisan Floor Vase', price: '$120', left: 60, top: 50 },
    { id: '3', name: 'Organic Linen Throw', price: '$85', left: 45, top: 40 },
];

const HeroPanorama: React.FC = () => {
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [yOffset, setYOffset] = useState(0);
    const [activeHotspot, setActiveHotspot] = useState<string | null>(null); // To manage tooltip visibility

    // Handle video load for smooth transition
    const handleVideoLoad = () => {
        setVideoLoaded(true);
    };

    // Parallax scrolling effect
    const handleScroll = () => {
        setYOffset(window.pageYOffset);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        // Clean up event listener
        return () => window.removeEventListener('scroll', handleScroll);
    }, []); // Empty dependency array means this runs once on mount

    return (
        <StyledHeroPanorama $yOffset={yOffset}>
            {/* Background Video/Image */}
            {/* Video will only show once it's loaded for smooth transition */}
            <HeroVideo
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                onLoadedData={handleVideoLoad}
                style={{ opacity: videoLoaded ? 1 : 0 }}
                $yOffset={yOffset}
            >
                <source src={heroVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </HeroVideo>
            {/* Fallback image always present, hidden by video opacity on load */}
            {!videoLoaded && (
                 <HeroImage src={heroImage} alt="Beautifully styled living room" $yOffset={yOffset} />
            )}

            {/* Subtle Gradient Overlay */}
            <HeroOverlay />

            {/* Hero Content */}
            <HeroContent $yOffset={yOffset}>
                <HeroHeadline>
                    <span style={{ '--animation-delay': '0.3s' } as React.CSSProperties}>Where Serenity Meets Craft.</span>
                    <span style={{ '--animation-delay': '0.5s' } as React.CSSProperties}>Élan for Your Home.</span>
                </HeroHeadline>
                <HeroSubheadline style={{ '--animation-delay': '0.7s' } as React.CSSProperties}>
                    Curated collections that celebrate the art of living with purpose.
                </HeroSubheadline>
                <HeroCtaButton href="#collections" style={{ '--animation-delay': '0.9s' } as React.CSSProperties}>
                    Discover Our Collections
                </HeroCtaButton>
            </HeroContent>

            {/* Hotspots */}
            {dummyHotspots.map((hotspot, index) => (
                <Hotspot
                    key={hotspot.id}
                    $left={hotspot.left}
                    $top={hotspot.top}
                    $visible={activeHotspot === hotspot.id}
                    onMouseEnter={() => setActiveHotspot(hotspot.id)}
                    onMouseLeave={() => setActiveHotspot(null)}
                    style={{ '--animation-delay': `${2.5 + index * 0.2}s` } as React.CSSProperties} // Staggered reveal
                >
                    <HotspotTooltip $left={hotspot.left} $top={hotspot.top}>
                        <h4>{hotspot.name}</h4>
                        <p>{hotspot.price}</p>
                        <button>Quick Shop</button>
                    </HotspotTooltip>
                </Hotspot>
            ))}

            {/* Scroll Indicator */}
            <ScrollIndicator>
                <span>SCROLL TO EXPLORE</span>
                <FaChevronDown />
            </ScrollIndicator>
        </StyledHeroPanorama>
    );
};

export default HeroPanorama;