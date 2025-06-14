// src/pages/CheckoutPage/index.tsx

// ... (KEEP ALL YOUR EXISTING IMPORTS at the top of the file)
// Specifically ensure these are present:
import { useStartCheckout } from "./hooks/useCheckout"; // <<<< MAKE SURE THIS PATH IS CORRECT

// ... (KEEP CheckoutStepId type, VITE_APP_STRIPE_PUBLISHABLE_KEY, stripePromise, CHECKOUT_STEPS_CONFIG)

// --- INNER COMPONENT THAT USES STRIPE HOOKS ---
const InnerCheckoutContent: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements();

  // ADD THESE TWO NEW STATE VARIABLES:
  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true); // Start true

  // Log Stripe initialization status for debugging (KEEP THIS)
  useEffect(() => {
    console.log("[InnerCheckoutContent] Stripe Instance:", stripe);
    console.log("[InnerCheckoutContent] Elements Instance:", elements);
    if (!VITE_APP_STRIPE_PUBLISHABLE_KEY) {
      console.warn("[InnerCheckoutContent] Stripe Publishable Key (VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY) is not set in .env file!");
    }
  }, [stripe, elements]);

  // --- State Variables (KEEP ALL YOUR EXISTING ONES) ---
  const [currentStepId, setCurrentStepId] = useState<CheckoutStepId>("shippingAddress");
  // ... (completedSteps, selectedShippingAddress, selectedBillingAddress, etc. ... ALL OF THEM)
  const [isPageLoading, setIsPageLoading] = useState(false); // Keep this for OTHER async actions


  // INSTANTIATE useStartCheckout HOOK:
  const { mutate: startCheckoutMutation, isLoading: isStartingCheckoutSession } = useStartCheckout();
  // Note: isStartingCheckoutSession is the loading state from this specific mutation

  // ADD THIS useEffect HOOK TO START THE SESSION:
  useEffect(() => {
    setIsSessionLoading(true); // Explicitly set loading true when we attempt to start

    // **VERY IMPORTANT:** Define what your backend's /api/checkout/start endpoint needs.
    // If it needs a cartId:
    // const currentCartId = "YOUR_ACTUAL_CART_ID_FROM_APP_STATE"; // Get this from Redux, Context, etc.
    // const payloadForStart: StartCheckoutRequestDTO = { cartId: currentCartId };

    // If it just starts a session for the authenticated user or an empty guest session:
    const payloadForStart: StartCheckoutRequestDTO = {}; // Empty payload

    console.log("[InnerCheckoutContent] Attempting to start checkout session with payload:", payloadForStart);
    startCheckoutMutation(payloadForStart, {
      onSuccess: (sessionData) => {
        console.log("[InnerCheckoutContent] Checkout session started successfully:", sessionData);
        if (sessionData && sessionData._id) {
          setCheckoutSessionId(sessionData._id);
        } else {
          console.error("Session data or _id is missing from startCheckout response", sessionData);
          // Handle this critical error - perhaps show a message and prevent checkout
          alert("Critical error: Checkout session ID not received. Please try again.");
          navigate("/cart"); // Or appropriate error page/action
        }
        setIsSessionLoading(false);
      },
      onError: (error) => {
        // The hook's onError already shows a notification.
        // You might want more specific UI handling here if the session FAILS to start.
        console.error("[InnerCheckoutContent] Critical failure to start checkout session:", error);
        setIsSessionLoading(false);
        // Example: Show a persistent error message on the page and offer retry
        // For now, an alert and redirect:
        alert("We couldn't prepare your checkout at this time. Please try again or contact support if the problem persists.");
        navigate("/cart"); // Navigate back to cart or a safe page
      }
    });
  }, [startCheckoutMutation, navigate]); // Dependency array ensures this runs once

  // --- Memoized Step Order (KEEP THIS) ---
  const stepOrder: CheckoutStepId[] = useMemo(() => CHECKOUT_STEPS_CONFIG.map(s => s.id as CheckoutStepId), []);

  // --- Navigation and Step Completion Logic (KEEP ALL THESE HANDLERS) ---
  // handleGoToStep, markStepAsComplete, isCurrentStepValid, handleNextStep
  // IMPORTANT: Modify handleNextStep and any other function that makes an API call
  // to use the `checkoutSessionId` and be disabled if `checkoutSessionId` is null.

  // Example modification for handleNextStep:
  const handleNextStep = async () => {
    if (!checkoutSessionId) { // <<<< ADD THIS CHECK
      alert("Checkout session is not active. Please refresh.");
      return;
    }
    if (!isCurrentStepValid()) {
      alert("Please ensure all fields in the current step are completed correctly.");
      return;
    }

    // ... (rest of your handleNextStep logic) ...
    // All calls to mutations that require sessionId should now pass it:
    // E.g., if you had `setShippingAddressMutation.mutate({ addressId: selectedShippingAddress!._id })`
    // It becomes: `setShippingAddressMutation.mutate({ sessionId: checkoutSessionId, addressId: selectedShippingAddress!._id })`
    // This applies to setBillingAddress, setShippingMethod, Stripe tokenization using session context, etc.
    // Example when tokenizing a new card in handleNextStep:
    if (currentStepId === 'paymentMethod' && selectedPaymentInfo?.type === 'new_card' && selectedPaymentInfo.requiresSetup) {
        setIsPageLoading(true);
        // ... (stripe/elements checks) ...
        // const { error, paymentMethod } = await stripe.createPaymentMethod(...);
        // if (!error && paymentMethod) {
        //    const setPaymentDetails = useSetPaymentDetails(); // Get the mutation
        //    setPaymentDetails.mutate(
        //        { sessionId: checkoutSessionId, paymentMethodId: paymentMethod.id, ... },
        //        { onSuccess: () => { /* mark complete, navigate */ }}
        //    );
        // }
        // Your existing logic for createPaymentMethod is good, just ensure sessionId is used IF
        // your backend call (setPaymentDetailsOnSession) needs it after getting paymentMethod.id from Stripe.
    }
  };


  // --- Render Functions for Dynamic Content (KEEP THESE) ---
  // renderActiveStepContent, renderCompletedStepSummary, getPrimaryButtonText

  // --- Data for BriefOrderSummary (KEEP THIS) ---
  // const orderSummaryForBrief: OrderSummaryData = useMemo(() => ({...}), [...]);
  // Later, this will be:
  // const { data: actualOrderSummary, isLoading: isLoadingOrderSummary } = useGetOrderSummary(checkoutSessionId);
  // const orderSummaryForBrief = actualOrderSummary || FALLBACK_EMPTY_SUMMARY;


  // --- JSX Return for InnerCheckoutContent ---

  // UPDATE THE INITIAL LOADING CONDITION:
  if (isSessionLoading) { // Primary loading state: waiting for session
    return (
        <CheckoutPageWrapper>
            <CheckoutContentLimiter style={{textAlign: 'center', paddingTop: '5rem'}}>
                <p>Preparing your secure session...</p>
                {/* TODO: Add a branded loading spinner */}
            </CheckoutContentLimiter>
        </CheckoutPageWrapper>
    );
  }

  // Fallback if session ID wasn't obtained after loading attempt
  if (!checkoutSessionId) {
      return (
          <CheckoutPageWrapper>
              <CheckoutContentLimiter style={{textAlign: 'center', paddingTop: '5rem'}}>
                  <p>Could not initialize your checkout session. Please <button onClick={() => window.location.reload()}>try refreshing</button> or return to your cart.</p>
              </CheckoutContentLimiter>
          </CheckoutPageWrapper>
      );
  }

  // If Stripe is still loading for some reason AFTER session is ready (less common with current structure but safe)
  if (!stripe || !elements) {
    return (
        <CheckoutPageWrapper>
            <CheckoutContentLimiter style={{textAlign: 'center', paddingTop: '5rem'}}>
                <p>Initializing payment system...</p>
                {/* TODO: Add a branded loading spinner */}
            </CheckoutContentLimiter>
        </CheckoutPageWrapper>
    );
  }

  // ACTUAL CONTENT IS RENDERED BELOW (KEEP YOUR EXISTING RETURN STRUCTURE)
  return (
    <CheckoutPageWrapper>
      <CheckoutContentLimiter>
        {/* ... (Your CheckoutHeader) ... */}
        <CheckoutMainGrid>
          <CheckoutFlowColumn>
            <CheckoutStepper
              steps={CHECKOUT_STEPS_CONFIG}
              currentStepId={currentStepId}
              completedSteps={completedSteps}
              onStepClick={handleGoToStep} // Make sure this is enabled only when checkoutSessionId is present
            />
            {/* ... (map for renderCompletedStepSummary) ... */}
            {/* ... (ActiveSectionWrapper and renderActiveStepContent) ... */}
            {/* ... (GlobalContinueButtonWrapper and PrimaryCtaButton) ... */}
            {/* Ensure buttons are disabled if !checkoutSessionId initially */}
          </CheckoutFlowColumn>
          <OrderSummaryColumn>
            <BriefOrderSummary
              // summary will eventually come from useGetOrderSummary(checkoutSessionId)
              // For now, it uses the mock-based orderSummaryForBrief
              // ... (other props for BriefOrderSummary)
            />
          </OrderSummaryColumn>
        </CheckoutMainGrid>
      </CheckoutContentLimiter>
    </CheckoutPageWrapper>
  );
};
// --- END INNER COMPONENT ---


// --- MAIN EXPORTED COMPONENT (WRAPPER - KEEP THIS AS IS) ---
const CheckoutPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise} options={{ /* global Stripe Element options if any */ }}>
      <InnerCheckoutContent />
    </Elements>
  );
};

export default CheckoutPage;