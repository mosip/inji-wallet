import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

import * as DateFnsLocale from 'date-fns/locale';
import { ActivityLog } from '../machines/activityLog';
import { TextItem } from './ui/TextItem';

export const ActivityLogText: React.FC<{ activity: ActivityLog }> = (props) => {
  const { t, i18n } = useTranslation('ActivityLogText');
  const { activity } = props;

  return (
    <TextItem
      label={getActionLabel(activity, i18n.language)}
      text={`${activity.vcLabel} ${t(activity.type)}`}
    />
  );
};

function getActionLabel(activity: ActivityLog, language: string) {
  return [
    activity.deviceName,
    formatDistanceToNow(activity.timestamp, {
      addSuffix: true,
      locale: DateFnsLocale[language],
    }),
  ]
    .filter((label) => label?.trim() !== '')
    .join(' · ');
}
