import { SingleColumnPage } from "@components/layout/pages";

import { PromotionListTable } from "@routes/promotions/promotion-list/components/promotion-list-table";

import { useExtension } from "@providers/extension-provider";

export const PromotionsList = () => {
  const { getWidgets } = useExtension();

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("promotion.list.before"),
        after: getWidgets("promotion.list.after"),
      }}
    >
      <PromotionListTable />
    </SingleColumnPage>
  );
};
