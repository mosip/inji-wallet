import React from 'react';
import {useTranslation} from 'react-i18next';

import {TextItem} from './ui/TextItem';
import {VCActivityLog} from './ActivityLogEvent';
import {useHistoryTab} from '../screens/History/HistoryScreenController';
import {VPShareActivityLog} from './VPShareActivityLogEvent';

export const ActivityLogText: React.FC<{
  activity: VCActivityLog | VPShareActivityLog;
}> = props => {
  const {t, i18n} = useTranslation('ActivityLogText');
  const historyController = useHistoryTab();
  let {activity} = props;
  activity =
    activity.constructor.name === 'VPShareActivityLog'
      ? VPShareActivityLog.getLogFromObject(activity)
      : VCActivityLog.getLogFromObject(activity);
  const wellknown =
    activity.constructor.name === 'VCActivityLog'
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
