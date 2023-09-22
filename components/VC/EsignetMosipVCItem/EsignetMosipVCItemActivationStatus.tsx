import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { Theme } from '../../ui/styleUtils';
import { Row, Text } from '../../ui';
import { VerifiableCredential } from './vc';

const WalletUnverifiedIcon: React.FC = () => {
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

const WalletVerifiedIcon: React.FC = () => {
  return (
    <Icon
      name="verified-user"
      color={Theme.Colors.VerifiedIcon}
      size={28}
      containerStyle={{ marginStart: 4, bottom: 1 }}
    />
  );
};

const WalletUnverifiedActivationDetails: React.FC<
  WalletUnVerifiedDetailsProps
> = (props) => {
  const { t } = useTranslation('VcDetails');
  return (
    <Row
      width={Dimensions.get('screen').width * 0.8}
      align="space-between"
      crossAlign="center">
      <Row
        crossAlign="center"
        style={{
          flex: 1,
        }}>
        {props.verifiableCredential && <WalletUnverifiedIcon />}
        <Text
          color={Theme.Colors.Details}
          testID="activationPending"
          weight="semibold"
          size="small"
          margin="10 33 10 10"
          style={
            !props.verifiableCredential
              ? Theme.Styles.loadingTitle
              : Theme.Styles.statusLabel
          }>
          {t('profileAuthenticated')}
        </Text>
      </Row>
    </Row>
  );
};

const WalletVerifiedActivationDetails: React.FC<WalletVerifiedDetailsProps> = (
  props
) => {
  const { t } = useTranslation('VcDetails');
  return (
    <Row
      width={Dimensions.get('screen').width * 0.8}
      align="space-between"
      crossAlign="center">
      <Row
        crossAlign="center"
        style={{
          flex: 1,
        }}>
        <WalletVerifiedIcon />
        <Text
          color={Theme.Colors.statusLabel}
          testID="activated"
          weight="semibold"
          size="smaller"
          margin="10 10 10 10"
          style={
            !props.verifiableCredential
              ? Theme.Styles.loadingTitle
              : Theme.Styles.subtitle
          }>
          {t('profileAuthenticated')}
        </Text>
      </Row>
    </Row>
  );
};

export const EsignetMosipVCActivationStatus: React.FC<
  EsignetMosipVCActivationStatusProps
> = (props) => {
  return (
    <Row>
      {props.emptyWalletBindingId ? (
        <WalletUnverifiedActivationDetails
          verifiableCredential={props.verifiableCredential}
        />
      ) : (
        <WalletVerifiedActivationDetails
          verifiableCredential={props.verifiableCredential}
          showOnlyBindedVc={props.showOnlyBindedVc}
        />
      )}
    </Row>
  );
};

export interface EsignetMosipVCActivationStatusProps {
  showOnlyBindedVc: boolean;
  verifiableCredential: VerifiableCredential;
  emptyWalletBindingId: boolean;
}

interface WalletVerifiedDetailsProps {
  showOnlyBindedVc: boolean;
  verifiableCredential: VerifiableCredential;
}

interface WalletUnVerifiedDetailsProps {
  verifiableCredential: VerifiableCredential;
}
