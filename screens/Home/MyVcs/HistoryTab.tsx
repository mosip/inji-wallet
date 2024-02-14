import React from 'react';
import {Icon, ListItem} from 'react-native-elements';
import {useTranslation} from 'react-i18next';
import {Modal} from '../../../components/ui/Modal';
import {Centered, Column, Text} from '../../../components/ui';
import {ActivityLogText} from '../../../components/ActivityLogText';
import {ActorRefFrom} from 'xstate';
import {ExistingMosipVCItemMachine} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {useKebabPopUp} from '../../../components/KebabPopUpController';
import {VCMetadata} from '../../../shared/VCMetadata';
import {SvgImage} from '../../../components/ui/svg';
import {KebabPopupListItemContainer} from '../../../components/KebabPopUp';

export const HistoryTab: React.FC<HistoryTabProps> = props => {
  const {t} = useTranslation('HistoryTab');
  const controller = useKebabPopUp(props);

  return (
    <>
      <KebabPopupListItemContainer
        label={props.label}
        listItemIcon={SvgImage.OutlinedScheduleIcon()}
        onPress={controller.SHOW_ACTIVITY}
        testID={props.testID}
      />
      <Modal
        headerLabel={props.vcMetadata.id}
        isVisible={controller.isShowActivities}
        onDismiss={controller.DISMISS}>
        <Column fill>
          {controller.activities
            .filter(activity => activity._vcKey === props.vcMetadata.getVcKey())
            .map(activity => (
              <ActivityLogText
                key={`${activity.timestamp}-${activity._vcKey}`}
                activity={activity}
              />
            ))}
          {controller.activities.length === 0 && (
            <Centered fill>
              <Icon
                testID="sentiment-dissatisfied"
                style={{marginBottom: 20}}
                size={40}
                name="sentiment-dissatisfied"
              />
              <Text
                testID="noHistory"
                style={{paddingTop: 3}}
                align="center"
                weight="semibold"
                margin="0 0 4 0">
                {t('noHistory')}
              </Text>
            </Centered>
          )}
        </Column>
      </Modal>
    </>
  );
};

export interface HistoryTabProps {
  testID: string;
  label: string;
  vcMetadata: VCMetadata;
  service: ActorRefFrom<typeof ExistingMosipVCItemMachine>;
}
