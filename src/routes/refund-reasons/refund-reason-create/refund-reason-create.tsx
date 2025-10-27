import { RouteFocusModal } from "@components/modals";

import { RefundReasonCreateForm } from "@routes/refund-reasons/refund-reason-create/components/refund-reason-create-form";

export const RefundReasonCreate = () => (
  <RouteFocusModal>
    <RefundReasonCreateForm />
  </RouteFocusModal>
);
