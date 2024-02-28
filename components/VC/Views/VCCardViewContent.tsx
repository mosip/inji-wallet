import React from 'react';
import {ImageBackground, Pressable} from 'react-native';
import {getLocalizedField} from '../../../i18n';
import {VCMetadata} from '../../../shared/VCMetadata';

import {KebabPopUp} from '../../KebabPopUp';
import {VerifiableCredential} from '../../../types/VC/ExistingMosipVC/vc';
import {Column, Row} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import {CheckBox, Icon} from 'react-native-elements';
import {SvgImage, faceImageSource} from '../../ui/svg';
import {
  getIssuerLogo,
  isVCLoaded,
  setBackgroundColour,
  setTextColor,
} from '../common/VCUtils';
import {VCItemFieldValue} from '../common/VCItemField';
import {useTranslation} from 'react-i18next';
import {WalletBinding} from '../../../screens/Home/MyVcs/WalletBinding';
import {VCVerification} from '../../VCVerification';
import {Issuers} from '../../../shared/openId4VCI/Utils';
import {VCItemContainerFlowType} from '../../../shared/Utils';

export const VCCardViewContent: React.FC<
  ExistingMosipVCItemContentProps | EsignetMosipVCItemContentProps
> = props => {
  const {t} = useTranslation('VcDetails');
  const selectableOrCheck = props.selectable ? (
    <CheckBox
      checked={props.selected}
      checkedIcon={
        <Icon name="check-circle" type="material" color={Theme.Colors.Icon} />
      }
      uncheckedIcon={
        <Icon
          name="radio-button-unchecked"
          color={Theme.Colors.uncheckedIcon}
        />
      }
      onPress={() => props.onPress()}
    />
  ) : null;

  return (
    <ImageBackground
      source={!props.credential ? null : Theme.CloseCard}
      resizeMode="stretch"
      style={[
        !props.credential
          ? Theme.Styles.vertloadingContainer
          : Theme.Styles.backgroundImageContainer,
        setBackgroundColour(props.wellknown),
      ]}>
      <Column>
        <Row crossAlign="center" padding="3 0 0 3">
          {SvgImage.VcItemContainerProfileImage(props)}
          <Column fill align={'space-around'} margin="0 10 0 10">
            <VCItemFieldValue
              key={'fullName'}
              fieldName="fullName"
              fieldValue={getLocalizedField(
                props.credential?.credentialSubject['fullName'],
              )}
              wellknown={props.wellknown}
            />
            <Row>
              <VCVerification
                wellknown={props.wellknown}
                isVerified={props.isVerified}
              />
            </Row>
          </Column>

          {!isVCLoaded(props.credential, props.fields)
            ? null
            : getIssuerLogo(
                new VCMetadata(props.vcMetadata).isFromOpenId4VCI(),
                props.verifiableCredential?.issuerLogo,
              )}

          {props.flow !== undefined &&
          props.flow in VCItemContainerFlowType ? null : (
            <>
              {props.vcMetadata.issuer === Issuers.Sunbird ||
              !props.emptyWalletBindingId
                ? SvgImage.walletActivatedIcon()
                : SvgImage.walletUnActivatedIcon()}
              <Pressable
                onPress={props.KEBAB_POPUP}
                accessible={false}
                style={Theme.Styles.kebabPressableContainer}>
                <KebabPopUp
                  iconColor={setTextColor(props.wellknown)}
                  vcMetadata={props.vcMetadata}
                  iconName="dots-three-horizontal"
                  iconType="entypo"
                  isVisible={props.isKebabPopUp}
                  onDismiss={props.DISMISS}
                  service={props.service}
                  vcHasImage={faceImageSource(props) !== undefined}
                />
              </Pressable>
            </>
          )}
          <Column>{props.credential ? selectableOrCheck : null}</Column>
        </Row>
        <Row align={'space-between'} margin="0 8 5 8"></Row>
        <WalletBinding service={props.service} vcMetadata={props.vcMetadata} />
      </Column>
    </ImageBackground>
  );
};

export interface ExistingMosipVCItemContentProps {
  context: any;
  verifiableCredential: VerifiableCredential;
  credential: VerifiableCredential;
  fields: [];
  wellknown: {};
  generatedOn: string;
  selectable: boolean;
  selected: boolean;
  isPinned?: boolean;
  service: any;
  onPress?: () => void;
  isDownloading?: boolean;
  flow?: string;
  emptyWalletBindingId: boolean;
  KEBAB_POPUP: () => {};
  DISMISS: () => {};
  isKebabPopUp: boolean;
  vcMetadata: VCMetadata;
  isVerified?: boolean;
}

export interface EsignetMosipVCItemContentProps {
  context: any;
  credential: VerifiableCredential;
  fields: [];
  wellknown: {};
  generatedOn: string;
  selectable: boolean;
  selected: boolean;
  isPinned?: boolean;
  service: any;
  onPress?: () => void;
  isDownloading?: boolean;
  flow?: string;
  emptyWalletBindingId: boolean;
  verifiableCredential: VerifiableCredential;
  KEBAB_POPUP: () => {};
  DISMISS: () => {};
  isKebabPopUp: boolean;
  vcMetadata: VCMetadata;
  isVerified?: boolean;
}

VCCardViewContent.defaultProps = {
  isPinned: false,
};
