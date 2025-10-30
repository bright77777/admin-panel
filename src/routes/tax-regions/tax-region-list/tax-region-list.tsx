import { SingleColumnPage } from "@components/layout/pages";

import { TaxRegionListView } from "@routes/tax-regions/tax-region-list/components/tax-region-list-view";

import { useExtension } from "@providers/extension-provider";

export const TaxRegionsList = () => {
  const { getWidgets } = useExtension();

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("tax.list.before"),
        after: getWidgets("tax.list.after"),
      }}
      hasOutlet
    >
      <TaxRegionListView />
    </SingleColumnPage>
  );
};
