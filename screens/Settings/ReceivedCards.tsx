import React from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl } from 'react-native';
import { Pressable } from 'react-native';
import { Centered, Column, Text } from '../../components/ui';
import { Icon } from 'react-native-elements';
import { Theme } from '../../components/ui/styleUtils';
import { Image } from 'react-native';
import { Modal } from '../../components/ui/Modal';
import { useReceivedVcsTab } from '../Home/ReceivedVcsTabController';
import { VcItem } from '../../components/VcItem';
import { ViewVcModal } from '../Home/ViewVcModal';
import testIDProps from '../../shared/commonUtil';

export const ReceivedCards: React.FC = () => {
  const { t } = useTranslation('ReceivedVcsTab');
  const controller = useReceivedVcsTab();

  return (
    <React.Fragment>
      <Pressable
        {...testIDProps('receivedCards')}
        onPress={controller.TOGGLE_RECEIVED_CARDS}>
        <Column style={Theme.Styles.receiveCardsContainer}>
          <Image
            source={Theme.ReceivedCardsIcon}
            style={{ marginLeft: 10, marginRight: 9 }}
          />
          <Text margin="6" weight="semibold">
            {t('receivedCards')}
          </Text>
        </Column>
      </Pressable>

      <Modal
        isVisible={controller.isVisible}
        arrowLeft={<Icon name={''} />}
        headerTitle={t('header')}
        headerElevation={2}
        onDismiss={controller.TOGGLE_RECEIVED_CARDS}>
        <Column
          scroll
          pX={15}
          refreshControl={
            <RefreshControl
              refreshing={controller.isRefreshingVcs}
              onRefresh={controller.REFRESH}
            />
          }>
          {controller.vcKeys.map((vcKey) => (
            <VcItem
              key={vcKey}
              vcKey={vcKey}
              margin="0 2 8 2"
              isSharingVc
              onPress={controller.VIEW_VC}
            />
          ))}
          {controller.vcKeys.length === 0 && (
            <React.Fragment>
              <Centered fill>
                <Icon
                  style={{ marginBottom: 20 }}
                  size={40}
                  name="sentiment-dissatisfied"
                />
                <Text
                  testID="noCardAvailable"
                  align="center"
                  weight="semibold"
                  margin="0 0 4 0">
                  {t('noReceivedVcsTitle')}
                </Text>
                <Text
                  testID="requestBelowToReceiveCard"
                  align="center"
                  color={Theme.Colors.textLabel}>
                  {t('noReceivedVcsText')}
                </Text>
              </Centered>
            </React.Fragment>
          )}
        </Column>
        {controller.selectedVc && (
          <ViewVcModal
            isVisible={controller.isViewingVc}
            onDismiss={controller.DISMISS_MODAL}
            vcItemActor={controller.selectedVc}
            onRevokeDelete={() => {
              controller.REVOKE();
            }}
            activeTab={controller.activeTab}
          />
        )}
      </Modal>
    </React.Fragment>
  );
};
