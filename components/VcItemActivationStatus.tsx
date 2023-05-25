import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import { ActorRefFrom } from 'xstate';
import { vcItemMachine } from '../machines/vcItem';
import { VerifiableCredential } from '../types/vc';
import { Row, Text } from './ui';
import { Theme } from './ui/styleUtils';

const WalletUnverified: React.FC = () => {
  return (
    <Icon
      name="shield-alert"
      color={Theme.Colors.Icon}
      size={28}
      type="material-community"
      containerStyle={{ marginStart: 4, bottom: 1 }}
    />
  );
};

const WalletVerified: React.FC = () => {
  return (
    <Icon
      name="verified-user"
      color={Theme.Colors.VerifiedIcon}
      size={28}
      containerStyle={{ marginStart: 4, bottom: 1 }}
    />
  );
};

export const VcItemActivationStatus: React.FC<VcItemActivationStatusProps> = (
  props
) => {
  const { t } = useTranslation('VcDetails');
  return (
    <Row>
      {props.emptyWalletBindingId ? (
        <Row
          width={Dimensions.get('screen').width * 0.8}
          align="space-between"
          crossAlign="center">
          <Row
            crossAlign="center"
            style={{
              flex: 1,
            }}>
            {props.verifiableCredential && <WalletUnverified />}
            <Text
              color={Theme.Colors.Details}
              weight="semibold"
              size="small"
              margin="10 33 10 10"
              style={
                !props.verifiableCredential
                  ? Theme.Styles.loadingTitle
                  : Theme.Styles.statusLabel
              }
              children={t('offlineAuthDisabledHeader')}></Text>
          </Row>

          <Pressable
            onPress={() =>
              props.verifiableCredential ? props.onPress() : null
            }>
            <Icon
              name="dots-three-horizontal"
              type="entypo"
              color={Theme.Colors.GrayIcon}
            />
          </Pressable>
        </Row>
      ) : (
        <Row
          width={Dimensions.get('screen').width * 0.8}
          align="space-between"
          crossAlign="center">
          <Row
            crossAlign="center"
            style={{
              flex: 1,
            }}>
            <WalletVerified />
            <Text
              color={Theme.Colors.statusLabel}
              weight="semibold"
              size="smaller"
              margin="10 10 10 10"
              style={
                !props.verifiableCredential
                  ? Theme.Styles.loadingTitle
                  : Theme.Styles.subtitle
              }
              children={t('profileAuthenticated')}></Text>
          </Row>

          {props.showOnlyBindedVc ? null : (
            <Pressable onPress={() => props.onPress()}>
              <Icon
                name="dots-three-horizontal"
                type="entypo"
                color={Theme.Colors.GrayIcon}
              />
            </Pressable>
          )}
        </Row>
      )}
    </Row>
  );
};

interface VcItemActivationStatusProps {
  showOnlyBindedVc: boolean;
  onPress: (vcRef?: ActorRefFrom<typeof vcItemMachine>) => void;
  verifiableCredential: VerifiableCredential;
  emptyWalletBindingId: boolean;
}
