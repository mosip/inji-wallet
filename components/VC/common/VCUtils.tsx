import {
  Credential,
  CredentialSubject,
  VerifiableCredential,
} from '../../../machines/VerifiableCredential/VCMetaMachine/vc';
import i18n, {getLocalizedField} from '../../../i18n';
import {Row} from '../../ui';
import {VCItemField} from './VCItemField';
import React from 'react';
import {Theme} from '../../ui/styleUtils';
import {CREDENTIAL_REGISTRY_EDIT} from 'react-native-dotenv';
import {VCVerification} from '../../VCVerification';
import {MIMOTO_BASE_URL} from '../../../shared/constants';
import {useTranslation} from 'react-i18next';
import {VCItemDetailsProps} from '../Views/VCDetailView';
import {getSelectedCredentialTypeDetails} from '../../../shared/openId4VCI/Utils';

export const CARD_VIEW_DEFAULT_FIELDS = ['fullName'];
export const DETAIL_VIEW_DEFAULT_FIELDS = [
  'fullName',
  'gender',
  'phone',
  'dateOfBirth',
  'email',
  'address',
];

//todo UIN & VID to be removed once we get the fields in the wellknown endpoint
export const CARD_VIEW_ADD_ON_FIELDS = ['UIN', 'VID'];
export const DETAIL_VIEW_ADD_ON_FIELDS = [
  'status',
  'credentialRegistry',
  'idType',
];

export const DETAIL_VIEW_BOTTOM_SECTION_FIELDS = [
  'email',
  'address',
  'credentialRegistry',
];

export const BOTTOM_SECTION_FIELDS_WITH_DETAILED_ADDRESS_FIELDS = [
  ...getAddressFields(),
  'email',
  'credentialRegistry',
];

export const getFieldValue = (
  verifiableCredential: Credential,
  field: string,
  wellknown: any,
  props: any,
) => {
  switch (field) {
    case 'status':
      return (
        <VCVerification
          wellknown={wellknown}
          isVerified={props.verifiableCredentialData.vcMetadata.isVerified}
        />
      );
    case 'idType':
      return getIdType(wellknown);
    case 'credentialRegistry':
      return props?.vc?.credentialRegistry;
    case 'address':
      return getLocalizedField(
        getFullAddress(verifiableCredential?.credentialSubject),
      );
    default: {
      const fieldValue = verifiableCredential?.credentialSubject[field];
      if (Array.isArray(fieldValue) && typeof fieldValue[0] !== 'object') {
        return fieldValue.join(', ');
      }
      return getLocalizedField(fieldValue);
    }
  }
};

export const getFieldName = (field: string, wellknown: any) => {
  if (wellknown) {
    const credentialDefinition = wellknown.credential_definition;
    if (!credentialDefinition) {
      console.error(
        'Credential definition is not available for the selected credential type',
      );
    }
    let fieldObj = credentialDefinition?.credentialSubject[field];
    if (fieldObj) {
      const newFieldObj = fieldObj.display.map(obj => {
        return {language: obj.locale, value: obj.name};
      });
      return getLocalizedField(newFieldObj);
    }
  }
  return i18n.t(`VcDetails:${field}`);
};

export const getBackgroundColour = (wellknown: any) => {
  return wellknown?.display[0]?.background_color ?? Theme.Colors.textValue;
};

export const getTextColor = (wellknown: any, defaultColor: string) => {
  return wellknown?.display[0]?.text_color ?? defaultColor;
};

export function getAddressFields() {
  return [
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'province',
    'region',
    'postalCode',
  ];
}

function getFullAddress(credential: CredentialSubject) {
  if (!credential) {
    return '';
  }

  const fields = getAddressFields();

  return fields
    .map(field => getLocalizedField(credential[field]))
    .filter(Boolean)
    .join(', ');
}

function formattedDateTime(timeStamp: any) {
  if (timeStamp) {
    const options = {year: 'numeric', month: '2-digit', day: '2-digit'};
    return new Date(timeStamp).toLocaleDateString('en-US', options);
  }
  return timeStamp;
}

export const fieldItemIterator = (
  fields: any[],
  verifiableCredential: VerifiableCredential | Credential,
  wellknown: any,
  props: VCItemDetailsProps,
) => {
  return fields.map(field => {
    const fieldName = getFieldName(field, wellknown);
    const fieldValue = getFieldValue(
      verifiableCredential,
      field,
      wellknown,
      props,
    );
    if (
      (field === 'credentialRegistry' &&
        CREDENTIAL_REGISTRY_EDIT === 'false') ||
      !fieldValue
    )
      return;
    return (
      <Row
        key={field}
        style={{flexDirection: 'row', flex: 1}}
        align="space-between"
        margin="0 8 15 0">
        <VCItemField
          key={field}
          fieldName={fieldName}
          fieldValue={fieldValue}
          verifiableCredential={verifiableCredential}
          wellknown={wellknown}
          testID={field}
        />
      </Row>
    );
  });
};

export const isVCLoaded = (
  verifiableCredential: Credential,
  fields: string[],
) => {
  return verifiableCredential != null && fields.length > 0;
};

export const getMosipLogo = () => {
  return {
    url: `${MIMOTO_BASE_URL}/inji/mosip-logo.png`,
    alt_text: 'a square logo of mosip',
  };
};

export const getIdType = (wellknown: any, idType: string = '') => {
  console.log('getIdType fn ', wellknown);
  if (wellknown && wellknown?.display) {
    console.log('If case');

    const idTypeObj = wellknown.display.map((displayProps: any) => {
      return {language: displayProps.locale, value: displayProps.name};
    });
    console.log('idTypeObj ', idTypeObj);
    return getLocalizedField(idTypeObj);
  } else if (wellknown && idType !== '') {
    let supportedCredentialsWellknown;
    wellknown = JSON.parse(wellknown) as Object[];
    for (let credential in wellknown['credentials_supported']) {
      const credentialDetails = wellknown.credentials_supported[credential];
      if (
        JSON.stringify(credentialDetails.credential_definition.type) ===
        JSON.stringify(idType)
      ) {
        supportedCredentialsWellknown = credentialDetails;
      }
    }
    return getIdType(supportedCredentialsWellknown);
  } else {
    return i18n.t('VcDetails:nationalCard');
  }
};
