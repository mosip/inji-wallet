import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import {Icon} from 'react-native-elements';
import {ActorRefFrom} from 'xstate';
import {ExistingMosipVCItemMachine} from '../../../machines/VCItemMachine/ExistingMosipVCItem/ExistingMosipVCItemMachine';
import {VerifiableCredential} from '../../../types/VC/ExistingMosipVC/vc';
import {Row, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';

const WalletUnverifiedIcon: React.FC = () => {
  return (
    <Icon
      name="shield-alert"
      color={Theme.Colors.Icon}
      size={Theme.ICON_MID_SIZE}
      type="material-community"
      containerStyle={{
        marginEnd: 5,
        bottom: 1,
      }}
    />
  );
};

const WalletVerifiedIcon: React.FC = () => {
  return (
    <Icon
      name="verified-user"
      color={Theme.Colors.VerifiedIcon}
      size={Theme.ICON_MID_SIZE}
      containerStyle={{
        marginEnd: 5,
        bottom: 1,
      }}
    />
  );
};

const WalletUnverifiedActivationDetails: React.FC<
  WalletUnVerifiedDetailsProps
> = props => {
  const {t} = useTranslation('VcDetails');
  return (
    <Row style={Theme.Styles.vcActivationDetailsWrapper}>
      {props.verifiableCredential && <WalletUnverifiedIcon />}
      <Text
        color={Theme.Colors.Details}
        testID="activationPending"
        weight="regular"
        style={
          !props.verifiableCredential
            ? Theme.Styles.loadingTitle
            : Theme.Styles.statusLabel
        }
        children={t('offlineAuthDisabledHeader')}></Text>
    </Row>
  );
};

const WalletVerifiedActivationDetails: React.FC<
  WalletVerifiedDetailsProps
> = props => {
  const {t} = useTranslation('WalletBinding');
  return (
    <Row style={Theme.Styles.vcActivationDetailsWrapper}>
      <WalletVerifiedIcon />
      <Text
        color={Theme.Colors.statusLabel}
        testID="activated"
        weight="regular"
        size="smaller"
        margin="0 0 0 5"
        style={
          !props.verifiableCredential
            ? Theme.Styles.loadingTitle
            : Theme.Styles.statusLabel
        }
        children={t('profileAuthenticated')}></Text>
    </Row>
  );
};

export const MosipVCItemActivationStatus: React.FC<
  ExistingMosipVCItemActivationStatusProps
> = props => {
  return (
    <Row style={Theme.Styles.vcActivationStatusContainer}>
      {props.emptyWalletBindingId ? (
        <WalletUnverifiedActivationDetails
          verifiableCredential={props.verifiableCredential}
          onPress={props.onPress}
        />
      ) : (
        <WalletVerifiedActivationDetails
          verifiableCredential={props.verifiableCredential}
          showOnlyBindedVc={props.showOnlyBindedVc}
          onPress={props.onPress}
        />
      )}
    </Row>
  );
};

interface ExistingMosipVCItemActivationStatusProps {
  showOnlyBindedVc: boolean;
  onPress: (vcRef?: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => void;
  verifiableCredential: VerifiableCredential;
  emptyWalletBindingId: boolean;
}

interface WalletVerifiedDetailsProps {
  showOnlyBindedVc: boolean;
  onPress: (vcRef?: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => void;
  verifiableCredential: VerifiableCredential;
}

interface WalletUnVerifiedDetailsProps {
  onPress: (vcRef?: ActorRefFrom<typeof ExistingMosipVCItemMachine>) => void;
  verifiableCredential: VerifiableCredential;
}
