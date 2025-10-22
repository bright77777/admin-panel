import { SingleColumnPage } from "@components/layout/pages";

import { CampaignListTable } from "@routes/campaigns/campaign-list/components";

import { useExtension } from "@providers/extension-provider";

export const CampaignList = () => {
  const { getWidgets } = useExtension();

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("campaign.list.after"),
        before: getWidgets("campaign.list.before"),
      }}
      hasOutlet
    >
      <CampaignListTable />
    </SingleColumnPage>
  );
};
