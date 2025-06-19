import TaxRateForm from "@/components/admin/checkoutsession/Tax/TaxDetail/TaxRateForm"
import TaxRateList from "@/components/admin/checkoutsession/Tax/TaxRateList"
import ShippingMethodSection from "@/components/checkout/ShippingMethodSection/ShippingMethodSection"

[
  {
    path: "/admin/checkoutsession",
    label: "Checkout Session",
    sectionId: "platformCheckoutMain",
    icon: FaClipboardList,
    children: [
      {
        path: "/admin/checkoutsession/discount",
        label: "Discount",
        sectionId: "platformDiscountOverview",
      }
    ],
  },
]

      {
        path: "/admin/checkoutsession/tax",
        label: "Tax",
        sectionId: "platformTaxOverview",
      }



      {
        path: "tax",
        element: <DiscountList />,
        handle: { title: "Discount", sectionId: "DiscountList" },
      },
      {
        path: "edit/:discountId",
        element: <DiscountForm />,
        handle: { title: "Discount", sectionId: "DiscountUpdateForm" },
      },
      {
        path: "new",
        element: <DiscountForm />,
        handle: { title: "Discount", sectionId: "DiscountNewForm" },
      },


      


