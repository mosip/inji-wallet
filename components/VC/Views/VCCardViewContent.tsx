import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ImageBackground} from 'react-native';
import {VerifiableCredential} from '../../../types/VC/ExistingMosipVC/vc';
import {Column, Row} from '../../ui';
import {Theme} from '../../ui/styleUtils';
import {CheckBox, Icon} from 'react-native-elements';
import {SvgImage} from '../../ui/svg';
import {getCredentialIssuersWellKnownConfig} from '../../../shared/openId4VCI/Utils';
import {
  CARD_VIEW_ADD_ON_FIELDS,
  CARD_VIEW_DEFAULT_FIELDS,
} from '../../../shared/constants';
import {VCCardInnerSkeleton} from '../common/VCCardInnerSkeleton';
import {
  fieldItemIterator,
  getIssuerLogo,
  isVCLoaded,
  setBackgroundColour,
} from '../common/VCUtils';
import VerifiedIcon from '../../VerifiedIcon';
import {VCItemField} from '../common/VCItemField';

export const VCCardViewContent: React.FC<
  ExistingMosipVCItemContentProps | EsignetMosipVCItemContentProps
> = props => {
  const verifiableCredential = props.isDownloading
    ? null
    : props.vcMetadata.isFromOpenId4VCI()
    ? props.verifiableCredential?.credential
    : props.verifiableCredential;

  const {t} = useTranslation('VcDetails');
  const [fields, setFields] = useState([]);
  const [wellknown, setWellknown] = useState(null);
  useEffect(() => {
    getCredentialIssuersWellKnownConfig(
      props?.vcMetadata.issuer,
      props.verifiableCredential?.wellKnown,
      CARD_VIEW_DEFAULT_FIELDS,
    ).then(response => {
      setWellknown(response.wellknown);
      setFields(response.fields.slice(0, 1).concat(CARD_VIEW_ADD_ON_FIELDS));
    });
  }, [props.verifiableCredential?.wellKnown]);

  if (!isVCLoaded(verifiableCredential, fields)) {
    return <VCCardInnerSkeleton />;
  }
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
      source={!verifiableCredential ? null : Theme.CloseCard}
      resizeMode="stretch"
      style={[
        !verifiableCredential
          ? Theme.Styles.vertloadingContainer
          : Theme.Styles.backgroundImageContainer,
        setBackgroundColour(wellknown),
      ]}>
      <Column>
        <Row align="space-between">
          <Row margin="5 0 0 5">
            {SvgImage.VcItemContainerProfileImage(props, verifiableCredential)}
            <Column margin={'0 0 0 20'}>
              {fieldItemIterator(
                fields.slice(0, 2),
                verifiableCredential,
                wellknown,
                props,
              )}
            </Column>
          </Row>
          <Column>{verifiableCredential ? selectableOrCheck : null}</Column>
        </Row>
        {fieldItemIterator(
          fields.slice(2),
          verifiableCredential,
          wellknown,
          props,
        )}
        <Row align={'space-between'} margin="0 8 5 8">
          <VCItemField
            key={'status'}
            fieldName={t('status')}
            fieldValue={
              !isVCLoaded(verifiableCredential, fields) ? null : (
                <VerifiedIcon />
              )
            }
            wellknown={wellknown}
            verifiableCredential={verifiableCredential}
          />
          <Column
            testID="logo"
            style={{
              display: verifiableCredential ? 'flex' : 'none',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {!isVCLoaded(verifiableCredential, fields)
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
