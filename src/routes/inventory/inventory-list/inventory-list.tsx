import { SingleColumnPage } from "@components/layout/pages";

import { InventoryListTable } from "@routes/inventory/inventory-list/components/inventory-list-table";

import { useExtension } from "@providers/extension-provider";

export const InventoryItemListTable = () => {
  const { getWidgets } = useExtension();

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("inventory_item.list.after"),
        before: getWidgets("inventory_item.list.before"),
      }}
    >
      <InventoryListTable />
    </SingleColumnPage>
  );
};
