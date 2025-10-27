import { SingleColumnPage } from "@components/layout/pages";

import { RegionListTable } from "@routes/regions/region-list/components/region-list-table";

import { useExtension } from "@providers/extension-provider";

export const RegionList = () => {
  const { getWidgets } = useExtension();

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("region.list.before"),
        after: getWidgets("region.list.after"),
      }}
    >
      <RegionListTable />
    </SingleColumnPage>
  );
};
