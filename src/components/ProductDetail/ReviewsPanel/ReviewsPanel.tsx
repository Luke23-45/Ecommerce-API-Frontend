// src/components/ProductPage/ReviewsPanel/ReviewsPanel.tsx
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTheme, type DefaultTheme } from 'styled-components';
import { 
    FaStar, FaStarHalfAlt, FaRegStar, FaThumbsUp, FaRegThumbsUp, 
    FaEdit, FaCheckCircle, FaSpinner, FaTimes // Added FaTimes for cancel icon
} from 'react-icons/fa';

// Import all necessary styled components
import {
  ReviewsPanelWrapper,
  RatingSummaryContainer,
  OverallRating,
  RatingBreakdown,
  RatingBarRow,
  WriteReviewSection,
  WriteReviewFormArea,
  ReviewListContainer,
  ReviewItem,
  ReviewHeader,
  ReviewAvatar,
  ReviewAuthorInfo,
  ReviewRating,
  ReviewTitle,
  ReviewText,
  ReviewActions,
  ReviewsPaginationContainer,
} from './ReviewsPanel.styles';

// Import FrontendButton from your common components
import { FrontendButton } from '../Button.styles';
// --- IMPORT THE ACTUAL WriteReviewForm ---
import WriteReviewForm, { type NewReviewData } from './WriteReviewForm'; // ADJUST PATH
import { useNotification } from '@/contexts/NotificationContext';

// --- Type Definitions ---
export interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  date: string | Date;
  isVerifiedPurchase?: boolean;
  helpfulVotes?: number;
  // To track optimistic UI for helpful votes:
  // currentUserHasVotedHelpful?: boolean; // This might be better managed via helpfulVotesMap
}
export interface RatingDistribution {
  _5star: number; _4star: number; _3star: number; _2star: number; _1star: number;
}
export interface ProductReviewSummaryData {
  averageRating: number;
  totalReviews: number;
  distribution?: RatingDistribution;
}
// --- End Type Definitions ---

// --- Mock Data ---
const mockProductReviewSummary: ProductReviewSummaryData = {
  averageRating: 4.6,
  totalReviews: 78, // To show pagination better
  distribution: { _5star: 65, _4star: 20, _3star: 8, _2star: 4, _1star: 3 },
};
const generateMockReviews = (count: number): Review[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `rev${i + 1}_prod_${Math.random().toString(36).substring(7)}`,
    authorName: i % 3 === 0 ? `Elara V.${i}` : i % 3 === 1 ? `Marcus C.${i}` : `Sophie D.${i}`,
    authorAvatar: `https://i.pravatar.cc/48?u=review${i}`,
    rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)) as number,
    title: i % 2 === 0 ? `Great Product ${i + 1}!` : undefined,
    comment: `This is mock review number ${i + 1}. It provides some insightful feedback about the product quality, design, and overall experience. It's long enough to test line breaks and general readability.`,
    date: new Date(Date.now() - (i * 3) * 24 * 60 * 60 * 1000), // Stagger dates
    isVerifiedPurchase: i % 2 === 0,
    helpfulVotes: Math.floor(Math.random() * 30),
  }));
};
const mockInitialReviewsList: Review[] = generateMockReviews(5); // Initial 5 reviews
const allMockReviewsForProduct: Review[] = generateMockReviews(mockProductReviewSummary.totalReviews); // All reviews for product
// --- End Mock Data ---


interface ReviewsPanelProps {
  productId: string;
  productName: string;
  reviewSummaryDataProp?: ProductReviewSummaryData; // Use "Prop" suffix for clarity
  initialReviewsProp?: Review[];
  totalReviewCountFromBackend?: number; // If API gives total distinct from initial list length
  currentUserCanReview?: boolean;
  onWriteReviewSubmit?: (productId: string, reviewData: NewReviewData) => Promise<boolean | Review>; // Can return the new review or true
  onLoadMoreReviews?: (productId: string, nextPage: number, reviewsPerPage: number) => Promise<Review[] | null>;
}

const REVIEWS_PER_PAGE = 5; // How many reviews to load per "page"

const ReviewsPanel: React.FC<ReviewsPanelProps> = ({
  productId,
  productName,
  reviewSummaryDataProp = mockProductReviewSummary,
  initialReviewsProp = mockInitialReviewsList,
  totalReviewCountFromBackend = allMockReviewsForProduct.length, // Use total from all mocks
  currentUserCanReview = true, // Assume true for demo
  onWriteReviewSubmit,
  onLoadMoreReviews,
}) => {
  const theme = useTheme() as DefaultTheme;
  const { showNotification } = useNotification();
  
  const [reviewSummary, setReviewSummary] = useState(reviewSummaryDataProp);
  const [reviews, setReviews] = useState<Review[]>(initialReviewsProp);
  const [showWriteReviewForm, setShowWriteReviewForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [helpfulVotesMap, setHelpfulVotesMap] = useState<Record<string, { originalCount: number, voted: boolean }>>({});

  // Initialize helpfulVotesMap and local review count based on initialReviews
  useEffect(() => {
    setReviews(initialReviewsProp);
    const initialHelpfulVotes: Record<string, { originalCount: number, voted: boolean }> = {};
    initialReviewsProp.forEach(review => {
        initialHelpfulVotes[review.id] = { originalCount: review.helpfulVotes || 0, voted: false };
    });
    setHelpfulVotesMap(initialHelpfulVotes);
    setCurrentPage(1);
  }, [initialReviewsProp, productId]); // Reset on productId change too

  // Update summary if prop changes
  useEffect(() => {
    setReviewSummary(reviewSummaryDataProp);
  }, [reviewSummaryDataProp]);


  const renderStars = useCallback((rating: number, starSize: string = "1em") => {
    const fullStars = Math.floor(rating);
    const halfStar = parseFloat((rating % 1).toFixed(1)) >= 0.5 && parseFloat((rating % 1).toFixed(1)) < 1;
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));
    const stars = [];
    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`fs-${i}`} style={{ fontSize: starSize }} />);
    if (halfStar) stars.push(<FaStarHalfAlt key="hs" style={{ fontSize: starSize }} />);
    for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`es-${i}`} style={{ fontSize: starSize }} />);
    return stars;
  }, []);

  const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const toggleWriteReviewForm = useCallback(() => {
    setShowWriteReviewForm(prev => !prev);
  }, []);

  const handleActualReviewSubmit = async (data: NewReviewData): Promise<boolean> => {
    setIsSubmittingReview(true);
    try {
      let successOrNewReview: boolean | Review | void = false;
      if (onWriteReviewSubmit) {
        successOrNewReview = await onWriteReviewSubmit(productId, data);
      } else { // Mock submission
        console.log("Mock Review Submitted for product", productId, ":", data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const newMockReview: Review = { ...data, id: `rev_new_${Date.now()}`, authorName: "You (Preview)", date: new Date(), helpfulVotes: 0, isVerifiedPurchase: false};
        successOrNewReview = newMockReview; // Return the new review
      }

      if (successOrNewReview) {
        showNotification("Your review has been submitted successfully!", "success");
        setShowWriteReviewForm(false);
        // Optimistic update or refetch:
        if (typeof successOrNewReview === 'object' && successOrNewReview.id) { // If API returns the new review
            setReviews(prev => [successOrNewReview as Review, ...prev]);
            setReviewSummary(prev => prev ? ({...prev, totalReviews: prev.totalReviews + 1}) : undefined); // Increment total
        } else {
            // TODO: Implement refetch reviews logic here
            console.log("Review submitted, ideally refetch reviews list now.");
        }
        return true;
      } else {
        showNotification("There was an issue submitting your review.", "error");
        return false;
      }
    } catch (error: any) {
      showNotification(error.message || "Failed to submit review. Please try again later.", "error");
      return false;
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleHelpfulVote = useCallback((reviewId: string) => {
      setHelpfulVotesMap(prev => {
          const currentVoteState = prev[reviewId] || { originalCount: reviews.find(r => r.id === reviewId)?.helpfulVotes || 0, voted: false };
          return {
            ...prev,
            [reviewId]: { 
                ...currentVoteState,
                voted: !currentVoteState.voted 
            }
          };
      });
      // TODO: API call to record helpful vote. Increment/decrement `currentVoteState.originalCount` for display.
      console.log("Toggled helpful for review:", reviewId);
  }, [reviews]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const nextPageToFetch = currentPage + 1;
    try {
        let newReviews: Review[] | null = [];
        if (onLoadMoreReviews) {
            newReviews = await onLoadMoreReviews(productId, nextPageToFetch, REVIEWS_PER_PAGE);
        } else { // Mock "Load More"
            await new Promise(resolve => setTimeout(resolve, 800));
            const alreadyLoadedCount = reviews.length;
            newReviews = allMockReviewsForProduct.slice(alreadyLoadedCount, alreadyLoadedCount + REVIEWS_PER_PAGE);
        }

        if (newReviews && newReviews.length > 0) {
            setReviews(prev => [...prev, ...newReviews]);
            setCurrentPage(nextPageToFetch);
            const newHelpfulVotesMap = {...helpfulVotesMap};
            newReviews.forEach(r => {
                if (!newHelpfulVotesMap[r.id]) { // Avoid overwriting existing votes
                    newHelpfulVotesMap[r.id] = { originalCount: r.helpfulVotes || 0, voted: false };
                }
            });
            setHelpfulVotesMap(newHelpfulVotesMap);
        } else {
            showNotification("No more reviews to load.", "info", 2000);
        }
    } catch (error: any) {
        showNotification(error.message || "Failed to load more reviews.", "error");
    } finally {
        setIsLoadingMore(false);
    }
  };

  const hasMoreReviewsToLoad = reviews.length < (totalReviewCountFromBackend || 0);

  return (
    <ReviewsPanelWrapper theme={theme}>
      {reviewSummary && reviewSummary.totalReviews > 0 && (
        <RatingSummaryContainer theme={theme}>
          <OverallRating theme={theme}>
            <div className="average-score">{reviewSummary.averageRating.toFixed(1)}</div>
            <div className="star-display">{renderStars(reviewSummary.averageRating, "1.3rem")}</div>
            <div className="total-reviews">Based on {reviewSummary.totalReviews} reviews</div>
          </OverallRating>
          {reviewSummary.distribution && (
             <RatingBreakdown theme={theme}>
              {([5, 4, 3, 2, 1] as const).map(star => {
                const countOrPercent = reviewSummary.distribution?.[`_${star}star` as keyof RatingDistribution] || 0;
                // Assume distribution is percentages for the bar width
                const percentage = countOrPercent; 
                return (
                  <RatingBarRow theme={theme} key={star} title={`${percentage}% of reviews are ${star} stars`}>
                    <span className="star-label">{star} star{star > 1 ? 's' : ''}</span>
                    <div className="bar-container">
                      <div className="bar-fill" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="percentage">{percentage}%</span>
                  </RatingBarRow>
                );
              })}
            </RatingBreakdown>
          )}
        </RatingSummaryContainer>
      )}

      {currentUserCanReview && (
        <WriteReviewSection theme={theme}>
            <p>Loving your new Élan piece? Share your experience!</p>
            <FrontendButton 
                theme={theme} 
                $variant={showWriteReviewForm ? "secondary" : "primary"} 
                $size="medium" 
                onClick={toggleWriteReviewForm} 
                aria-expanded={showWriteReviewForm}
                aria-controls="write-review-form-area"
            >
                <FaEdit style={{marginRight: theme.spacing(1.5)}}/> 
                {showWriteReviewForm ? 'Cancel Review' : 'Write a Review'}
            </FrontendButton>
        </WriteReviewSection>
      )}

      {showWriteReviewForm && currentUserCanReview && (
          <WriteReviewFormArea theme={theme} id="write-review-form-area">
              <WriteReviewForm 
                productName={productName}
                onSubmit={handleActualReviewSubmit} 
                onCancel={toggleWriteReviewForm}
                isSubmittingExternally={isSubmittingReview}
              />
          </WriteReviewFormArea>
      )}

      <ReviewListContainer theme={theme}>
        {reviews.length > 0 ? reviews.map((review, index) => {
          const currentHelpfulData = helpfulVotesMap[review.id] || { originalCount: review.helpfulVotes || 0, voted: false };
          const displayHelpfulCount = currentHelpfulData.originalCount + (currentHelpfulData.voted ? 1 : 0) - ( (review.helpfulVotes || 0) < currentHelpfulData.originalCount && currentHelpfulData.voted ? 1 : 0 ); // crude optimistic update example

          return (
          <ReviewItem 
            theme={theme} 
            key={review.id}
            style={{'--review-item-delay': `${0.1 + index * 0.07}s`} as React.CSSProperties}
          >
            <ReviewHeader theme={theme}>
              <ReviewAvatar 
                theme={theme} 
                src={review.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.authorName)}&background=random&size=48`} 
                alt={`${review.authorName}'s avatar`} 
              />
              <ReviewAuthorInfo theme={theme}>
                <div className="author-name">{review.authorName}</div>
                <div className="review-date">{formatDate(review.date)}</div>
              </ReviewAuthorInfo>
            </ReviewHeader>
            <ReviewRating theme={theme}>{renderStars(review.rating, "0.9rem")}</ReviewRating>
            {review.title && <ReviewTitle theme={theme}>{review.title}</ReviewTitle>}
            <ReviewText theme={theme}>{review.comment}</ReviewText>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing(2.5)}}>
                {review.isVerifiedPurchase && 
                    <p style={{fontSize: theme.typography.body.sizes.xsmall, color: theme.colors.accent2, fontWeight: theme.typography.body.weights.medium, margin: 0, display: 'flex', alignItems: 'center', gap: theme.spacing(1)}}>
                        <FaCheckCircle /> Verified Purchase
                    </p>
                }
                <ReviewActions theme={theme} style={{marginLeft: review.isVerifiedPurchase ? 'auto': '0' }}>
                    <button 
                        onClick={() => handleHelpfulVote(review.id)} 
                        title={currentHelpfulData.voted ? "Undo helpful vote" : "Mark as helpful"}
                        className={currentHelpfulData.voted ? 'active' : ''}
                        aria-pressed={currentHelpfulData.voted}
                    >
                        {currentHelpfulData.voted ? <FaThumbsUp /> : <FaRegThumbsUp />} 
                        Helpful ({displayHelpfulCount})
                    </button>
                </ReviewActions>
            </div>
          </ReviewItem>
        )}) : (
          <p style={{textAlign: 'center', color: theme.colors.darkGray, padding: theme.spacing(6), fontFamily: theme.typography.body.fontFamily}}>
            Be the first to share your insights on the {productName}.
          </p>
        )}
      </ReviewListContainer>

      {hasMoreReviewsToLoad && !isLoadingMore && (
        <ReviewsPaginationContainer>
          <FrontendButton 
            theme={theme} 
            $variant="secondary" 
            $size="medium" 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading...' : 'Load More Reviews'}
          </FrontendButton>
        </ReviewsPaginationContainer>
      )}
      {isLoadingMore && (
        <div style={{textAlign: 'center', padding: theme.spacing(4)}}>
            <FaSpinner className="fa-spin" style={{fontSize: '1.8rem', color: theme.colors.accent1}}/>
        </div>
      )}
    </ReviewsPanelWrapper>
  );
};

export default ReviewsPanel;