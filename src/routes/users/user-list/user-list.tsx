import { SingleColumnPage } from "@components/layout/pages";

import { UserListTable } from "@routes/users/user-list/components/user-list-table";

import { useExtension } from "@providers/extension-provider";

export const UserList = () => {
  const { getWidgets } = useExtension();

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("user.list.after"),
        before: getWidgets("user.list.before"),
      }}
    >
      <UserListTable />
    </SingleColumnPage>
  );
};
