import type React from "react";
import { useMemo } from "react";

import type { HttpTypes } from "@medusajs/types";
import { createDataTableColumnHelper } from "@medusajs/ui";

import { useTranslation } from "react-i18next";

import { getCellRenderer, getColumnValue } from "@lib/table/cell-renderers.tsx";

export interface ColumnAdapter<TData> {
  getColumnAlignment?: (
    column: HttpTypes.AdminColumn,
  ) => "left" | "center" | "right";
  // @todo fix any type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCustomAccessor?: (field: string, column: HttpTypes.AdminColumn) => any;
  transformCellValue?: (
    // @todo fix any type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    row: TData,
    column: HttpTypes.AdminColumn,
  ) => React.ReactNode;
}
// @todo fix any type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useConfigurableTableColumns<TData = any>(
  entity: string,
  apiColumns: HttpTypes.AdminColumn[] | undefined,
  adapter?: ColumnAdapter<TData>,
) {
  const columnHelper = createDataTableColumnHelper<TData>();
  const { t } = useTranslation();

  return useMemo(() => {
    if (!apiColumns?.length) {
      return [];
    }

    return apiColumns.map((apiColumn) => {
      let renderType = apiColumn.computed?.type;

      if (!renderType) {
        if (apiColumn.semantic_type === "timestamp") {
          renderType = "timestamp";
        } else if (apiColumn.field === "display_id") {
          renderType = "display_id";
        } else if (apiColumn.field === "total") {
          renderType = "total";
        } else if (apiColumn.semantic_type === "currency") {
          renderType = "currency";
        }
      }

      const renderer = getCellRenderer(renderType, apiColumn.data_type);

      const headerAlign = adapter?.getColumnAlignment
        ? adapter.getColumnAlignment(apiColumn)
        : getDefaultColumnAlignment(apiColumn);

      const accessor = (row: TData) => getColumnValue(row, apiColumn);

      return columnHelper.accessor(accessor, {
        id: apiColumn.field,
        header: () => apiColumn.name,
        // @todo fix any type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell: ({ getValue, row }: { getValue: any; row: any }) => {
          const value = getValue();

          if (adapter?.transformCellValue) {
            const transformed = adapter.transformCellValue(
              value,
              row.original,
              apiColumn,
            );
            if (transformed !== null) {
              return transformed;
            }
          }

          return renderer(value, row.original, apiColumn, t);
        },
        meta: {
          name: apiColumn.name,
          column: apiColumn, // Store column metadata for future use
        },
        enableHiding: apiColumn.hideable,
        enableSorting: false, // Disable sorting for all columns by default
        headerAlign, // Pass the header alignment to the DataTable
        // @todo fix any type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    });
  }, [entity, apiColumns, adapter, t]);
}

function getDefaultColumnAlignment(
  column: HttpTypes.AdminColumn,
): "left" | "center" | "right" {
  if (column.semantic_type === "currency" || column.data_type === "currency") {
    return "right";
  }

  if (column.data_type === "number" && column.context !== "identifier") {
    return "right";
  }

  if (
    column.field.includes("total") ||
    column.field.includes("amount") ||
    column.field.includes("price") ||
    column.field.includes("quantity") ||
    column.field.includes("count")
  ) {
    return "right";
  }

  if (column.semantic_type === "status") {
    return "center";
  }

  if (
    column.computed?.type === "country_code" ||
    column.field === "country" ||
    column.field.includes("country_code")
  ) {
    return "center";
  }

  return "left";
}
