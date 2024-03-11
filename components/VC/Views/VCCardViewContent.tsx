import React from 'react';
import {ImageBackground} from 'react-native';
import {VerifiableCredential} from '../../../types/VC/ExistingMosipVC/vc';
import {Column, Row} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import {CheckBox, Icon} from 'react-native-elements';
import {
  fieldItemIterator,
  getIssuerLogo,
  isVCLoaded,
  setBackgroundColour,
} from '../common/VCUtils';
import {VCItemField} from '../common/VCItemField';
import {useTranslation} from 'react-i18next';
import {getIDType} from '../../../shared/openId4VCI/Utils';
import {VCVerification} from '../../VCVerification';
import {VcItemContainerProfileImage} from '../../VcItemContainerProfileImage';

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
        <Row align="space-between">
          <Row margin="0 0 0 5">
            {VcItemContainerProfileImage(props, props.credential)}
            <Column margin={'0 0 0 20'}>
              {fieldItemIterator(
                props.fields.slice(0, 2),
                props.credential,
                props.wellknown,
                props,
              )}
            </Column>
          </Row>
          <Column>{props.credential ? selectableOrCheck : null}</Column>
        </Row>
        <Column margin="0 0 0 8">
          {fieldItemIterator(
            props.fields.slice(2),
            props.credential,
            props.wellknown,
            props,
          )}
        </Column>
        <Row align={'space-between'} margin="0 8 5 8">
          <VCItemField
            key={'idType'}
            fieldName={t('idType')}
            fieldValue={getIDType(props.credential)}
            wellknown={props.wellknown}
            verifiableCredential={props.credential}
          />
          <VCItemField
            key={'status'}
            fieldName={t('status')}
            fieldValue={<VCVerification wellknown={props.wellknown} />}
            wellknown={props.wellknown}
            verifiableCredential={props.credential}
          />

          <Column
            testID="logo"
            style={{
              display: props.credential ? 'flex' : 'none',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {!isVCLoaded(props.credential, props.fields)
              ? null
              : getIssuerLogo(
                  props.vcMetadata.isFromOpenId4VCI(),
                  props.verifiableCredential?.issuerLogo,
                )}
          </Column>
        </Row>
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
}

VCCardViewContent.defaultProps = {
  isPinned: false,
};
