import { useEffect, useState } from "react";

import { Button, Drawer, Text, toast } from "@medusajs/ui";

import { SortableTree } from "@components/common/sortable-tree";

export type RankingItem = {
  id: string | number;
  value: string;
  [key: string]: number | string | undefined;
};

type EditRankingDrawerProps = {
  items: RankingItem[];
  onSave?: (orderedItems: RankingItem[]) => Promise<void> | void;
  title?: string;
};

export const EditRankingDrawer = ({
  items,
  onSave,
  title = "Edit ranking",
}: EditRankingDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localItems, setLocalItems] = useState<RankingItem[]>(items ?? []);

  // When opening the drawer or items change from parent, reset local state to reflect latest data
  useEffect(() => {
    if (open) {
      setLocalItems(items ?? []);
    }
  }, [open, items]);

  const handleChange = (
    _updatedItem: {
      id: string | number;
      parentId: string | number | null;
      index: number;
    },
    updatedItems: RankingItem[],
  ) => {
    // Only update local state; do not persist yet
    setLocalItems(updatedItems);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (onSave) {
        await onSave(localItems);
      } else {
        // If no onSave handler is provided by the parent, still inform the user
        toast.success("Ranking was successfully updated.");
      }
      setOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Drawer.Trigger>
        <Button size="small" variant="secondary" onClick={() => setOpen(true)}>
          Edit ranking
        </Button>
      </Drawer.Trigger>

      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>{title}</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-0">
          {localItems && localItems.length ? (
            <SortableTree
              items={localItems}
              childrenProp="children"
              enableDrag={true}
              onChange={handleChange}
              renderValue={(item: RankingItem) => (
                <div className="flex items-center gap-x-2">
                  <span className="text-ui-fg-subtle">
                    {String(item.value)}
                  </span>
                </div>
              )}
            />
          ) : (
            <Text className="text-ui-fg-subtle">No items to reorder.</Text>
          )}
        </Drawer.Body>
        <Drawer.Footer>
          <Button
            size="small"
            variant="secondary"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={handleSave}
            disabled={saving}
            isLoading={saving}
          >
            Save
          </Button>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};
