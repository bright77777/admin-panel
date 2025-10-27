import type { FC } from "react";

import { DescendingSorting } from "@medusajs/icons";
import { DropdownMenu, IconButton } from "@medusajs/ui";

interface SortingProps {
  sorting: { field: "value" | "rank" | "created_at"; order: "asc" | "desc" };
  setSorting: (sorting: {
    field: "value" | "rank" | "created_at";
    order: "asc" | "desc";
  }) => void;
}

export const SortingPossibleValues: FC<SortingProps> = ({
  sorting,
  setSorting,
}) => {
  const handleSortFieldChange = (field: "value" | "rank" | "created_at") =>
    setSorting({ ...sorting, field });
  const handleSortOrderChange = (order: "asc" | "desc") =>
    setSorting({ ...sorting, order });

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton size="small">
          <DescendingSorting />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <div className="px-2 py-1">
          <DropdownMenu.Item onClick={() => handleSortFieldChange("value")}>
            {sorting.field === "value" ? (
              <span className="mr-2">•</span>
            ) : (
              <span className="ml-4" />
            )}
            Value
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => handleSortFieldChange("rank")}>
            {sorting.field === "rank" ? (
              <span className="mr-2">•</span>
            ) : (
              <span className="ml-4" />
            )}
            Rank
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => handleSortFieldChange("created_at")}
          >
            {sorting.field === "created_at" ? (
              <span className="mr-2">•</span>
            ) : (
              <span className="ml-4" />
            )}
            Created At
          </DropdownMenu.Item>
        </div>
        <DropdownMenu.Separator />
        <div className="px-2 py-1">
          <DropdownMenu.Item onClick={() => handleSortOrderChange("asc")}>
            {sorting.order === "asc" ? (
              <span className="mr-2">•</span>
            ) : (
              <span className="ml-4" />
            )}
            Ascending
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => handleSortOrderChange("desc")}>
            {sorting.order === "desc" ? (
              <span className="mr-2">•</span>
            ) : (
              <span className="ml-4" />
            )}
            Descending
          </DropdownMenu.Item>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
