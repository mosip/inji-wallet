import React from 'react';
import { Icon, ListItem } from 'react-native-elements';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../../components/ui/Modal';
import { Centered, Column, Text } from '../../../components/ui';
import { ActivityLogText } from '../../../components/ActivityLogText';
import { ActorRefFrom } from 'xstate';
import { vcItemMachine } from '../../../machines/vcItem';
import { useKebabPopUp } from '../../../components/KebabPopUpController';
import { Theme } from '../../../components/ui/styleUtils';
import { VCMetadata } from '../../../shared/VCMetadata';

export const HistoryTab: React.FC<HistoryTabProps> = (props) => {
  const { t } = useTranslation('HistoryTab');
  const controller = useKebabPopUp(props);

  return (
    <ListItem bottomDivider onPress={controller.SHOW_ACTIVITY}>
      <ListItem.Content>
        <ListItem.Title>
          <Text
            size="small"
            weight="bold"
            color={Theme.Colors.walletbindingLabel}>
            {props.label}
          </Text>
        </ListItem.Title>
      </ListItem.Content>
      <Modal
        // TODO: is Uin needed here?
        headerLabel={props.vcMetadata.hashedId}
        isVisible={controller.isShowActivities}
        onDismiss={controller.DISMISS}>
        <Column fill>
          {controller.activities
            .filter((activity) =>
              VCMetadata.fromVCKey(activity._vcKey).equals(props.vcMetadata)
            )
            .map((activity) => (
              <ActivityLogText
                key={`${activity.timestamp}-${activity._vcKey}`}
                activity={activity}
              />
            ))}
          {controller.activities.length === 0 && (
            <Centered fill>
              <Icon
                style={{ marginBottom: 20 }}
                size={40}
                name="sentiment-dissatisfied"
              />
              <Text align="center" weight="semibold" margin="0 0 4 0">
                {t('noHistory')}
              </Text>
            </Centered>
          )}
        </Column>
      </Modal>
    </ListItem>
  );
};

export interface HistoryTabProps {
  label: string;
  vcMetadata: VCMetadata;
  service: ActorRefFrom<typeof vcItemMachine>;
}
