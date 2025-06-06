// src/components/BrandEthos/BrandEthos.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTheme } from 'styled-components';
import {
    BrandEthosSection,
    IntroContainer,
    StoryBlocksContainer,
    StoryBlock,
    VisualWrapper,
    LightWashOverlay,
    TextContent,
    ReadMoreButton,
} from './BrandEthos.styles';

// Helper for high-quality images. Use specific, evocative seeds and larger dimensions.
const getEthosImage = (seed: string, width: number, height: number, tags: string = '') =>
    `https://picsum.photos/seed/${seed.replace(/\s/g, '-')}/${width}/${height}/?${tags}`;

interface StoryData {
    id: string;
    headline: string;
    paragraph: string;
    image: string; // Static image or potential video snippet
    link: string;
    reverse?: boolean; // For alternating layout
}

const ethosStories: StoryData[] = [
    {
        id: 'craftsmanship',
        headline: 'The Art of Handcrafting',
        paragraph: 'Each Élan Homewares piece undergoes a meticulous journey from raw material to masterpiece. Discover the dedication infused into every stitch, every curve, every finish by skilled artisans around the world.',
        image: getEthosImage('artisan-hands-ceramics-pottery-details', 1000, 650, 'handicraft,ceramics,pottery'), // Larger, more detailed image
        link: '#our-craftsmanship',
    },
    {
        id: 'sustainability',
        headline: 'Sustainable By Nature',
        paragraph: 'We are deeply committed to nurturing our planet. We meticulously source ethically-grown, recycled, or reclaimed materials, embracing practices that cherish the Earth and inspire future generations of design.',
        image: getEthosImage('organic-materials-textiles-natural-light', 1000, 650, 'organic,nature,sustainable,textiles'), // Larger, evocative image
        link: '#our-sustainability',
        reverse: true, // Alternate layout
    },
    {
        id: 'community',
        headline: 'More Than a Product',
        paragraph: 'Élan Homewares is about building a legacy of mindful living. We partner directly with artisan communities, empowering them while creating treasured pieces meant to enrich lives for years to come.',
        image: getEthosImage('community-collaboration-weaving-joy', 1000, 650, 'community,collaboration,weaving'), // Larger, engaging image
        link: '#our-community',
    },
];

const BrandEthos: React.FC = () => {
    const theme = useTheme();
    const sectionRef = useRef<HTMLDivElement>(null);
    const [yOffset, setYOffset] = useState(0);

    const handleScroll = useCallback(() => {
        if (sectionRef.current) {
            // Calculate scroll position relative to the viewport top
            const sectionTop = sectionRef.current.getBoundingClientRect().top;
            const viewportHeight = window.innerHeight;
            // Only apply parallax when the section is within a reasonable range of the viewport
            if (sectionTop < viewportHeight && sectionTop > -sectionRef.current.offsetHeight) {
                setYOffset(sectionTop);
            } else {
                setYOffset(0); // Reset or stop parallax if far out of view
            }
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true }); // Use passive listener for performance
        handleScroll(); // Initial set
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [intersectingStates, setIntersectingStates] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        ethosStories.forEach((story, index) => {
            const blockRef = blockRefs.current[index];
            if (blockRef) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            setIntersectingStates(prevState => ({
                                ...prevState,
                                [story.id]: true
                            }));
                            observer.unobserve(blockRef);
                        }
                    },
                    { threshold: 0.25 } // Trigger when 25% of the block is visible
                );
                observer.observe(blockRef);
                observers.push(observer);
            }
        });

        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, []);

    return (
        <BrandEthosSection ref={sectionRef}>
            <IntroContainer>
                <h2>The Élan Ethos: Crafted with Soul.</h2>
                <p>At Élan Homewares, every piece is more than just an object; it’s a reflection of a deeper philosophy—a commitment to craftsmanship, sustainable living, and the enduring beauty found in intention.</p>
            </IntroContainer>

            <StoryBlocksContainer>
                {ethosStories.map((story, index) => (
                    <StoryBlock
                        key={story.id}
                        ref={el => blockRefs.current[index] = el}
                        $reverse={story.reverse}
                        $yOffset={yOffset}
                        $isIntersecting={intersectingStates[story.id] || false}
                        style={{ '--block-animation-delay': `${index * 0.25}s` } as React.CSSProperties} // Slightly more staggered block entry
                    >
                        <VisualWrapper>
                            <img src={story.image} alt={story.headline} loading="lazy" />
                            <LightWashOverlay />
                        </VisualWrapper>
                        <TextContent
                            $isIntersecting={intersectingStates[story.id] || false}
                            style={{ '--animation-delay': `${index * 0.25}s` } as React.CSSProperties} // Match block delay for staggered internal elements
                        >
                            <h3>{story.headline}</h3>
                            <p>{story.paragraph}</p>
                            <ReadMoreButton href={story.link} $isIntersecting={intersectingStates[story.id] || false}>
                                Discover More
                            </ReadMoreButton>
                        </TextContent>
                    </StoryBlock>
                ))}
            </StoryBlocksContainer>

            <IntroContainer style={{ marginTop: theme.spacing(24) }}>
                <ReadMoreButton href="#about-us" $isIntersecting={true}>
                    Explore Our Full Story
                </ReadMoreButton>
            </IntroContainer>
        </BrandEthosSection>
    );
};

export default BrandEthos;