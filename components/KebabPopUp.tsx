import React, {ReactNode} from 'react';
import {Icon, ListItem, Overlay} from 'react-native-elements';
import {Theme} from '../components/ui/styleUtils';
import {Column, Row, Text} from '../components/ui';
import {ActivationStatus} from '../screens/Home/MyVcs/WalletBinding';
import {View} from 'react-native';
import {useKebabPopUp} from './KebabPopUpController';
import {ActorRefFrom} from 'xstate';
import {ExistingMosipVCItemMachine} from '../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {useTranslation} from 'react-i18next';
import {HistoryTab} from '../screens/Home/MyVcs/HistoryTab';
import {RemoveVcWarningOverlay} from '../screens/Home/MyVcs/RemoveVcWarningOverlay';
import {ScrollView} from 'react-native-gesture-handler';
import {VCMetadata} from '../shared/VCMetadata';
import testIDProps from '../shared/commonUtil';
import {ShareVc} from '../screens/Home/Kebab/ShareVc';
import {SvgImage} from './ui/svg';
import {VCShareFlowType} from '../shared/Utils';

export const KebabPopUp: React.FC<KebabPopUpProps> = props => {
  const controller = useKebabPopUp(props);
  const {t} = useTranslation('HomeScreenKebabPopUp');
  return (
    <Column>
      {props.icon ? (
        props.icon
      ) : (
        <Icon
          {...testIDProps('ellipsis')}
          accessible={true}
          name={props.iconName}
          type={props.iconType}
          {...(props.iconColor ? props.iconColor : Theme.Colors.helpText)}
          size={Theme.ICON_SMALL_SIZE}
        />
      )}
      <Overlay
        isVisible={props.isVisible && !controller.isScanning}
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
          <KebabPopupListItemContainer
            label={props.vcMetadata.isPinned ? t('unPinCard') : t('pinCard')}
            listItemIcon={SvgImage.OutlinedPinIcon()}
            onPress={controller.PIN_CARD}
            testID="pinOrUnPinCard"
          />
          <ShareVc
            testID="shareVcFromKebab"
            label={t('share')}
            service={props.service}
            flowType={VCShareFlowType.MINI_VIEW_SHARE}
          />
          {props.vcHasImage ? (
            <>
              <ShareVc
                testID="shareVcWithSelfieFromKebab"
                label={t('shareWithSelfie')}
                service={props.service}
                flowType={VCShareFlowType.MINI_VIEW_SHARE_WITH_SELFIE}
              />
              <ActivationStatus
                vcMetadata={props?.vcMetadata}
                service={props.service}
                emptyWalletBindingId={controller.emptyWalletBindingId}
                ADD_WALLET_BINDING_ID={controller.ADD_WALLET_BINDING_ID}
              />
            </>
          ) : (
            <React.Fragment />
          )}
          <HistoryTab
            testID="viewActivityLog"
            service={props.service}
            label={t('viewActivityLog')}
            vcMetadata={props.vcMetadata}
          />
          <KebabPopupListItemContainer
            label={t('removeFromWallet')}
            listItemIcon={SvgImage.outlinedDeleteIcon()}
            onPress={() => controller.REMOVE(props.vcMetadata)}
            testID="removeFromWallet"
          />
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

export const KebabPopupListItemContainer: React.FC<
  KebabListItemContainerProps
> = props => {
  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title onPress={props.onPress} {...testIDProps(props.testID)}>
          <Row crossAlign="center" style={{flex: 1}}>
            {props.listItemIcon}
            <Text
              style={{fontFamily: 'Inter_600SemiBold'}}
              color={
                props.testID === 'removeFromWallet'
                  ? Theme.Colors.warningText
                  : undefined
              }
              margin="0 0 0 10">
              {props.label}
            </Text>
          </Row>
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};

export interface KebabListItemContainerProps {
  label: string;
  listItemIcon: ReactNode;
  onPress: () => void;
  testID: string;
}
export interface KebabPopUpProps {
  iconName: string;
  iconType?: string;
  vcMetadata: VCMetadata;
  isVisible?: boolean;
  onDismiss: () => void;
  service: ActorRefFrom<typeof ExistingMosipVCItemMachine>;
  iconColor?: any;
  icon?: any;
  vcHasImage: boolean;
}
