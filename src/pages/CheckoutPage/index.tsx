import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaShippingFast,
  FaCreditCard,
  FaSpinner,
} from "react-icons/fa";
import {
  CardElement,
  useElements,
  useStripe,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutStepper, {
  type CheckoutStepItem,
} from "./CheckoutStepper/CheckoutStepper";
import AddressSection, {
  type Address,
} from "@/components/checkout/AddressSection/AddressSection";
import ShippingMethodSection, {
  type ShippingOption,
} from "@/components/checkout/ShippingMethodSection/ShippingMethodSection";
import PaymentMethodSection, {
  type SelectedPaymentInfo,
} from "@/components/checkout/PaymentMethodSection/PaymentMethodSection";
import BriefOrderSummary, {
  type OrderSummaryData,
  type BriefCartItemPreview,
  type AppliedDiscountInfo,
} from "@/components/checkout/BriefOrderSummary/BriefOrderSummary";

import { PrimaryCtaButton } from "../BecomeAPartnerPage/BecomeAPartnerPage.styles";

import {
  CheckoutPageWrapper,
  CheckoutContentLimiter,
  CheckoutHeader,
  BackButton,
  CheckoutMainGrid,
  CheckoutFlowColumn,
  OrderSummaryColumn,
  ActiveSectionWrapper,
  CompletedSectionSummaryWrapper,
  SummaryDetails,
  EditButton,
  GlobalContinueButtonWrapper,
} from "./CheckoutPage.styles";

import {
  useStartCheckout,
  useSetShippingAddress,
  useSetBillingAddress,
  useGetShippingMethods,
  useSetShippingMethod,
  useGetOrderSummary,
  useApplyDiscount,
  useSetPaymentDetails,
} from "@/hooks/general/useCheckout";

import type {
  StartCheckoutRequestDTO,
  SetAddressDTO,
  SetShippingMethodDTO,
  ApplyDiscountDTO,
  SetPaymentDetailsRequestDTO,
  OrderSummaryResult,
} from "@/types/checkout.types";
import { useGetCart } from "@/hooks/cart/useCart";

export type CheckoutStepId =
  | "shippingAddress"
  | "billingAddress"
  | "shippingMethod"
  | "paymentMethod";

const VITE_APP_STRIPE_PUBLISHABLE_KEY = import.meta.env
  .VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(
  VITE_APP_STRIPE_PUBLISHABLE_KEY ??
    "pk_test_YOUR_VALID_TEST_PUBLISHABLE_KEY_HERE"
);

const CHECKOUT_STEPS_CONFIG: CheckoutStepItem[] = [
  { id: "shippingAddress", label: "Shipping", icon: <FaMapMarkerAlt /> },
  { id: "billingAddress", label: "Billing", icon: <FaMapMarkerAlt /> },
  { id: "shippingMethod", label: "Delivery", icon: <FaShippingFast /> },
  { id: "paymentMethod", label: "Payment", icon: <FaCreditCard /> },
];

const InnerCheckoutContent: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements();

  const [checkoutSessionId, setCheckoutSessionId] = useState<string | null>(
    null
  );
  const [currentStepId, setCurrentStepId] =
    useState<CheckoutStepId>("shippingAddress");
  const [completedSteps, setCompletedSteps] = useState<CheckoutStepId[]>([]);

  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<Address | null>(null);
  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<Address | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<ShippingOption | null>(null);
  const [selectedPaymentInfo, setSelectedPaymentInfo] =
    useState<SelectedPaymentInfo | null>(null);

  const [operationError, setOperationError] = useState<string | null>(null);
  const [discountFeedback, setDiscountFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const { mutate: startCheckoutMutation, isLoading: isStartingSession } =
    useStartCheckout();

  const {
    mutateAsync: setShippingAddressOnSession,
    isLoading: isSettingShippingAddress,
  } = useSetShippingAddress();

  const {
    mutateAsync: setBillingAddressOnSession,
    isLoading: isSettingBillingAddress,
  } = useSetBillingAddress();

  const {
    data: shippingOptionsData,
    isLoading: isLoadingShippingOptions,
    error: shippingOptionsError,
    refetch: refetchShippingOptions,
  } = useGetShippingMethods(checkoutSessionId, selectedShippingAddress?._id);

  const {
    mutateAsync: setShippingMethodOnSession,
    isLoading: isSettingShippingMethod,
  } = useSetShippingMethod();
  const {
    data: orderSummaryAPIResult,
    isLoading: isLoadingOrderSummary,
    error: orderSummaryError,
    refetch: refetchOrderSummary,
  } = useGetOrderSummary(checkoutSessionId);

  const { mutateAsync: applyDiscount, isLoading: isApplyingDiscountMutation } =
    useApplyDiscount();
  const { mutateAsync: setPaymentDetails, isLoading: isSettingPaymentDetails } =
    useSetPaymentDetails();



  useEffect(() => {
    if (!VITE_APP_STRIPE_PUBLISHABLE_KEY) console.warn("Stripe Key Missing!");
    if (!checkoutSessionId && !isStartingSession) {
      const payload: StartCheckoutRequestDTO = {};
      startCheckoutMutation(payload, {
        onSuccess: (sessionData) => {
          if (sessionData?._id) {
            setCheckoutSessionId(sessionData._id);
          } else {
            setOperationError(
              "Critical: Checkout session could not be established."
            );
          }
        },
        onError: (error: any) => {
          setOperationError(error.message || "Could not initialize checkout.");
        },
      });
    }
  }, [checkoutSessionId, startCheckoutMutation, isStartingSession]);

  useEffect(() => {
    if (
      currentStepId === "shippingMethod" &&
      shippingOptionsData &&
      shippingOptionsData.length > 0 &&
      !selectedShippingMethod
    ) {
      const defaultOption =
        shippingOptionsData.find((opt) => (opt as any).isDefault) ||
        shippingOptionsData[0];
      setSelectedShippingMethod(defaultOption);
    }
  }, [currentStepId, shippingOptionsData, selectedShippingMethod]);

  const stepOrder: CheckoutStepId[] = useMemo(
    () => CHECKOUT_STEPS_CONFIG.map((s) => s.id as CheckoutStepId),
    []
  );

  const handleGoToStep = (stepId: CheckoutStepId) => {
    console.log(stepId, "stepId---");
    const targetIndex = stepOrder.indexOf(stepId);
    console.log(stepId, "targetIndex---");
    const furthestCompletedIndex =
      completedSteps.length > 0
        ? stepOrder.indexOf(completedSteps[completedSteps.length - 1])
        : -1;
    if (targetIndex <= furthestCompletedIndex + 1) {
      if (
        completedSteps.includes(stepId) ||
        stepId === currentStepId ||
        targetIndex === furthestCompletedIndex + 1
      ) {
        setCurrentStepId(stepId);
        window.scrollTo(0, 0);
      }
    }
  };

  const markStepAsComplete = (stepId: CheckoutStepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps((prev) =>
        [...prev, stepId].sort(
          (a, b) => stepOrder.indexOf(a) - stepOrder.indexOf(b)
        )
      );
    }
  };

  const isCurrentStepValid = (): boolean => {
    console.log("test12132");
    switch (currentStepId) {
      case "shippingAddress":
        return !!selectedShippingAddress?._id;
      case "billingAddress":
        return !!selectedBillingAddress?._id;
      case "shippingMethod":
        return !!selectedShippingMethod?.id;
      case "paymentMethod":
        if (!selectedPaymentInfo) return false;
        if (selectedPaymentInfo.type === "saved")
          return !!selectedPaymentInfo.stripePaymentMethodId;
        return (
          selectedPaymentInfo.type === "new_card" &&
          !!selectedPaymentInfo.isCompleteAndValid
        );
      default:
        return false;
    }
  };

  const handleNextStep = async () => {
    console.log("this is fucking good.");
    if (!checkoutSessionId) {
      return;
    }
    if (!isCurrentStepValid()) {
      return;
    }

    setOperationError(null);

    let stepMutationSuccessful = false;
    let nextStepIdInFlow: CheckoutStepId | null = null;
    let shouldNavigateToReview = false;

    const currentStepSpecificIsLoading =
      (currentStepId === "shippingAddress" && isSettingShippingAddress) ||
      (currentStepId === "billingAddress" && isSettingBillingAddress) ||
      (currentStepId === "shippingMethod" && isSettingShippingMethod) ||
      (currentStepId === "paymentMethod" && isSettingPaymentDetails);

    if (currentStepSpecificIsLoading) return;

    try {
      switch (currentStepId) {
        case "shippingAddress":
          if (selectedShippingAddress?._id) {
            await setShippingAddressOnSession({
              sessionId: checkoutSessionId,
              addressId: selectedShippingAddress._id,
            } as SetAddressDTO);
            stepMutationSuccessful = true;
            nextStepIdInFlow = "billingAddress";
          } else {
            setOperationError("Please select a shipping address.");
          }
          break;
        case "billingAddress":
          if (selectedBillingAddress?._id) {
            await setBillingAddressOnSession({
              sessionId: checkoutSessionId,
              addressId: selectedBillingAddress._id,
            } as SetAddressDTO);
            stepMutationSuccessful = true;
            nextStepIdInFlow = "shippingMethod";
          } else {
            setOperationError("Please select a billing address.");
          }
          break;
        case "shippingMethod":
          if (selectedShippingMethod?.id) {
            await setShippingMethodOnSession({
              sessionId: checkoutSessionId,
              shippingMethodId: selectedShippingMethod.id,
            });
            stepMutationSuccessful = true;
            nextStepIdInFlow = "paymentMethod";
          } else {
            setOperationError("Please select a delivery method.");
          }
          break;

        case "paymentMethod":
          console.log(
            "CheckoutPage: handleNextStep - Payment Method case. selectedPaymentInfo:",
            JSON.stringify(selectedPaymentInfo)
          );

          if (!selectedPaymentInfo) {
            setOperationError(
              "Payment information is missing. Please select or enter payment details."
            );
            break;
          }

          if (
            selectedPaymentInfo.type === "new_card" &&
            selectedPaymentInfo.requiresSetup
          ) {
            console.log(
              "CheckoutPage: Path 1 - New card, requires Stripe tokenization."
            );
            if (!stripe || !elements) {
              throw new Error(
                "Stripe.js has not loaded. Please wait or refresh."
              );
            }
            const cardElementInstance = elements.getElement(CardElement);
            if (!cardElementInstance) {
              throw new Error(
                "Card Element not available. Please ensure the payment form is loaded correctly."
              );
            }

            setIsPageLoading(true);
            console.log(
              "CheckoutPage: Calling stripe.createPaymentMethod()..."
            );
            const { error: stripeError, paymentMethod: stripePM } =
              await stripe.createPaymentMethod({
                type: "card",
                card: cardElementInstance,
              });
            setIsPageLoading(false);

            if (stripeError) {
              console.error(
                "CheckoutPage: Stripe createPaymentMethod error:",
                stripeError
              );

              throw stripeError;
            }

            if (stripePM) {
              console.log(
                "CheckoutPage: Stripe PaymentMethod created successfully:",
                stripePM.id
              );

              const payloadForNewCard: SetPaymentDetailsRequestDTO = {
                sessionId: checkoutSessionId!,
                type: "ONE_TIME_TOKEN",
                token: stripePM.id,
                cardLast4: stripePM.card?.last4,
                cardBrand: stripePM.card?.brand,
                saveCard: !!selectedPaymentInfo.saveCard,
                billingAddressId: selectedBillingAddress?._id,
              };
              console.log(
                "CheckoutPage: Calling setPaymentDetails (to backend) for ONE_TIME_TOKEN:",
                JSON.stringify(payloadForNewCard)
              );
              await setPaymentDetails(payloadForNewCard);

              setSelectedPaymentInfo((prev) => ({
                ...prev!,
                type: "new_card",
                id: `tokenized_${stripePM.id}`,
                stripePaymentMethodId: stripePM.id,
                last4: stripePM.card?.last4,
                cardBrand: stripePM.card?.brand,
                requiresSetup: false,
                isCompleteAndValid: true,
              }));
              stepMutationSuccessful = true;
            } else {
              throw new Error(
                "Stripe.createPaymentMethod returned no error and no paymentMethod. Please try again."
              );
            }
          } else if (
            selectedPaymentInfo.type === "saved" &&
            selectedPaymentInfo.id
          ) {
            console.log(
              "CheckoutPage: Path 2 - Selected a SAVED card. App Saved Method ID:",
              selectedPaymentInfo.id
            );

            const payloadForSavedCard: SetPaymentDetailsRequestDTO = {
              sessionId: checkoutSessionId!,
              type: "SAVED_METHOD",
              methodId: selectedPaymentInfo.id,
              billingAddressId: selectedBillingAddress?._id,
            };
            console.log(
              "CheckoutPage: Calling setPaymentDetails (to backend) for SAVED_METHOD:",
              JSON.stringify(payloadForSavedCard)
            );
            await setPaymentDetails(payloadForSavedCard);
            stepMutationSuccessful = true;
          } else if (
            selectedPaymentInfo.type === "new_card" &&
            !selectedPaymentInfo.requiresSetup &&
            selectedPaymentInfo.stripePaymentMethodId
          ) {
            console.log(
              "CheckoutPage: Path 3 - New card, already tokenized (Stripe PM ID:",
              selectedPaymentInfo.stripePaymentMethodId,
              "). Using as ONE_TIME_TOKEN."
            );

            const payloadForAlreadyTokenizedNewCard: SetPaymentDetailsRequestDTO =
              {
                sessionId: checkoutSessionId!,
                type: "ONE_TIME_TOKEN",
                token: selectedPaymentInfo.stripePaymentMethodId,
                cardLast4: selectedPaymentInfo.last4,
                cardBrand: selectedPaymentInfo.cardBrand,
                saveCard: !!selectedPaymentInfo.saveCard,
                billingAddressId: selectedBillingAddress?._id,
              };
            console.log(
              "CheckoutPage: Calling setPaymentDetails (to backend) for already tokenized ONE_TIME_TOKEN:",
              JSON.stringify(payloadForAlreadyTokenizedNewCard)
            );
            await setPaymentDetails(payloadForAlreadyTokenizedNewCard);
            stepMutationSuccessful = true;
          } else {
            console.warn(
              "CheckoutPage: handleNextStep - Payment information is not in a recognized state for processing:",
              JSON.stringify(selectedPaymentInfo)
            );
            setOperationError(
              "Please complete your payment information or select a valid payment method."
            );
          }

          if (stepMutationSuccessful) {
            shouldNavigateToReview = true;
          }
          break;

        default:
          const _e: never = currentStepId;
          throw new Error(`Unhandled step: ${_e}`);
      }

      if (stepMutationSuccessful) {
        markStepAsComplete(currentStepId);
        if (shouldNavigateToReview) {
          navigate(`checkoutsummery/${checkoutSessionId}`,{replace:true});
        } else if (nextStepIdInFlow) {
          setCurrentStepId(nextStepIdInFlow);
        }
        window.scrollTo(0, 0);
      }
    } catch (error: any) {
      console.error(`Error saving step ${currentStepId}:`, error);
      setOperationError(
        error.message || "An error occurred. Please try again."
      );
    }
  };
  const onPaymentSelectionChange = React.useCallback(
    (selection: SelectedPaymentInfo | null) => {
      console.log(
        "CheckoutPage: onPaymentSelectionChange callback triggered by child. New selection:",
        JSON.stringify(selection)
      );
      setSelectedPaymentInfo((prev) => {
        if (!selection) {
          console.log(
            "CheckoutPage: onPaymentSelectionChange - Child provided null selection. Resetting selectedPaymentInfo."
          );
          return null;
        }

        const newInfo: SelectedPaymentInfo = {
          type: selection.type,
          id: selection.id,
          stripePaymentMethodId: selection.stripePaymentMethodId,
          last4: selection.last4,
          cardBrand: selection.cardBrand,
          requiresSetup: selection.requiresSetup,
          isCompleteAndValid: selection.isCompleteAndValid,
          saveCard: selection.saveCard,
        };

        if (
          prev &&
          prev.type === newInfo.type &&
          prev.id === newInfo.id &&
          prev.stripePaymentMethodId === newInfo.stripePaymentMethodId &&
          prev.isCompleteAndValid === newInfo.isCompleteAndValid &&
          prev.requiresSetup === newInfo.requiresSetup &&
          prev.saveCard === newInfo.saveCard &&
          prev.last4 === newInfo.last4 &&
          prev.cardBrand === newInfo.cardBrand
        ) {
          console.log(
            "CheckoutPage: onPaymentSelectionChange - New info is shallowly same as prev. Not updating state."
          );
          return prev;
        }

        console.log(
          "CheckoutPage: onPaymentSelectionChange - Updating selectedPaymentInfo from:",
          JSON.stringify(prev),
          "to:",
          JSON.stringify(newInfo)
        );
        return newInfo;
      });
    },
    [
      /* setSelectedPaymentInfo is stable, so no dependencies needed here if logic inside is self-contained */
    ]
  );
  const { data: cartData, isLoading: isLoadingCart } = useGetCart();
  const onPaymentValidityChange = React.useCallback(
    (
      isValid: boolean,
      requiresSetup: boolean,
      stripePaymentMethodIdToUse?: string,
      saveCardPreference?: boolean
    ) => {
      console.log(
        "CheckoutPage: onPaymentValidityChange callback triggered by child. Params:",
        {
          isValid,
          requiresSetup,
          stripePaymentMethodIdToUse,
          saveCardPreference,
        }
      );
      setSelectedPaymentInfo((prev) => {
        const currentType = requiresSetup
          ? "new_card"
          : stripePaymentMethodIdToUse
          ? "saved"
          : prev?.type || "new_card";

        const baseState: SelectedPaymentInfo =
          prev ||
          (currentType === "new_card"
            ? {
                type: "new_card",
                id: "new_card_intent",
                requiresSetup: true,
                isCompleteAndValid: false,
                saveCard: true,
              }
            : {
                type: "saved",
                requiresSetup: false,
                isCompleteAndValid: true,
              });

        let updatedInfo: SelectedPaymentInfo;

        if (currentType === "new_card") {
          updatedInfo = {
            ...baseState,
            type: "new_card",
            isCompleteAndValid: isValid,
            requiresSetup: true,
            saveCard:
              saveCardPreference !== undefined
                ? saveCardPreference
                : baseState.saveCard,

            stripePaymentMethodId: baseState.stripePaymentMethodId,
            last4: baseState.last4,
            cardBrand: baseState.cardBrand,
          };

          if (
            requiresSetup &&
            baseState.stripePaymentMethodId &&
            baseState.type === "new_card" &&
            !baseState.requiresSetup
          ) {
            updatedInfo.stripePaymentMethodId = undefined;
            updatedInfo.last4 = undefined;
            updatedInfo.cardBrand = undefined;
            updatedInfo.id = "new_card_intent";
          }
        } else {
          updatedInfo = {
            ...baseState,
            type: "saved",

            isCompleteAndValid: true,
            requiresSetup: false,
            saveCard: false,
          };

          if (stripePaymentMethodIdToUse) {
            updatedInfo.stripePaymentMethodId = stripePaymentMethodIdToUse;
          }
        }

        if (
          prev &&
          prev.type === updatedInfo.type &&
          prev.id === updatedInfo.id &&
          prev.stripePaymentMethodId === updatedInfo.stripePaymentMethodId &&
          prev.isCompleteAndValid === updatedInfo.isCompleteAndValid &&
          prev.requiresSetup === updatedInfo.requiresSetup &&
          prev.saveCard === updatedInfo.saveCard &&
          prev.last4 === updatedInfo.last4 &&
          prev.cardBrand === updatedInfo.cardBrand
        ) {
          console.log(
            "CheckoutPage: onPaymentValidityChange - New info is shallowly same as prev. Not updating state."
          );
          return prev;
        }

        console.log(
          "CheckoutPage: onPaymentValidityChange - Updating selectedPaymentInfo from:",
          JSON.stringify(prev),
          "to:",
          JSON.stringify(updatedInfo)
        );
        return updatedInfo;
      });
    },
    [
      /* setSelectedPaymentInfo is stable, so no dependencies needed here if logic inside is self-contained */
    ]
  );
  const renderActiveStepContent = () => {
    if (!checkoutSessionId && !isStartingSession)
      return <p>Initializing session or session failed.</p>;

    switch (currentStepId) {
      case "shippingAddress":
        return (
          <AddressSection
            key="shippingAddress"
            titleText="Shipping Address"
            selectedAddress={selectedShippingAddress}
            onSelectAddress={setSelectedShippingAddress}
            isBillingSection={false}
          />
        );
      case "billingAddress":
        return (
          <AddressSection
            key="billingAddress"
            titleText="Billing Address"
            selectedAddress={selectedBillingAddress}
            onSelectAddress={setSelectedBillingAddress}
            isBillingSection={true}
            canUseShippingAsBilling={true}
            shippingAddressForBilling={selectedShippingAddress}
          />
        );
      case "shippingMethod":
        return (
          <ShippingMethodSection
            key="shippingMethod"
            shippingOptions={shippingOptionsData || []}
            selectedMethod={selectedShippingMethod}
            onSelectMethod={setSelectedShippingMethod}
            isLoadingOptions={isLoadingShippingOptions}
            optionsError={shippingOptionsError as Error | null}
          />
        );
      case "paymentMethod":
        return (
          <PaymentMethodSection
            key="paymentMethod"
            selectedPaymentInfo={selectedPaymentInfo}
            onSelectionChange={onPaymentSelectionChange}
            onValidityChange={onPaymentValidityChange}
            processingError={
              currentStepId === "paymentMethod" ? operationError : null
            }
          />
        );
      default:
        const _e: never = currentStepId;
        return null;
    }
  };

  const getPrimaryButtonText = (): string => {
    const currentIndex = stepOrder.indexOf(currentStepId);
    if (currentIndex < stepOrder.length - 1)
      return `Continue to ${CHECKOUT_STEPS_CONFIG[currentIndex + 1].label}`;
    return "Proceed to Review Order";
  };

  // const orderSummaryForBrief: OrderSummaryData = useMemo(() => {
  //   const apiData = orderSummaryAPIResult?.data;
  //   const fallbackSubtotal = 0;

  //   return {
  //     itemCount:
  //       apiData?.calculatedItemsTotalQuantity ?? apiData?.items?.length ?? 0,
  //     currency: apiData?.currency ?? "USD",
  //     itemsPreview: (apiData?.items?.map((item) => ({
  //       id: item.productId?._id || item._id || `item-${Math.random()}`,
  //       name: item.productId?.name || item.name || "Unknown Item",
  //       quantity: item.quantity,
  //       image:
  //         item.productId?.imageUrls?.[0] ||
  //         item.imageUrl ||
  //         `https:
  //           item.productId?.name ||
  //           item.name ||
  //           "Item"
  //         ).substring(0, 1)}`,
  //       price: item.priceAtCheckout ?? item.productId?.price,
  //     })) || []) as BriefCartItemPreview[],
  //     subtotal: apiData?.calculatedItemsTotal ?? fallbackSubtotal,
  //     shippingCost: apiData?.calculatedShippingTotal,
  //     appliedDiscount: apiData?.discount?.[0]
  //       ? {
  //           code: apiData.discount[0].code,
  //           amount: apiData.calculatedDiscountTotal ?? 0,
  //           description: apiData.discount[0].summaryDescription,
  //         }
  //       : null,
  //     estimatedTaxes: apiData?.calculatedTaxTotal,
  //     grandTotal:
  //       apiData?.calculatedGrandTotal ??
  //       fallbackSubtotal -
  //         (apiData?.calculatedDiscountTotal || 0) +
  //         (apiData?.calculatedShippingTotal || 0) +
  //         (apiData?.calculatedTaxTotal || 0),
  //   };
  // }, [orderSummaryAPIResult]);
  // Placed inside InnerCheckoutContent in CheckoutPage.tsx

  // const orderSummaryForBrief: OrderSummaryData = useMemo(() => {
  //   console.log(
  //     "Memoizing orderSummaryForBrief. cartData:",
  //     cartData,
  //     "orderSummaryAPIResult:",
  //     orderSummaryAPIResult
  //   );

  //   const sessionSummary = orderSummaryAPIResult?.data;
  //   const cartItemsFromCartHook = cartData?.items;

  //   // --- Fallbacks ---
  //   const DEFAULT_CURRENCY = "USD";
  //   const FALLBACK_SUBTOTAL_IF_NEEDED = 0; // Used if sessionSummary.calculatedItemsTotal is not available

  //   // --- Item Count ---
  //   // Prefer count from session summary, fallback to summing cart quantities, then 0.
  //   const itemCount =
  //     sessionSummary?.calculatedItemsTotalQuantity ??
  //     cartItemsFromCartHook?.reduce(
  //       (sum, item) => sum + (item.quantity || 0),
  //       0
  //     ) ??
  //     0;

  //   // --- Currency ---
  //   // Prefer session currency, fallback to cart currency, then default.
  //   const currency =
  //     sessionSummary?.currency ??
  //     cartData?.currency ?? // Assuming cartData might have a top-level currency
  //     DEFAULT_CURRENCY;

  //   // --- Items Preview (for display purposes) ---
  //   // This will primarily use data from `cartData` for individual item details like name, image.
  //   // The price displayed per item will be the product's standard price from the cart.
  //   // The overall `subtotal` from `sessionSummary` will be the source of truth for calculation.
  //   console.log("cartItemsFromCartHook",cartItemsFromCartHook)
  //   const itemsPreview: BriefCartItemPreview[] = (cartItemsFromCartHook?.map(
  //     (cartItem: DetailedCartItem) => {
  //       // Determine the product object (it might be populated directly or nested under productId)
  //       // Ensure 'product' or 'productId' is the correct path in your DetailedCartItem type.
  //       const productDetails = cartItem.product || cartItem.productId;

  //       const itemName = productDetails?.name || "Unknown Item";
  //       const itemImage =
  //         productDetails?.imageUrls?.[0] ||
  //         productDetails?.imageUrl ||
  //         `https://via.placeholder.com/64?text=${itemName.substring(0, 1)}`;

  //       // Price for display: Using the price from the cart's product data.
  //       // If your `sessionSummary.items` array has `priceAtCheckout` per item and you can reliably
  //       // map cartItems to sessionSummary.items, you could use that here.
  //       // For now, keeping it simple with cart product price.
  //       const displayPrice = productDetails?.price;

  //       return {
  //         id:
  //           cartItem._id ||
  //           `cart-item-${Math.random().toString(36).substr(2, 9)}`, // Cart item's own unique ID
  //         name: itemName,
  //         quantity: cartItem.quantity || 0,
  //         image: itemImage,
  //         price: displayPrice, // This is for display of individual item price
  //       };
  //     }
  //   ) || []) as BriefCartItemPreview[];

  //   // --- Subtotal ---
  //   // THIS SHOULD COME FROM THE CHECKOUT SESSION SUMMARY.
  //   // It reflects the backend's calculation of all items, potentially after session-specific adjustments
  //   // but before checkout-step specific discounts (like a coupon code applied in checkout).
  //   const subtotal =
  //     sessionSummary?.calculatedItemsTotal ?? FALLBACK_SUBTOTAL_IF_NEEDED;

  //   // --- Applied Discount (from coupon codes, etc., applied during checkout) ---
  //   const appliedDiscountInfo: AppliedDiscountInfo | null = sessionSummary
  //     ?.discount?.[0]
  //     ? {
  //         code: sessionSummary.discount[0].code,
  //         amount: sessionSummary.calculatedDiscountTotal ?? 0, // Amount of this discount
  //         description: sessionSummary.discount[0].summaryDescription,
  //       }
  //     : null;

  //   // --- Shipping Cost (from selected shipping method, reflected in session summary) ---
  //   const shippingCost = sessionSummary?.calculatedShippingTotal; // Can be null or number

  //   // --- Estimated Taxes (as calculated by backend for the session so far) ---
  //   const estimatedTaxes = sessionSummary?.calculatedTaxTotal; // Can be null or number

  //   // --- Grand Total (THIS IS THE ONE CALCULATED AT THE VERY END BY THE BACKEND) ---
  //   // It will be null/undefined until the backend calculates it.
  //   // Your BriefOrderSummary component must handle a potentially undefined grandTotal.
  //   const grandTotal = sessionSummary?.calculatedGrandTotal;

  //   // Construct the final OrderSummaryData object
  //   const finalSummaryData: OrderSummaryData = {
  //     itemCount,
  //     currency,
  //     itemsPreview,
  //     subtotal,
  //     shippingCost: shippingCost === undefined ? null : shippingCost, // Ensure null if undefined
  //     appliedDiscount: appliedDiscountInfo,
  //     estimatedTaxes: estimatedTaxes === undefined ? null : estimatedTaxes, // Ensure null if undefined
  //     grandTotal: grandTotal === undefined ? null : grandTotal, // Ensure null if undefined
  //     // Add isShippingCostFinal, isTaxFinal, isGrandTotalFinal if your backend provides these
  //     // isShippingCostFinal: sessionSummary?.isShippingCostFinal ?? false,
  //     // isTaxFinal: sessionSummary?.isTaxFinal ?? false,
  //     // isGrandTotalFinal: sessionSummary?.isGrandTotalFinal ?? false,
  //   };

  //   console.log("Final orderSummaryForBrief constructed:", finalSummaryData);
  //   return finalSummaryData;
  // }, [orderSummaryAPIResult, cartData]); // Dependencies

  const orderSummaryForBrief: OrderSummaryData = useMemo(() => {
    console.log(
      "Memoizing orderSummaryForBrief. cartData:",
      cartData, // This is your cart structure
      "orderSummaryAPIResult:",
      orderSummaryAPIResult // This is from useGetOrderSummary
    );

    const sessionSummary = orderSummaryAPIResult?.data;
    const cartFromHook = cartData; // Renaming for clarity based on your data structure

    // --- Fallbacks ---
    const DEFAULT_CURRENCY = "USD";
    const FALLBACK_CART_SUBTOTAL = 0; // Used if cartData.subtotal is not available for fallback logic
    // but sessionSummary.calculatedItemsTotal is preferred

    // --- Item Count ---
    // 1. Prefer from session summary (most accurate for checkout context)
    // 2. Fallback to cart's top-level itemCount
    // 3. Fallback to summing quantities from cart items (if cart.itemCount missing)
    // 4. Fallback to 0
    const itemCount =
      sessionSummary?.calculatedItemsTotalQuantity ??
      cartFromHook?.itemCount ??
      cartFromHook?.items?.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      ) ??
      0;

    // --- Currency ---
    // Prefer session currency, then default. Cart doesn't seem to have a top-level currency in your example.
    const currency = sessionSummary?.currency ?? DEFAULT_CURRENCY;

    // --- Items Preview (for display purposes, using cartData) ---
    console.log(
      "cartFromHook?.items for mapping itemsPreview:",
      cartFromHook?.items
    ); // For debugging
    const itemsPreview: BriefCartItemPreview[] = (cartFromHook?.items?.map(
      (cartItem) => {
        // cartItem here is directly an item from your cartData.items array
        const itemName = cartItem.name || "Unknown Item"; // Directly from cart item
        const itemImage =
          cartItem.image || // Use 'image' field first
          cartItem.mainImageUrl || // Fallback to 'mainImageUrl'
          `https://via.placeholder.com/64?text=${itemName.substring(0, 1)}`;

        // Price for display: Use currentPrice from the cart item, fallback to price
        const displayPrice = cartItem.currentPrice ?? cartItem.price;

        return {
          id: cartItem._id, // Use the cart item's own _id
          name: itemName,
          quantity: cartItem.quantity || 0,
          image: itemImage,
          price: displayPrice, // This is for display of individual item price from cart
        };
      }
      // Ensure DetailedCartItem type matches your cart item structure if you use it for casting.
      // For now, direct access based on your JSON structure is used.
    ) || []) as BriefCartItemPreview[];

    // --- Subtotal ---
    // PRIORITY: Use the subtotal calculated by the backend for the checkout session.
    // This `calculatedItemsTotal` from the session is the most reliable subtotal for checkout.
    // Fallback to the cart's own subtotal only if the session one isn't available yet.
    const subtotal =
      sessionSummary?.calculatedItemsTotal ??
      cartFromHook?.subtotal ?? // Fallback to cart's subtotal
      FALLBACK_CART_SUBTOTAL;

    // --- Applied Discount (from coupon codes, etc., applied during checkout - from session) ---
    const appliedDiscountInfo: AppliedDiscountInfo | null = sessionSummary
      ?.discount?.[0]
      ? {
          code: sessionSummary.discount[0].code,
          amount: sessionSummary.calculatedDiscountTotal ?? 0,
          description: sessionSummary.discount[0].summaryDescription,
        }
      : null;

    // --- Shipping Cost (from selected shipping method - from session) ---
    const shippingCost = sessionSummary?.calculatedShippingTotal; // Can be null or number

    // --- Estimated Taxes (as calculated by backend for the session so far - from session) ---
    const estimatedTaxes = sessionSummary?.calculatedTaxTotal; // Can be null or number

    // --- Grand Total (THIS IS THE ONE CALCULATED AT THE VERY END BY THE BACKEND - from session) ---
    const grandTotal = sessionSummary?.calculatedGrandTotal;

    // Construct the final OrderSummaryData object
    const finalSummaryData: OrderSummaryData = {
      itemCount,
      currency,
      itemsPreview,
      subtotal,
      shippingCost: shippingCost === undefined ? null : shippingCost,
      appliedDiscount: appliedDiscountInfo,
      estimatedTaxes: estimatedTaxes === undefined ? null : estimatedTaxes,
      grandTotal: grandTotal === undefined ? null : grandTotal,
      // isShippingCostFinal: sessionSummary?.isShippingCostFinal ?? false, // If backend sends these
      // isTaxFinal: sessionSummary?.isTaxFinal ?? false,
      // isGrandTotalFinal: sessionSummary?.isGrandTotalFinal ?? false,
    };

    console.log("Final orderSummaryForBrief constructed:", finalSummaryData);
    return finalSummaryData;
  }, [orderSummaryAPIResult, cartData]);

  const isProcessingStep =
    isSettingShippingAddress ||
    isSettingBillingAddress ||
    isSettingShippingMethod ||
    isSettingPaymentDetails ||
    (currentStepId === "paymentMethod" &&
      selectedPaymentInfo?.type === "new_card" &&
      selectedPaymentInfo.requiresSetup &&
      isPageLoading);

  if (isStartingSession) {
    return (
      <CheckoutPageWrapper>
        <CheckoutContentLimiter
          style={{ textAlign: "center", paddingTop: "5rem" }}
        >
          <FaSpinner
            style={{
              fontSize: "2rem",
              animation: "spin 1s linear infinite",
              color: theme.colors.accent1,
            }}
          />
          <p
            style={{
              marginTop: theme.spacing(3),
              color: theme.colors.textMedium,
            }}
          >
            Preparing your secure session...
          </p>
        </CheckoutContentLimiter>
      </CheckoutPageWrapper>
    );
  }
  if (!checkoutSessionId && !isStartingSession) {
    return (
      <CheckoutPageWrapper>
        <CheckoutContentLimiter
          style={{ textAlign: "center", paddingTop: "5rem" }}
        >
          <p
            style={{
              color: theme.colors.error,
              marginBottom: theme.spacing(4),
            }}
          >
            {operationError || "Could not initialize your checkout."}
          </p>
          <PrimaryCtaButton onClick={() => window.location.reload()}>
            Try Again
          </PrimaryCtaButton>
          <BackButton
            onClick={() => navigate("/cart",{replace:true})}
            style={{
              marginTop: theme.spacing(3),
              display: "block",
              margin: "auto",
            }}
          >
            Return to Cart
          </BackButton>
        </CheckoutContentLimiter>
      </CheckoutPageWrapper>
    );
  }
  if (currentStepId === "paymentMethod" && (!stripe || !elements)) {
    return (
      <CheckoutPageWrapper>
        <CheckoutContentLimiter
          style={{ textAlign: "center", paddingTop: "5rem" }}
        >
          <FaSpinner
            style={{
              fontSize: "2rem",
              animation: "spin 1s linear infinite",
              color: theme.colors.accent1,
            }}
          />
          <p
            style={{
              marginTop: theme.spacing(3),
              color: theme.colors.textMedium,
            }}
          >
            Initializing payment system...
          </p>
        </CheckoutContentLimiter>
      </CheckoutPageWrapper>
    );
  }

  if (
    checkoutSessionId &&
    isLoadingOrderSummary &&
    !orderSummaryAPIResult?.data &&
    currentStepId !== "shippingAddress" &&
    currentStepId !== "billingAddress"
  ) {
    return (
      <CheckoutPageWrapper>
        <CheckoutContentLimiter
          style={{ textAlign: "center", paddingTop: "5rem" }}
        >
          <FaSpinner
            style={{
              fontSize: "2rem",
              animation: "spin 1s linear infinite",
              color: theme.colors.accent1,
            }}
          />
          <p
            style={{
              marginTop: theme.spacing(3),
              color: theme.colors.textMedium,
            }}
          >
            Loading order details...
          </p>
        </CheckoutContentLimiter>
      </CheckoutPageWrapper>
    );
  }
  const renderCompletedStepSummary = (stepConfigItem: CheckoutStepItem) => {
    const stepId = stepConfigItem.id as CheckoutStepId;
    if (stepId === currentStepId || !completedSteps.includes(stepId))
      return null;

    let summaryText: React.ReactNode = (
      <em style={{ color: theme.colors.textMuted }}>
        Information not provided.
      </em>
    );

    switch (stepId) {
      case "shippingAddress":
        summaryText = selectedShippingAddress ? (
          <>
            <p>
              <strong>
                {selectedShippingAddress.name ||
                  `${selectedShippingAddress.firstName || ""} ${
                    selectedShippingAddress.lastName || ""
                  }`.trim() ||
                  "N/A"}
              </strong>
            </p>
            <p>
              {selectedShippingAddress.street || "N/A"}{" "}
              {selectedShippingAddress.street2 || ""}
            </p>
            <p>{`${selectedShippingAddress.city || "N/A"}, ${
              selectedShippingAddress.state || "N/A"
            } ${selectedShippingAddress.zip || "N/A"}`}</p>
            <p>{selectedShippingAddress.country || "N/A"}</p>
          </>
        ) : (
          <em style={{ color: theme.colors.textMuted }}>
            No shipping address selected.
          </em>
        );
        break;
      case "billingAddress":
        const isSameAsShipping =
          selectedShippingAddress?._id === selectedBillingAddress?._id &&
          !!selectedShippingAddress;
        summaryText = selectedBillingAddress ? (
          isSameAsShipping ? (
            <p>Same as shipping address.</p>
          ) : (
            <>
              <p>
                <strong>
                  {selectedBillingAddress.name ||
                    `${selectedBillingAddress.firstName || ""} ${
                      selectedBillingAddress.lastName || ""
                    }`.trim() ||
                    "N/A"}
                </strong>
              </p>
              <p>
                {selectedBillingAddress.street || "N/A"}{" "}
                {selectedBillingAddress.street2 || ""}
              </p>
              <p>{`${selectedBillingAddress.city || "N/A"}, ${
                selectedBillingAddress.state || "N/A"
              } ${selectedBillingAddress.zip || "N/A"}`}</p>
              <p>{selectedBillingAddress.country || "N/A"}</p>
            </>
          )
        ) : (
          <em style={{ color: theme.colors.textMuted }}>
            No billing address selected.
          </em>
        );
        break;
      case "shippingMethod":
        summaryText = selectedShippingMethod ? (
          <p>
            <strong>{selectedShippingMethod.name || "N/A"}</strong> -{" "}
            {selectedShippingMethod?.cost === 0
              ? "FREE"
              : selectedShippingMethod?.cost != null
              ? `$${selectedShippingMethod.cost.toFixed(2)}`
              : "—"}
          </p>
        ) : (
          <em style={{ color: theme.colors.textMuted }}>
            No delivery method selected.
          </em>
        );
        break;
      case "paymentMethod":
        summaryText =
          selectedPaymentInfo && selectedPaymentInfo.last4 ? (
            <p>
              <strong>
                {selectedPaymentInfo.cardBrand ||
                  (selectedPaymentInfo.type === "saved"
                    ? "Saved Card"
                    : "New Card")}
              </strong>{" "}
              ending in {selectedPaymentInfo.last4}
            </p>
          ) : (
            <em style={{ color: theme.colors.textMuted }}>
              No payment method selected.
            </em>
          );
        break;
    }
    return (
      <CompletedSectionSummaryWrapper key={`${stepId}-summary`}>
        <h3>
          {React.cloneElement(stepConfigItem.icon as React.ReactElement, {
            size: "0.9em",
            style: { marginRight: theme.spacing(1.5) },
          })}{" "}
          {stepConfigItem.label}
        </h3>
        <SummaryDetails>{summaryText}</SummaryDetails>
        <EditButton onClick={() => handleGoToStep(stepId)}>Edit</EditButton>
      </CompletedSectionSummaryWrapper>
    );
  };

  console.log("SHIPPING OPTIONS DATA (CheckoutPage):", shippingOptionsData);

  return (
    <CheckoutPageWrapper>
      <CheckoutContentLimiter>
        <CheckoutHeader>
          <h1>Secure Checkout</h1>
          <BackButton
            onClick={() => navigate("/cart",{replace:true})}
            aria-label="Go back to your shopping cart"
          >
            <FaArrowLeft /> Back to Cart
          </BackButton>
        </CheckoutHeader>
        <CheckoutMainGrid>
          <CheckoutFlowColumn>
            <CheckoutStepper
              steps={CHECKOUT_STEPS_CONFIG}
              currentStepId={currentStepId}
              completedSteps={completedSteps}
              onStepClick={handleGoToStep}
            />
            {CHECKOUT_STEPS_CONFIG.map((stepConfig) =>
              renderCompletedStepSummary(stepConfig)
            )}
            <ActiveSectionWrapper>
              {renderActiveStepContent()}
            </ActiveSectionWrapper>
            {operationError && currentStepId !== "paymentMethod" && (
              <p
                style={{
                  color: theme.colors.error,
                  textAlign: "center",
                  marginTop: theme.spacing(2),
                }}
              >
                {operationError}
              </p>
            )}
            <GlobalContinueButtonWrapper>
              <PrimaryCtaButton
                onClick={handleNextStep}
                disabled={
                  !isCurrentStepValid() ||
                  isProcessingStep ||
                  isApplyingDiscount ||
                  !checkoutSessionId
                }
                isLoading={isProcessingStep}
              >
                {isProcessingStep ? "Processing..." : getPrimaryButtonText()}
              </PrimaryCtaButton>
            </GlobalContinueButtonWrapper>
          </CheckoutFlowColumn>
          <OrderSummaryColumn>
            <BriefOrderSummary
              summary={orderSummaryForBrief}
              onPrimaryAction={() => {
                if (!checkoutSessionId) {
                  alert("Session error.");
                  return;
                }
                const allStepsOnPageComplete = stepOrder.every((s) =>
                  completedSteps.includes(s)
                );
                if (allStepsOnPageComplete && isCurrentStepValid()) {
                  if (
                    currentStepId === "paymentMethod" &&
                    selectedPaymentInfo?.type === "new_card" &&
                    selectedPaymentInfo.requiresSetup
                  ) {
                    handleNextStep();
                  } else {
                    if (isSettingPaymentDetails) {
                      return;
                    }
                        navigate(`checkoutsummery/${checkoutSessionId}`,{replace:true});
                  }
                } else {
                  alert("Please complete all steps.");
                }
              }}
              primaryActionText="Proceed to Review"
              isPrimaryActionDisabled={
                !checkoutSessionId ||
                isProcessingStep ||
                isApplyingDiscount ||
                !(
                  stepOrder.every((s) => completedSteps.includes(s)) &&
                  isCurrentStepValid()
                )
              }
              isPrimaryActionLoading={
                isApplyingDiscountMutation ||
                (isProcessingStep && currentStepId === "paymentMethod")
              }
              onApplyDiscount={async (code) => {
                if (!checkoutSessionId) {
                  alert("No active session.");
                  return false;
                }
                setIsApplyingDiscount(true);
                setDiscountFeedback(null);
                try {
                  await applyDiscount({
                    sessionId: checkoutSessionId,
                    discountCode: code,
                  });

                  setIsApplyingDiscount(false);
                  return true;
                } catch (error) {
                  setIsApplyingDiscount(false);
                  return false;
                }
              }}
              discountFeedback={discountFeedback}
              onClearDiscountFeedback={() => setDiscountFeedback(null)}
              isApplyingDiscount={
                isApplyingDiscount || isApplyingDiscountMutation
              }
            />
          </OrderSummaryColumn>
        </CheckoutMainGrid>
      </CheckoutContentLimiter>
    </CheckoutPageWrapper>
  );
};

const CheckoutPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise} options={{}}>
      <InnerCheckoutContent />
    </Elements>
  );
};

export default CheckoutPage;
