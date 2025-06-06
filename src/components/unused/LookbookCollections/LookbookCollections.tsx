// src/components/LookbookCollections/LookbookCollections.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTheme } from 'styled-components';

import {
    LookbookCollectionsSection,
    SectionHeadline,
    SectionSubheading,
    FeaturedBannerContainer,
    BannerImage,
    BannerOverlay,
    BannerContent,
    BannerCtaButton,
    CollectionsGrid,
    CollectionCard,
    CollectionImageWrapper,
    CollectionOverlay,
    CollectionContent,
    CollectionTitle,
    CollectionDescription,
    CollectionCtaButton,
} from './LookbookCollections.styles';

// Helper for high-quality dummy images from Picsum for a consistent look
const getCollectionImage = (seed: string, width: number, height: number) =>
    `https://picsum.photos/seed/${seed.replace(/\s/g, '-')}/${width}/${height}/?nature,home-decor,interiors,design`;

interface CollectionData {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
}

const featuredCollection: CollectionData = {
    id: 'f1',
    title: 'The Autumn Ember Edit',
    description: 'Immerse yourself in warmth and richness. A curated selection inspired by autumn’s soft hues and cozy textures, designed to transform your space.',
    image: getCollectionImage('autumn-living-room-cozy', 1920, 1080), // Large banner image with more descriptive seed
    link: '#autumn-edit',
};

const secondaryCollections: CollectionData[] = [
    {
        id: 's1',
        title: 'Nordic Calm',
        description: 'Embrace minimalist living with light woods, muted tones, and functional design that evokes tranquility.',
        image: getCollectionImage('nordic-interior-design-minimal', 600, 800),
        link: '#nordic-calm',
    },
    {
        id: 's2',
        title: 'Modern Japandi',
        description: 'A harmonious blend of Japanese aesthetics and Scandinavian comfort, focusing on simplicity and natural materials.',
        image: getCollectionImage('japandi-bedroom-design-natural', 600, 800),
        link: '#japandi-style',
    },
    {
        id: 's3',
        title: 'Coastal Serenity',
        description: 'Bring the soothing essence of the sea into your home with breezy textiles, natural light, and organic forms.',
        image: getCollectionImage('coastal-home-decor-sea', 600, 800),
        link: '#coastal-serenity',
    },
    {
        id: 's4',
        title: 'Urban Oasis',
        description: 'Transform your city dwelling into a verdant escape with indoor gardens, industrial accents, and clever space solutions.',
        image: getCollectionImage('urban-garden-decor-plants', 600, 800),
        link: '#urban-oasis',
    },
];

const LookbookCollections: React.FC = () => {
    const theme = useTheme();
    const sectionRef = useRef<HTMLDivElement>(null);
    const [yOffset, setYOffset] = useState(0);

    const handleScroll = useCallback(() => {
        if (sectionRef.current) {
            const sectionTop = sectionRef.current.getBoundingClientRect().top;
            const viewportHeight = window.innerHeight;
            // Only apply parallax when the section is within 1.5 viewports of the current scroll position
            if (sectionTop < viewportHeight * 1.5 && sectionTop > -sectionRef.current.offsetHeight) {
                setYOffset(sectionTop);
            } else {
                setYOffset(0); // Reset yOffset when far out of view
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [intersectingStates, setIntersectingStates] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        secondaryCollections.forEach((collection, index) => {
            const cardRef = cardRefs.current[index];
            if (cardRef) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            setIntersectingStates(prevState => ({
                                ...prevState,
                                [collection.id]: true
                            }));
                            observer.unobserve(cardRef); // Disconnect after animating
                        }
                    },
                    { threshold: 0.25 } // Trigger when 25% of the card is visible
                );
                observer.observe(cardRef);
                observers.push(observer);
            }
        });

        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, []);

    return (
        <LookbookCollectionsSection ref={sectionRef}>
            <SectionHeadline>The Élan Lookbook: Seasons of Curated Living</SectionHeadline>
            <SectionSubheading>
                Explore thoughtfully assembled collections, each designed to transform your space and reflect a unique, harmonious lifestyle. Discover pieces crafted with purpose and timeless elegance.
            </SectionSubheading>

            {/* Featured Collection Banner */}
            <FeaturedBannerContainer $yOffset={yOffset}>
                <BannerImage src={featuredCollection.image} alt={featuredCollection.title} loading="lazy" $yOffset={yOffset} />
                <BannerOverlay />
                <BannerContent>
                    <h3>{featuredCollection.title}</h3>
                    <p>{featuredCollection.description}</p>
                    <BannerCtaButton href={featuredCollection.link}>
                        Explore The Collection
                    </BannerCtaButton>
                </BannerContent>
            </FeaturedBannerContainer>

            {/* Grid of Secondary Collections */}
            <CollectionsGrid>
                {secondaryCollections.map((collection, index) => (
                    <CollectionCard
                        key={collection.id}
                        ref={el => cardRefs.current[index] = el}
                        $isIntersecting={intersectingStates[collection.id] || false}
                        // Staggered reveal for grid items, ensuring they appear sequentially
                        style={{ '--animation-delay': `${index * 0.15 + 0.2}s` } as React.CSSProperties} // Add a base delay to ensure headline/banner animates first
                        onClick={() => window.location.href = collection.link} // Make the whole card clickable
                    >
                        <CollectionImageWrapper>
                            <img src={collection.image} alt={collection.title} loading="lazy" />
                        </CollectionImageWrapper>
                        <CollectionOverlay />
                        <CollectionContent>
                            <CollectionTitle>{collection.title}</CollectionTitle>
                            <CollectionDescription>{collection.description}</CollectionDescription>
                            <CollectionCtaButton href={collection.link}>
                                Shop The Look
                            </CollectionCtaButton>
                        </CollectionContent>
                    </CollectionCard>
                ))}
            </CollectionsGrid>
        </LookbookCollectionsSection>
    );
};

export default LookbookCollections;