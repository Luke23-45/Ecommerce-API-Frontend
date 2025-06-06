// src/components/BecomeAPartnerPage/FAQItem/FAQItem.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaPlus, FaMinus, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Or + and -

import {
  FAQItemWrapper,
  QuestionButton,
  FAQIcon,
  AnswerWrapper,
} from './FAQItem.styles'; // Adjust path

export interface FAQData {
  id: string;
  question: string;
  answer: string | React.ReactNode; // Answer can be simple string or complex JSX
}

interface FAQItemProps {
  item: FAQData;
  isOpen: boolean;
  onToggle: () => void; // Callback to parent to toggle this item's open state
}

const FAQItem: React.FC<FAQItemProps> = ({ item, isOpen, onToggle }) => {
  const answerRef = useRef<HTMLDivElement>(null);

  // If not using keyframe animation directly on $isOpen for answer,
  // use direct transitions for height:
  // const answerStyle = {
  //   maxHeight: isOpen && answerRef.current ? `${answerRef.current.scrollHeight}px` : '0',
  //   opacity: isOpen ? 1 : 0,
  //   // ... other transitionable properties if not using keyframes for opening
  // };
  // The CSS animation 'answerFadeInSlideDown' is simpler.

  return (
    <FAQItemWrapper $isOpen={isOpen}>
      <QuestionButton 
        onClick={onToggle} 
        aria-expanded={isOpen} 
        aria-controls={`faq-answer-${item.id}`}
      >
        <h4>{item.question}</h4>
        <FAQIcon $isOpen={isOpen}>
          {/* Using FaPlus for closed, FaMinus for open is also a good pattern */}
          {/* Or FaChevronDown for closed, FaChevronUp for open */}
          {isOpen ? <FaMinus /> : <FaPlus />} 
        </FAQIcon>
      </QuestionButton>
      <AnswerWrapper 
        id={`faq-answer-${item.id}`} 
        ref={answerRef} 
        $isOpen={isOpen}
        aria-hidden={!isOpen}
      >
        {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
      </AnswerWrapper>
    </FAQItemWrapper>
  );
};

export default FAQItem;