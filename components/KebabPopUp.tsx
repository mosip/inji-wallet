import {Icon, ListItem, Overlay} from 'react-native-elements';
import {Theme} from '../components/ui/styleUtils';
import {Column, Row, Text} from '../components/ui';
import {WalletBinding} from '../screens/Home/MyVcs/WalletBinding';
import {Pressable, View} from 'react-native';
import {useKebabPopUp} from './KebabPopUpController';
import {ActorRefFrom} from 'xstate';
import {ExistingMosipVCItemMachine} from '../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {useTranslation} from 'react-i18next';
import {HistoryTab} from '../screens/Home/MyVcs/HistoryTab';
import {RemoveVcWarningOverlay} from '../screens/Home/MyVcs/RemoveVcWarningOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import {VCMetadata} from '../shared/VCMetadata';
import testIDProps from '../shared/commonUtil';

export const KebabPopUp: React.FC<KebabPopUpProps> = props => {
  const controller = useKebabPopUp(props);
  const {t} = useTranslation('HomeScreenKebabPopUp');
  return (
    <Column>
      <Icon
        {...testIDProps('ellipsis')}
        accessible={true}
        name={props.iconName}
        type={props.iconType}
        color={Theme.Colors.GrayIcon}
        size={Theme.ICON_SMALL_SIZE}
      />
      <Overlay
        isVisible={props.isVisible}
        onBackdropPress={props.onDismiss}
        overlayStyle={Theme.KebabPopUpStyles.kebabPopUp}>
        <Row style={Theme.KebabPopUpStyles.kebabHeaderStyle}>
          <View></View>
          <Text testID="kebabTitle" weight="bold">
            {t('title')}
          </Text>
          <Icon
            {...testIDProps('close')}
            name="close"
            onPress={props.onDismiss}
            color={Theme.Colors.Details}
            size={25}
          />
        </Row>
        <ScrollView>
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title
                onPress={controller.PIN_CARD}
                {...testIDProps('pinOrUnPinCard')}>
                <Text size="small" weight="bold">
                  {props.vcMetadata.isPinned ? t('unPinCard') : t('pinCard')}
                </Text>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <WalletBinding
            label={t('offlineAuthenticationDisabled!')}
            content={t('offlineAuthDisabledMessage')}
            service={props.service}
            vcMetadata={props.vcMetadata}
          />

          <HistoryTab
            testID="viewActivityLog"
            service={props.service}
            label={t('viewActivityLog')}
            vcMetadata={props.vcMetadata}
          />

          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title
                onPress={() => controller.REMOVE(props.vcMetadata)}
                {...testIDProps('removeFromWallet')}>
                <Text size="small" weight="bold">
                  {t('removeFromWallet')}
                </Text>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>

          <RemoveVcWarningOverlay
            isVisible={controller.isRemoveWalletWarning}
            onConfirm={controller.CONFIRM}
            onCancel={controller.CANCEL}
          />
        </ScrollView>
      </Overlay>
    </Column>
  );
};

export interface KebabPopUpProps {
  iconName: string;
  iconType?: string;
  vcMetadata: VCMetadata;
  isVisible: boolean;
  onDismiss: () => void;
  service: ActorRefFrom<typeof ExistingMosipVCItemMachine>;
}
