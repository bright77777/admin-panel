import { SingleColumnPage } from "@components/layout/pages";

import { RefundReasonListTable } from "@routes/refund-reasons/refund-reason-list/components/refund-reason-list-table";

import { useExtension } from "@providers/extension-provider";

export const RefundReasonList = () => {
  const { getWidgets } = useExtension();

  return (
    <SingleColumnPage
      showMetadata={false}
      showJSON={false}
      hasOutlet
      widgets={{
        after: getWidgets("refund_reason.list.after"),
        before: getWidgets("refund_reason.list.before"),
      }}
    >
      <RefundReasonListTable />
    </SingleColumnPage>
  );
};
