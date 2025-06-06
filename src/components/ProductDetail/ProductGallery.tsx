import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme, type DefaultTheme } from 'styled-components';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import {
  GalleryWrapper,
  MainImageContainer,
  ThumbnailList,
  ThumbnailItem,
  LightboxOverlay,
  LightboxContent,
  LightboxCloseButton,
  LightboxNavArrow,
} from './ProductGallery.styles';

export interface ProductImage {
  id: string | number;
  src: string;
  alt: string;
  thumbnailSrc?: string;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
  defaultImageIndex?: number;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  defaultImageIndex = 0,
}) => {
  const theme = useTheme() as DefaultTheme; // Ensure DefaultTheme is correctly typed from your ThemeProvider
  const [selectedImageIndex, setSelectedImageIndex] = useState(defaultImageIndex);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isLightboxImageChanging, setIsLightboxImageChanging] = useState(false);
  const lightboxImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const newIndex = defaultImageIndex >= 0 && defaultImageIndex < images.length ? defaultImageIndex : 0;
    setSelectedImageIndex(newIndex);
  }, [images, defaultImageIndex]);

  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  const openLightbox = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    document.body.style.overflow = ''; // Restore background scroll
  }, []);

  const changeLightboxImage = useCallback((newIndexCallback: (prevIndex: number) => number) => {
    if (images.length <= 1) return;
    setIsLightboxImageChanging(true);
    // Short timeout to allow opacity transition to start on current image
    setTimeout(() => {
      setSelectedImageIndex(prevIndex => {
        const newIndex = newIndexCallback(prevIndex);
        return newIndex;
      });
      // isLightboxImageChanging will be set to false in the useEffect below
    }, 150); // Corresponds to the fade-out part of a potential cross-fade
  }, [images.length]);


  useEffect(() => {
    if (isLightboxImageChanging) {
      // This effect runs after selectedImageIndex has been updated and the component re-rendered.
      // We ensure the 'changing' state is removed so the new image can fade in.
      const timer = setTimeout(() => setIsLightboxImageChanging(false), 50); // Small delay for re-render and new image to load
      return () => clearTimeout(timer);
    }
  }, [selectedImageIndex, isLightboxImageChanging]);


  const nextLightboxImage = useCallback(() => {
    changeLightboxImage(prevIndex => (prevIndex + 1) % images.length);
  }, [images.length, changeLightboxImage]);

  const prevLightboxImage = useCallback(() => {
    changeLightboxImage(prevIndex => (prevIndex - 1 + images.length) % images.length);
  }, [images.length, changeLightboxImage]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLightboxOpen) {
        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowRight' && images.length > 1) nextLightboxImage();
        if (event.key === 'ArrowLeft' && images.length > 1) prevLightboxImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (isLightboxOpen) { // Ensure body overflow is reset if component unmounts while lightbox is open
        document.body.style.overflow = '';
      }
    };
  }, [isLightboxOpen, closeLightbox, nextLightboxImage, prevLightboxImage, images.length]);

  if (!images || images.length === 0) {
    return (
      <GalleryWrapper theme={theme} style={{ justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <MainImageContainer theme={theme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderStyle: 'dashed', width: '100%', height: '100%' }}>
          <p style={{ color: theme.colors?.darkGray || '#555' }}>No images available</p>
        </MainImageContainer>
      </GalleryWrapper>
    );
  }

  const currentImage = images[selectedImageIndex] || images[0];

  return (
    <>
      <GalleryWrapper theme={theme}>
        {images.length > 1 && (
          <ThumbnailList theme={theme} aria-label="Product image thumbnails">
            {images.map((image, index) => (
              <ThumbnailItem
                theme={theme}
                key={image.id || index}
                $isActive={index === selectedImageIndex}
                onClick={() => handleThumbnailClick(index)}
                aria-label={`View image ${index + 1} of ${productName}`}
                aria-current={index === selectedImageIndex ? "true" : "false"}
              >
                <img
                  src={image.thumbnailSrc || image.src}
                  alt={`Thumbnail for ${image.alt || productName} - view ${index + 1}`}
                  loading="lazy"
                />
              </ThumbnailItem>
            ))}
          </ThumbnailList>
        )}
        <MainImageContainer
          theme={theme}
          onClick={() => openLightbox(selectedImageIndex)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && openLightbox(selectedImageIndex)}
          aria-label={`View larger image of ${currentImage.alt || productName}`}
        >
          <img
            key={currentImage.src}
            src={currentImage.src}
            alt={currentImage.alt || `${productName} - view ${selectedImageIndex + 1}`}
            loading="lazy"
          />
        </MainImageContainer>
      </GalleryWrapper>

      {isLightboxOpen && (
        <LightboxOverlay theme={theme} $isOpen={isLightboxOpen} onClick={closeLightbox} aria-hidden={!isLightboxOpen}>
          <LightboxContent
            theme={theme}
            $isOpen={isLightboxOpen}
            onClick={(e) => e.stopPropagation()} /* Prevent closing when clicking on content */
            role="dialog"
            aria-modal="true"
            aria-label={`Zoomed image view of ${currentImage.alt || productName}`}
          >
            {/* Close button is part of LightboxContent for positioning relative to it */}
            <LightboxCloseButton theme={theme} onClick={closeLightbox} aria-label="Close zoomed image view">
              <FaTimes />
            </LightboxCloseButton>

            {images.length > 1 && (
              <>
                <LightboxNavArrow
                  theme={theme}
                  $direction="left"
                  onClick={(e) => { e.stopPropagation(); prevLightboxImage(); }}
                  disabled={images.length <= 1}
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </LightboxNavArrow>
                <LightboxNavArrow
                  theme={theme}
                  $direction="right"
                  onClick={(e) => { e.stopPropagation(); nextLightboxImage(); }}
                  disabled={images.length <= 1}
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </LightboxNavArrow>
              </>
            )}
            
            <div className="lightbox-image-wrapper">
                <img
                    ref={lightboxImageRef}
                    key={currentImage.src + '-lightbox'} // Unique key ensures re-render for new src
                    src={currentImage.src}
                    alt={currentImage.alt || `${productName} - zoomed view ${selectedImageIndex + 1}`}
                    className={isLightboxImageChanging ? 'lightbox-image-changing' : ''}
                    onLoad={() => {
                        // Optional: could be used to more precisely time the removal of 'lightbox-image-changing'
                        // For example, if the setTimeout approach is not smooth enough for very large images.
                        // if (isLightboxImageChanging) setIsLightboxImageChanging(false);
                    }}
                />
            </div>
          </LightboxContent>
        </LightboxOverlay>
      )}
    </>
  );
};

export default ProductGallery;