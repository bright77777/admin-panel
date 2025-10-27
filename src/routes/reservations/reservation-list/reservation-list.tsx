import { SingleColumnPage } from "@components/layout/pages";

import { ReservationListTable } from "@routes/reservations/reservation-list/components/reservation-list-table";

import { useExtension } from "@providers/extension-provider";

export const ReservationList = () => {
  const { getWidgets } = useExtension();

  return (
    <SingleColumnPage
      widgets={{
        before: getWidgets("reservation.list.before"),
        after: getWidgets("reservation.list.after"),
      }}
    >
      <ReservationListTable />
    </SingleColumnPage>
  );
};
