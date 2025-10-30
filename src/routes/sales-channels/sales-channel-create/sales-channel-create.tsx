import { RouteFocusModal } from "@components/modals";

import { CreateSalesChannelForm } from "@routes/sales-channels/sales-channel-create/components/create-sales-channel-form";

export const SalesChannelCreate = () => (
  <RouteFocusModal>
    <CreateSalesChannelForm />
  </RouteFocusModal>
);
