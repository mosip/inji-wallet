import {
  Credential,
  CredentialSubject,
  CredentialTypes,
  IssuerWellknownResponse,
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
import {VCItemDetailsProps} from '../Views/VCDetailView';
import {
  getDisplayObjectForCurrentLanguage,
  getMatchingCredentialIssuerMetadata,
} from '../../../shared/openId4VCI/Utils';
import {VCFormat} from '../../../shared/VCFormat';

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

export const KEY_TYPE_FIELD = ['keytype'];
export const BOTTOM_SECTION_FIELDS_WITH_DETAILED_ADDRESS_FIELDS = [
  ...getAddressFields(),
  'email',
  'credentialRegistry',
];

function iterateMsoMdocFor(
  credential,
  namespace: string,
  element: 'elementIdentifier' | 'elementValue',
  fieldName: string,
) {
  const foundItem = credential['issuerSigned']['nameSpaces'][namespace].find(
    element => {
      return element.elementIdentifier === fieldName;
    },
  );
  return foundItem[element];
}

export const getFieldValue = (
  verifiableCredential: Credential,
  field: string,
  wellknown: any,
  props: any,
  format: string,
) => {
  switch (field) {
    case 'status':
      return (
        <VCVerification
          wellknown={wellknown}
          vcMetadata={props.verifiableCredentialData.vcMetadata}
        />
      );
    case 'idType':
      return getCredentialType(wellknown);
    case 'credentialRegistry':
      return props?.vc?.credentialRegistry;
    case 'address':
      return getLocalizedField(
        getFullAddress(verifiableCredential?.credentialSubject),
      );
    default: {
      if (format === VCFormat.ldp_vc) {
        const fieldValue = verifiableCredential?.credentialSubject[field];
        if (Array.isArray(fieldValue) && typeof fieldValue[0] !== 'object') {
          return fieldValue.join(', ');
        }
        return getLocalizedField(fieldValue);
      } else if (format === VCFormat.mso_mdoc) {
        const splitField = field.split('~');
        if (splitField.length > 1) {
          const [namespace, fieldName] = splitField;
          return iterateMsoMdocFor(
            verifiableCredential,
            namespace,
            'elementValue',
            fieldName,
          );
        }
      }
    }
  }
};

export const getFieldName = (
  field: string,
  wellknown: any,
  format: string,
): string => {
  if (wellknown) {
    if (format === VCFormat.ldp_vc) {
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
    } else if (format === VCFormat.mso_mdoc) {
      const splitField = field.split('~');
      if (splitField.length > 1) {
        const [namespace, fieldName] = splitField;
        const fieldObj = wellknown.claims[namespace][fieldName];
        if (fieldObj) {
          const newFieldObj = fieldObj.display.map(obj => {
            return {language: obj.locale, value: obj.name};
          });
          return getLocalizedField(newFieldObj);
        }
      }
    }
  }
  return i18n.t(`VcDetails:${field}`);
};

export const getBackgroundColour = (wellknown: any) => {
  const defaultBackgroundColor = Theme.Colors.textValue;
  const wellknownDisplayProperty = wellknown?.display
    ? getDisplayObjectForCurrentLanguage(wellknown.display)
    : {};

  return {
    backgroundColor:
      wellknownDisplayProperty?.background_color ?? defaultBackgroundColor,
  };
};

export const getBackgroundImage = (wellknown: any, defaultBackground: any) => {
  const wellknownDisplayProperty = wellknown?.display
    ? getDisplayObjectForCurrentLanguage(wellknown.display)
    : {};

  return wellknownDisplayProperty?.background_image ?? defaultBackground;
};

export const getTextColor = (wellknown: any, defaultColor: string) => {
  return (
    (wellknown?.display?.length ? wellknown.display[0]?.text_color : null) ??
    defaultColor
  );
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

export const fieldItemIterator = (
  fields: any[],
  verifiableCredential: VerifiableCredential | Credential,
  wellknown: any,
  props: VCItemDetailsProps,
) => {
  return fields.map(field => {
    const fieldName = getFieldName(
      field,
      wellknown,
      props.verifiableCredentialData.vcMetadata.format,
    );
    const fieldValue = getFieldValue(
      verifiableCredential,
      field,
      wellknown,
      props,
      props.verifiableCredentialData.vcMetadata.format,
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
  verifiableCredential: Credential | null,
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

/**
 *
 * @param wellknown (either supportedCredential's wellknown or whole well known response of issuer)
 * @param credentialConfigurationId
 * @returns credential type translations (Eg - National ID)
 *
 */
export const getCredentialType = (
  supportedCredentialsWellknown: CredentialTypes,
): string => {
  if (supportedCredentialsWellknown['display']) {
    const idTypeObj = supportedCredentialsWellknown.display.map(
      (displayProps: any) => ({
        language: displayProps.locale,
        value: displayProps.name,
      }),
    );
    return getLocalizedField(idTypeObj);
  }
  if (supportedCredentialsWellknown.format === VCFormat.ldp_vc) {
    const types = supportedCredentialsWellknown.credential_definition
      .type as string[];
    return types[1];
  } else {
    return i18n.t('VcDetails:identityCard');
  }
};

export const getCredentialTypeFromWellKnown = (
  wellknown: IssuerWellknownResponse,
  credentialConfigurationId: string | undefined = undefined,
): string => {
  if (credentialConfigurationId !== undefined) {
    const supportedCredentialsWellknown = getMatchingCredentialIssuerMetadata(
      wellknown,
      credentialConfigurationId,
    );
    return getCredentialType(supportedCredentialsWellknown);
  }
  console.error(
    'credentialConfigurationId not available for fetching the Credential type',
  );
  throw new Error(
    `Invalid credentialConfigurationId - ${credentialConfigurationId} passed`,
  );
};
