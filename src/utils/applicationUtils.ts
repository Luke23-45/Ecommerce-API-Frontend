import type { ISellerStatus as IndividualSellerProfileStatus } from "@/types/seller";

export const VALID_STATUS_TRANSITIONS: Record<
  IndividualSellerProfileStatus,
  IndividualSellerProfileStatus[]
> = {
  submitted: ["processing", "approved", "rejected", "withdrawn"],

  processing: ["approved", "rejected", "withdrawn"],

  approved: [
    "active",
    "inactive",
    "suspended",
    "closed",
    "rejected",
    "withdrawn",
  ],

  active: ["inactive", "suspended", "closed", "rejected", "withdrawn"],

  inactive: ["active", "suspended", "closed", "rejected", "withdrawn"],

  suspended: ["active", "closed", "rejected", "withdrawn"],

  closed: [],
  rejected: [],
  withdrawn: [],
};

export const getValidNextStatuses = (
  currentStatus: IndividualSellerProfileStatus
): IndividualSellerProfileStatus[] => {
  return VALID_STATUS_TRANSITIONS[currentStatus] || [];
};

export const isRejectionReasonRequired = (
  newStatus: IndividualSellerProfileStatus
): boolean => {
  return newStatus === "rejected";
};

export const isFrontendStatusTransitionValid = (
  currentStatus: IndividualSellerProfileStatus,
  newStatus: IndividualSellerProfileStatus
): boolean => {
  if (currentStatus === newStatus) return false;

  if (
    (newStatus === "rejected" || newStatus === "withdrawn") &&
    !(currentStatus === "rejected" || currentStatus === "withdrawn")
  ) {
    return true;
  }

  switch (currentStatus) {
    case "submitted":
      return ["processing", "approved", "rejected", "withdrawn"].includes(
        newStatus
      );
    case "processing":
      return ["approved", "rejected", "withdrawn"].includes(newStatus);
    case "approved":
      return ["active", "inactive", "suspended", "closed"].includes(newStatus);
    case "active":
      return ["inactive", "suspended", "closed"].includes(newStatus);
    case "inactive":
      return ["active", "suspended", "closed"].includes(newStatus);
    case "suspended":
      return ["active", "closed"].includes(newStatus);
    case "closed":
    case "rejected":
    case "withdrawn":
      return false;
    default:
      const knownStatuses: IndividualSellerProfileStatus[] = [
        "submitted",
        "processing",
        "approved",
        "active",
        "inactive",
        "suspended",
        "closed",
        "rejected",
        "withdrawn",
      ];
      if (!knownStatuses.includes(currentStatus)) {
        console.warn(
          `isFrontendStatusTransitionValid: Encountered unknown currentStatus "${currentStatus}"`
        );
      }
      return false;
  }
};
