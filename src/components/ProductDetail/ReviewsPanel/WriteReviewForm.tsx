// src/components/ProductPage/ReviewsPanel/WriteReviewForm.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useTheme, type DefaultTheme } from 'styled-components';
import { FaStar, FaRegStar, FaPaperPlane, FaTimes, FaInfoCircle, FaSpinner } from 'react-icons/fa';


import { FrontendButton } from '../Button.styles';
import { FrontendForm } from '@/pages/profile/UserProfilePage.styles';
import { FrontendFormField } from '@/pages/profile/UserProfilePage.styles';
import { FrontendTextArea } from './WriteReviewForm.styles';
import { FrontendFormLabel,FrontendFormInput } from '@/pages/profile/UserProfilePage.styles';
import { HelperText } from '@/components/seller/IndividualSellerProfileForm.styles';
// Import styles specific to this form (StarRatingInput)
import {
  StarRatingInputContainer,
  MinCharIndicator
} from './WriteReviewForm.styles'; 

// Assuming FrontendTextArea is in Common/Form.styles.ts, if not, define it here or import it
// For this example, let's assume it's defined with other FrontendForm components:
// import { FrontendTextArea } from '@/components/Common/Form.styles'; // Or wherever it lives

export interface NewReviewData {
  rating: number;      // 1-5
  title?: string;     // Optional
  comment: string;
  // productId and userId would be added by the parent ReviewsPanel or backend context
}

interface WriteReviewFormProps {
  productName: string;
  onSubmit: (reviewData: NewReviewData) => Promise<boolean | void>; // Promise indicates async operation
  onCancel: () => void;
  isSubmittingExternally?: boolean; // If parent component controls overall submission state
  minCommentLength?: number;
}

const WriteReviewForm: React.FC<WriteReviewFormProps> = ({
  productName,
  onSubmit,
  onCancel,
  isSubmittingExternally = false,
  minCommentLength = 50, // Example: Default min length
}) => {
  const theme = useTheme() as DefaultTheme;

  const [rating, setRating] = useState(0); // 0 = not rated
  const [hoverRating, setHoverRating] = useState(0); // For star hover effect
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  
  const [errors, setErrors] = useState<Partial<Record<keyof NewReviewData | 'formError', string>>>({});
  const [isSubmittingLocally, setIsSubmittingLocally] = useState(false);

  const isEffectivelySubmitting = isSubmittingExternally || isSubmittingLocally;

  // Reset form when it's re-shown (e.g., after a successful submission if parent re-opens it)
  // This depends on how parent manages showWriteReviewForm state.
  // For now, assuming it resets if key changes or component unmounts/remounts.

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof NewReviewData | 'formError', string>> = {};
    let isValid = true;

    if (rating === 0) {
      newErrors.rating = 'Please select a star rating.';
      isValid = false;
    }
    if (!comment.trim()) {
      newErrors.comment = 'Please share your thoughts in the comment section.';
      isValid = false;
    } else if (comment.trim().length < minCommentLength) {
      newErrors.comment = `Your review comment must be at least ${minCommentLength} characters long.`;
      isValid = false;
    }
    
    // Optional: Title validation if it's not empty
    if (title.trim() && title.trim().length < 3) {
      newErrors.title = 'If provided, the title must be at least 3 characters.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [rating, comment, title, minCommentLength]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isEffectivelySubmitting) {
      return;
    }
    setIsSubmittingLocally(true);
    setErrors({}); 

    try {
      const reviewData: NewReviewData = { 
        rating, 
        title: title.trim() || undefined, // Send undefined if title is empty
        comment: comment.trim() 
      };
      const submissionResult = await onSubmit(reviewData);
      
      if (submissionResult !== false) { // Assume true or void means success
        // Optionally reset form on successful submission by parent
        // setRating(0); setTitle(''); setComment('');
        // Parent (ReviewsPanel) might close the form and show a success notification
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      setErrors({ formError: error.message || "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmittingLocally(false);
    }
  };

  const charsRemaining = minCommentLength - comment.trim().length;
  const commentHelperText = errors.comment 
    ? <HelperText theme={theme} error><FaInfoCircle /> {errors.comment}</HelperText>
    : charsRemaining > 0 
    ? <MinCharIndicator theme={theme}>{charsRemaining} more character{charsRemaining !== 1 ? 's' : ''} needed.</MinCharIndicator>
    : <MinCharIndicator theme={theme} style={{color: theme.colors.adminStatusSuccess}}>Looks good!</MinCharIndicator>;

  return (
    <FrontendForm theme={theme} onSubmit={handleSubmit} noValidate aria-labelledby="review-form-title">
      <h3 id="review-form-title" style={{ // Using h3 style consistent with DescriptionPanel/TabPanel
          fontFamily: theme.typography.heading.fontFamily,
          fontSize: theme.typography.heading.sizes.h5, 
          fontWeight: theme.typography.heading.weights.semiBold,
          color: theme.colors.textDark,
          margin: `0 0 ${theme.spacing(5)} 0`,
          textAlign: 'center',
          lineHeight: 1.3
        }}>
          Write a Review for {productName}
      </h3>

      {errors.formError && (
        <HelperText theme={theme} error style={{textAlign: 'center', marginBottom: theme.spacing(3)}}>
            <FaInfoCircle /> {errors.formError}
        </HelperText>
      )}
      
      <FrontendFormField theme={theme}>
        <FrontendFormLabel theme={theme} style={{textAlign: 'center', marginBottom: theme.spacing(1.5)}}>
          Your Overall Rating*
        </FrontendFormLabel>
        <StarRatingInputContainer theme={theme} role="radiogroup" aria-label="Select your rating for this product">
          {[1, 2, 3, 4, 5].map((starValue) => {
            const isCurrentlySelected = starValue <= rating;
            const isCurrentlyHovered = starValue <= hoverRating;
            return (
              <button
                type="button"
                key={starValue}
                className={isCurrentlySelected ? 'selected' : (isCurrentlyHovered ? 'hovered' : '')}
                onClick={() => { setRating(starValue); setErrors(prev => ({...prev, rating: undefined})); }}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
                aria-checked={isCurrentlySelected}
                role="radio" // Making each star a radio button in a group
                disabled={isEffectivelySubmitting}
                title={`Rate ${starValue} star${starValue !== 1 ? 's' : ''}`}
              >
                {isCurrentlyHovered || isCurrentlySelected ? <FaStar /> : <FaRegStar />}
              </button>
            );
          })}
        </StarRatingInputContainer>
        {errors.rating && <HelperText theme={theme} error style={{textAlign: 'center'}}><FaInfoCircle /> {errors.rating}</HelperText>}
      </FrontendFormField>

      <FrontendFormField theme={theme}>
        <FrontendFormLabel theme={theme} htmlFor="reviewFormTitle">Review Title (Optional)</FrontendFormLabel>
        <FrontendFormInput
          theme={theme}
          type="text"
          id="reviewFormTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., My new favorite piece!"
          disabled={isEffectivelySubmitting}
          maxLength={100} // Example max length
        />
        {/* No error shown for optional field unless specific rules violated when non-empty */}
         {errors.title && <HelperText theme={theme} error><FaInfoCircle /> {errors.title}</HelperText>}
      </FrontendFormField>

      <FrontendFormField theme={theme}>
        <FrontendFormLabel theme={theme} htmlFor="reviewFormComment">Your Review Comment*</FrontendFormLabel>
        <FrontendTextArea 
          theme={theme}
          id="reviewFormComment"
          value={comment}
          onChange={(e) => {setComment(e.target.value); setErrors(prev => ({...prev, comment: undefined})); }}
          placeholder={`Tell us more about your experience with the ${productName}. What did you love? What could be improved? (min. ${minCommentLength} characters)`}
          rows={7} // Increased rows for more space
          required
          minLength={minCommentLength}
          disabled={isEffectivelySubmitting}
          aria-describedby="commentHelper"
          hasError={!!errors.comment} // Pass error state for potential border highlight
        />
        <div id="commentHelper"> {/* Grouping helper texts for aria-describedby */}
            {commentHelperText}
        </div>
      </FrontendFormField>

      <div style={{ display: 'flex', gap: theme.spacing(3), marginTop: theme.spacing(5), justifyContent: 'flex-end' }}>
        <FrontendButton theme={theme} $variant="secondary" type="button" onClick={onCancel} disabled={isEffectivelySubmitting}>
          <FaTimes /> Cancel
        </FrontendButton>
        <FrontendButton theme={theme} $variant="primary" type="submit" disabled={isEffectivelySubmitting}>
          {isEffectivelySubmitting ? (<><FaSpinner className="fa-spin" style={{marginRight: theme.spacing(1.5)}}/> Submitting...</>) : (<><FaPaperPlane style={{marginRight: theme.spacing(1.5)}}/> Submit Review</>)}
        </FrontendButton>
      </div>
    </FrontendForm>
  );
};

export default WriteReviewForm;