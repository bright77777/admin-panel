import { useMemo, useState } from "react";

import { EllipsisHorizontal } from "@medusajs/icons";
import type { DataTablePaginationState } from "@medusajs/ui";
import {
  Button,
  Container,
  DataTable,
  DropdownMenu,
  Heading,
  createDataTableColumnHelper,
} from "@medusajs/ui";
import { useDataTable } from "@medusajs/ui";
import { toast } from "@medusajs/ui";

import { format } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";

import { useReorderAttributePossibleValues } from "@hooks/api/attributes.tsx";

import { CreateRankingModal } from "@routes/attributes/attribute-create/components/create-ranking-modal.tsx";
import type { RankingItem } from "@routes/attributes/attribute-edit-possible-value/components/edit-ranking-drawer";
import { EditRankingDrawer } from "@routes/attributes/attribute-edit-possible-value/components/edit-ranking-drawer";
import { SortingPossibleValues } from "@routes/attributes/attribute-edit-possible-value/components/sorting-possible-value";

import type { AttributeDTO } from "@/types";

type PossibleValue = {
  id: string;
  value: string;
  rank: number;
  created_at: string;
};

type PossibleValuesTableProps = {
  attribute: AttributeDTO;
  isLoading: boolean;
};

export const PossibleValuesTable = ({
  attribute,
}: PossibleValuesTableProps) => {
  const [possibleValuesPage, setPossibleValuesPage] = useState(1);
  const possibleValuesPageSize = 10;
  const [possibleValuesPagination, setPossibleValuesPagination] =
    useState<DataTablePaginationState>({
      pageIndex: possibleValuesPage - 1,
      pageSize: possibleValuesPageSize,
    });
  const [possibleValuesSearch, setPossibleValuesSearch] = useState("");

  const [sorting, setSorting] = useState<{
    field: "value" | "rank" | "created_at";
    order: "asc" | "desc";
  }>({
    field: "rank",
    order: "desc",
  });

  const navigate = useNavigate();
  const { id: attributeId } = useParams();

  const possibleValuesColumnHelper =
    createDataTableColumnHelper<PossibleValue>();

  const possibleValuesColumns = [
    possibleValuesColumnHelper.accessor("value", {
      header: "Value",
      cell: (info) => info.getValue(),
    }),
    possibleValuesColumnHelper.accessor("rank", {
      header: "Rank",
      cell: (info) => info.getValue(),
    }),
    possibleValuesColumnHelper.accessor("created_at", {
      header: "Created At",
      cell: (info) => format(new Date(info.getValue()), "MMM dd, yyyy p"),
    }),
    possibleValuesColumnHelper.display({
      id: "actions",
      cell: (info) => {
        const possibleValue = info.row.original;

        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="transparent" size="small">
                  <EllipsisHorizontal />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item
                  onClick={() => {
                    if (attributeId) {
                      navigate(
                        `edit-possible-value?possible_value_id=${possibleValue.id}`,
                      );
                    } else {
                      toast.error("Attribute ID not found.");
                    }
                  }}
                >
                  Edit
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];

  const filteredValues = (attribute?.possible_values ?? []).filter((value) =>
    value.value.toLowerCase().includes(possibleValuesSearch.toLowerCase()),
  );

  const sortedValues = [...filteredValues].sort((a, b) => {
    const field = sorting.field;
    const order = sorting.order === "asc" ? 1 : -1;

    let aVal = a[field];
    let bVal = b[field];

    if (field === "created_at") {
      aVal = new Date(a.created_at).getTime();
      bVal = new Date(b.created_at).getTime();
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * order;
    }

    return ((aVal as number) - (bVal as number)) * order;
  });

  const paginatedValues = sortedValues.slice(
    possibleValuesPagination.pageIndex * possibleValuesPagination.pageSize,
    (possibleValuesPagination.pageIndex + 1) *
      possibleValuesPagination.pageSize,
  );

  const rankingItems = useMemo<RankingItem[]>(() => {
    const all = [...(attribute?.possible_values ?? [])];
    all.sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));

    return all.map((pv) => ({ id: pv.id, value: pv.value, rank: pv.rank }));
  }, [attribute?.possible_values]);

  const { mutateAsync: reorderAsync } = useReorderAttributePossibleValues(
    attributeId || "",
  );

  const handleRankingSave = async (orderedItems: RankingItem[]) => {
    if (!attributeId) return;

    // Map current ranks from backend for comparison
    const currentById = new Map<string, number>(
      (attribute?.possible_values ?? []).map((pv) => [
        String(pv.id),
        pv.rank ?? 0,
      ]),
    );

    // Compute new contiguous ranks for the entire list based on the drawer order
    const updates = orderedItems
      .map((item, index) => ({ id: String(item.id), rank: index }))
      .filter((u) => currentById.get(u.id) !== u.rank);

    if (updates.length === 0) {
      toast.info("No changes to save");

      return;
    }

    await reorderAsync(updates, {
      onSuccess: () => {
        toast.success("Ranking updated!");
      },
      onError: (error) => {
        toast.error("Failed to update ranking");
        console.error(error);
      },
    });
  };

  const possibleValuesTable = useDataTable({
    columns: possibleValuesColumns,
    data: paginatedValues,
    getRowId: (value) => value.id,
    rowCount: filteredValues.length,
    pagination: {
      state: possibleValuesPagination,
      onPaginationChange: (newPagination) => {
        setPossibleValuesPagination(newPagination);
        setPossibleValuesPage(newPagination.pageIndex + 1);
      },
    },
    search: {
      state: possibleValuesSearch,
      onSearchChange: setPossibleValuesSearch,
    },
  });

  if (!attribute.possible_values || attribute.possible_values.length === 0) {
    return null;
  }

  return (
    <Container className="divide-y p-0">
      <DataTable instance={possibleValuesTable}>
        <div className="flex items-center justify-between pl-6">
          <Heading level="h2">Possible Values</Heading>
          <div>
            <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
              <DataTable.Search placeholder="Search" />
              <div className="flex items-center gap-2">
                <SortingPossibleValues
                  sorting={sorting}
                  setSorting={setSorting}
                />
                <EditRankingDrawer
                  items={rankingItems}
                  onSave={handleRankingSave}
                  title="Edit ranking"
                />
                <CreateRankingModal
                  title="Create"
                  items={rankingItems}
                  onSave={handleRankingSave}
                />
              </div>
            </DataTable.Toolbar>
          </div>
        </div>
        <div>
          <DataTable.Table />
          <DataTable.Pagination />
        </div>
      </DataTable>
    </Container>
  );
};
