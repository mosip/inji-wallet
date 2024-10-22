import React from 'react';
import {useTranslation} from 'react-i18next';

import {TextItem} from './ui/TextItem';
import {VCActivityLog} from './ActivityLogEvent';
import {useHistoryTab} from '../screens/History/HistoryScreenController';
import {VPShareActivityLog} from './VPShareActivityLogEvent';
import {VCItemContainerFlowType} from '../shared/Utils';

export const ActivityLogText: React.FC<{
  activity: VCActivityLog | VPShareActivityLog;
}> = props => {
  let {activity} = props;
  const {t, i18n} = useTranslation('ActivityLogText');
  const historyController = useHistoryTab();
  activity =
    activity.flow === VCItemContainerFlowType.VP_SHARE
      ? VPShareActivityLog.getLogFromObject(activity)
      : VCActivityLog.getLogFromObject(activity);
  const wellknown =
    activity.flow === VCItemContainerFlowType.VC_SHARE
      ? historyController.getWellKnownIssuerMap(activity.issuer)
      : undefined;

  return (
    <TextItem
      label={activity.getActionLabel(i18n.language)}
      text={activity.getActionText(t, wellknown)}
      divider
    />
  );
};
