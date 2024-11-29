import React from 'react';
import {ImageBackground, Pressable, Image, View} from 'react-native';
import {VCMetadata} from '../../../shared/VCMetadata';
import {KebabPopUp} from '../../KebabPopUp';
import {Credential} from '../../../machines/VerifiableCredential/VCMetaMachine/vc';
import {Column, Row} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import {CheckBox, Icon} from 'react-native-elements';
import {SvgImage} from '../../ui/svg';
import {VcItemContainerProfileImage} from '../../VcItemContainerProfileImage';
import {isVCLoaded, getCredentialType, Display} from '../common/VCUtils';
import {VCItemFieldValue} from '../common/VCItemField';
import {WalletBinding} from '../../../screens/Home/MyVcs/WalletBinding';
import {VCVerification} from '../../VCVerification';
import {isActivationNeeded} from '../../../shared/openId4VCI/Utils';
import {VCItemContainerFlowType} from '../../../shared/Utils';
import {RemoveVcWarningOverlay} from '../../../screens/Home/MyVcs/RemoveVcWarningOverlay';
import {HistoryTab} from '../../../screens/Home/MyVcs/HistoryTab';
import {useCopilot} from 'react-native-copilot';
import {useTranslation} from 'react-i18next';

export const VCCardViewContent: React.FC<VCItemContentProps> = props => {
  const wellknownDisplayProperty = new Display(props.wellknown);

  const vcSelectableButton =
    props.selectable &&
    (props.flow === VCItemContainerFlowType.VP_SHARE ? (
      <CheckBox
        checked={props.selected}
        checkedIcon={SvgImage.selectedCheckBox()}
        uncheckedIcon={
          <Icon
            name="check-box-outline-blank"
            color={Theme.Colors.uncheckedIcon}
            size={22}
          />
        }
        onPress={() => props.onPress()}
      />
    ) : (
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
    ));
  const issuerLogo = props.verifiableCredentialData.issuerLogo;
  const faceImage = props.verifiableCredentialData.face;
  const {start} = useCopilot();
  const {t} = useTranslation();

  return (
    <ImageBackground
      source={wellknownDisplayProperty.getBackgroundImage(Theme.CloseCard)}
      resizeMode="stretch"
      imageStyle={Theme.Styles.vcBg}
      style={[
        Theme.Styles.backgroundImageContainer,
        wellknownDisplayProperty.getBackgroundColor(),
      ]}>
      <View
        onLayout={
          props.isInitialLaunch
            ? () => start(t('copilot:cardTitle'))
            : undefined
        }>
        <Row crossAlign="center" padding="3 0 0 3">
          {VcItemContainerProfileImage(props)}
          <Column fill align={'space-around'} margin="0 10 0 10">
            <VCItemFieldValue
              key={'credentialType'}
              testID="credentialType"
              fieldValue={getCredentialType(props.wellknown)}
              fieldValueColor={wellknownDisplayProperty.getTextColor(
                Theme.Colors.Details,
              )}
            />
            <Row>
              <VCVerification
                vcMetadata={props.verifiableCredentialData?.vcMetadata}
                display={wellknownDisplayProperty}
              />
            </Row>
          </Column>

          {isVCLoaded(props.credential, props.fields) && (
            <Image
              src={issuerLogo?.url}
              alt={issuerLogo?.alt_text}
              style={Theme.Styles.issuerLogo}
              resizeMethod="scale"
              resizeMode="contain"
            />
          )}

          {!Object.values(VCItemContainerFlowType).includes(props.flow) && (
            <>
              {!props.verifiableCredentialData?.vcMetadata.isExpired &&
                (!props.walletBindingResponse &&
                isActivationNeeded(props.verifiableCredentialData?.issuer)
                  ? SvgImage.walletUnActivatedIcon()
                  : SvgImage.walletActivatedIcon())}
              <Pressable
                onPress={props.KEBAB_POPUP}
                accessible={false}
                style={Theme.Styles.kebabPressableContainer}>
                <KebabPopUp
                  iconColor={wellknownDisplayProperty.getTextColor(
                    Theme.Colors.helpText,
                  )}
                  vcMetadata={props.vcMetadata}
                  iconName="dots-three-horizontal"
                  iconType="entypo"
                  isVisible={props.isKebabPopUp}
                  onDismiss={props.DISMISS}
                  service={props.service}
                  vcHasImage={faceImage !== undefined}
                />
              </Pressable>
            </>
          )}
          {vcSelectableButton}
        </Row>

        <WalletBinding service={props.service} vcMetadata={props.vcMetadata} />

        <RemoveVcWarningOverlay
          testID="removeVcWarningOverlay"
          service={props.service}
          vcMetadata={props.vcMetadata}
        />

        <HistoryTab service={props.service} vcMetadata={props.vcMetadata} />
      </View>
    </ImageBackground>
  );
};

export interface VCItemContentProps {
  context: any;
  credential: Credential;
  verifiableCredentialData: any;
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
  walletBindingResponse: {};
  KEBAB_POPUP: () => {};
  DISMISS: () => {};
  isKebabPopUp: boolean;
  vcMetadata: VCMetadata;
  isInitialLaunch?: boolean;
}

VCCardViewContent.defaultProps = {
  isPinned: false,
};
