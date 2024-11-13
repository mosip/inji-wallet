import {
  Credential,
  VC,
  VcIdType,
  VerifiableCredential,
} from '../machines/VerifiableCredential/VCMetaMachine/vc';
import {Protocols} from './openId4VCI/Utils';
import {getMosipIdentifier} from './commonUtil';
import {VCFormat} from './VCFormat';

const VC_KEY_PREFIX = 'VC';
const VC_ITEM_STORE_KEY_REGEX = '^VC_[a-zA-Z0-9_-]+$';

export class VCMetadata {
  static vcKeyRegExp = new RegExp(VC_ITEM_STORE_KEY_REGEX);
  idType: VcIdType | string = '';
  requestId = '';
  isPinned = false;
  id: string = '';
  issuer?: string = '';
  protocol?: string = '';
  timestamp?: string = '';
  isVerified: boolean = false;
  displayId: string = '';
  format: string = '';
  isExpired: boolean = false;

  downloadKeyType: string = '';
  constructor({
    idType = '',
    requestId = '',
    isPinned = false,
    id = '',
    issuer = '',
    protocol = '',
    timestamp = '',
    isVerified = false,
    displayId = '',
    format = '',
    downloadKeyType = '',
    isExpired = false,
  } = {}) {
    this.idType = idType;
    this.requestId = requestId;
    this.isPinned = isPinned;
    this.id = id;
    this.protocol = protocol;
    this.issuer = issuer;
    this.timestamp = timestamp;
    this.isVerified = isVerified;
    this.displayId = displayId;
    this.format = format;
    this.downloadKeyType = downloadKeyType;
    this.isExpired = isExpired;
  }

  //TODO: Remove any typing and use appropriate typing
  static fromVC(vc: Partial<VC> | VCMetadata | any) {
    return new VCMetadata({
      idType: vc.idType,
      format: vc.format || VCFormat.ldp_vc,
      requestId: vc.requestId,
      isPinned: vc.isPinned || false,
      id: vc.id,
      protocol: vc.protocol,
      issuer: vc.issuer,
      timestamp: vc.vcMetadata ? vc.vcMetadata.timestamp : vc.timestamp,
      isVerified: vc.isVerified,
      isExpired: vc.isExpired,
      displayId: vc.displayId
        ? vc.displayId
        : vc.vcMetadata
        ? vc.vcMetadata.displayId
        : getDisplayId(vc.verifiableCredential, vc.format),
      downloadKeyType: vc.downloadKeyType,
    });
  }

  static fromVcMetadataString(vcMetadataStr: string | object) {
    try {
      if (typeof vcMetadataStr === 'object')
        return new VCMetadata(vcMetadataStr);
      return new VCMetadata(JSON.parse(vcMetadataStr));
    } catch (e) {
      console.error('Failed to parse VC Metadata', e);
      return new VCMetadata();
    }
  }

  static isVCKey(key: string): boolean {
    return VCMetadata.vcKeyRegExp.exec(key) != null;
  }

  isFromOpenId4VCI() {
    return this.protocol === Protocols.OpenId4VCI;
  }

  // Used for mmkv storage purposes and as a key for components and vc maps
  // Update VC_ITEM_STORE_KEY_REGEX in case of changes in vckey
  getVcKey(): string {
    return this.timestamp !== ''
      ? `${VC_KEY_PREFIX}_${this.timestamp}_${this.requestId}`
      : `${VC_KEY_PREFIX}_${this.requestId}`;
  }

  equals(other: VCMetadata): boolean {
    return this.getVcKey() === other.getVcKey();
  }
}

export function parseMetadatas(metadataStrings: object[]) {
  return metadataStrings.map(o => new VCMetadata(o));
}

export const getVCMetadata = (context: object, keyType: string) => {
  const [issuer, protocol, credentialId] =
    context.credentialWrapper?.identifier.split(':');

  return VCMetadata.fromVC({
    requestId: credentialId ?? null,
    issuer: issuer,
    protocol: protocol,
    id: `${credentialId} + '_' + ${issuer}`,
    timestamp: context.timestamp ?? '',
    isVerified: context.vcMetadata.isVerified ?? false,
    isExpired: context.vcMetadata.isExpired ?? false,
    displayId: getDisplayId(
      context['verifiableCredential'] as VerifiableCredential,
      context['credentialWrapper'].format,
    ),
    format: context['credentialWrapper'].format,
    downloadKeyType: keyType,
  });
};

const getDisplayId = (
  verifiableCredential: VerifiableCredential | Credential,
  format: string,
) => {
  try {
    if (format === VCFormat.mso_mdoc) {
      const namespaces =
        (verifiableCredential as VerifiableCredential)?.processedCredential?.[
          'issuerSigned'
        ]['nameSpaces'] ?? {};

      let displayId: string | undefined;
      for (const namespace in namespaces) {
        displayId = namespaces[namespace].find(
          (element: object) =>
            element['elementIdentifier'] === 'document_number',
        ).elementValue;
        if (!!displayId) break;
      }

      if (!!displayId) return displayId;
      console.error('error in id getting ', 'Id not found for the credential');
      throw new Error('Id not found for the credential');
    }
    if (verifiableCredential?.credential) {
      if (verifiableCredential.credential?.credentialSubject) {
        return (
          verifiableCredential.credential?.credentialSubject?.policyNumber ||
          getMosipIdentifier(verifiableCredential.credential.credentialSubject)
        );
      }
    }
    return (
      verifiableCredential?.credentialSubject?.policyNumber ||
      getMosipIdentifier(verifiableCredential.credentialSubject)
    );
  } catch (error) {
    console.error('Error getting the display Id - ', error);
    return null;
  }
};
