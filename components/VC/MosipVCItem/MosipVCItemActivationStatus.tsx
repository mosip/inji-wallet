import React from 'react';
import {useTranslation} from 'react-i18next';
import {Icon} from 'react-native-elements';
import {VerifiableCredential} from '../../../types/VC/ExistingMosipVC/vc';
import {Row, Text} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import {View} from 'react-native';
import {isActivationNeeded} from '../../../shared/openId4VCI/Utils';
import {VCMetadata} from '../../../shared/VCMetadata';

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
      <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
        {props.verifiableCredential && <WalletUnverifiedIcon />}
      </View>
      <View style={{flex: 4}}>
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
      </View>
    </Row>
  );
};

const WalletVerifiedActivationDetails: React.FC<
  WalletVerifiedDetailsProps
> = props => {
  const {t} = useTranslation('WalletBinding');
  return (
    <Row style={Theme.Styles.vcActivationDetailsWrapper}>
      <View style={{flex: 1, alignSelf: 'center', justifyContent: 'center'}}>
        <WalletVerifiedIcon />
      </View>
      <View style={{flex: 4}}>
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
          children={
            isActivationNeeded(props?.vcMetadata.issuer)
              ? t('profileAuthenticated')
              : t('credentialActivated')
          }></Text>
      </View>
    </Row>
  );
};

export const MosipVCItemActivationStatus: React.FC<
  ExistingMosipVCItemActivationStatusProps
> = props => {
  return (
    <Row style={Theme.Styles.vcActivationStatusContainer}>
      {props.emptyWalletBindingId &&
      isActivationNeeded(props?.vcMetadata.issuer) ? (
        <WalletUnverifiedActivationDetails
          verifiableCredential={props.verifiableCredential}
        />
      ) : (
        <WalletVerifiedActivationDetails
          verifiableCredential={props.verifiableCredential}
          showOnlyBindedVc={props.showOnlyBindedVc}
          vcMetadata={props.vcMetadata}
        />
      )}
    </Row>
  );
};

interface ExistingMosipVCItemActivationStatusProps {
  showOnlyBindedVc: boolean;
  verifiableCredential: VerifiableCredential;
  emptyWalletBindingId: boolean;
}

interface WalletVerifiedDetailsProps {
  showOnlyBindedVc: boolean;
  verifiableCredential: VerifiableCredential;
  vcMetadata: VCMetadata;
}

interface WalletUnVerifiedDetailsProps {
  verifiableCredential: VerifiableCredential;
}
