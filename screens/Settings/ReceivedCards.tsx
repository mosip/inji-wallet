import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshControl } from 'react-native';
import { Pressable, TouchableOpacity } from 'react-native';
import { Centered, Column, Row, Text } from '../../components/ui';
import { Icon } from 'react-native-elements';
import { Theme } from '../../components/ui/styleUtils';
import { Image } from 'react-native';
import { Modal } from '../../components/ui/Modal';
import { HomeScreenTabProps } from '../Home/HomeScreen';
import { useReceivedVcsTab } from '../Home/ReceivedVcsTabController';
import { VcItem } from '../../components/VcItem';

export const ReceivedCards: React.FC<HomeScreenTabProps> = (props) => {
  const { t } = useTranslation('ReceivedVcsTab');
  const controller = useReceivedVcsTab(props);

  return (
    <React.Fragment>
      <Pressable onPress={controller.TOGGLE_RECEIVED_CARDS}>
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
          padding="32 24"
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
              onPress={controller.VIEW_VC}
              activeTab={props.service.id}
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
                <Text align="center" weight="semibold" margin="0 0 4 0">
                  {t('noReceivedVcsTitle', {
                    vcLabel: controller.vcLabel.plural,
                  })}
                </Text>
                <Text align="center" color={Theme.Colors.textLabel}>
                  {t('noReceivedVcsText', {
                    vcLabel: controller.vcLabel.singular,
                  })}
                </Text>
              </Centered>
            </React.Fragment>
          )}
        </Column>
      </Modal>
    </React.Fragment>
  );
};
