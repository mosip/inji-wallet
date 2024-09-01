import {
  Credential,
  VC,
  VcIdType,
  VerifiableCredential,
} from '../machines/VerifiableCredential/VCMetaMachine/vc';
import {Protocols} from './openId4VCI/Utils';
import {getMosipIdentifier} from './commonUtil';

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
    downloadKeyType='',
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
    this.downloadKeyType=downloadKeyType
  }

  //TODO: Remove any typing and use appropriate typing
  static fromVC(vc: Partial<VC> | VCMetadata | any) {
    return new VCMetadata({
      idType: vc.idType,
      requestId: vc.requestId,
      isPinned: vc.isPinned || false,
      id: vc.id,
      protocol: vc.protocol,
      issuer: vc.issuer,
      timestamp: vc.vcMetadata ? vc.vcMetadata.timestamp : vc.timestamp,
      isVerified: vc.isVerified,
      displayId: vc.displayId
        ? vc.displayId
        : vc.vcMetadata
        ? vc.vcMetadata.displayId
        : getDisplayId(vc.verifiableCredential),
      downloadKeyType:vc.downloadKeyType
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
    displayId: getDisplayId(context.verifiableCredential),
    downloadKeyType:keyType
  });
};

const getDisplayId = (
  verifiableCredential: VerifiableCredential | Credential,
) => {
  if (verifiableCredential?.credential) {
    return (
      verifiableCredential.credential?.credentialSubject?.policyNumber ||
      getMosipIdentifier(verifiableCredential.credential.credentialSubject)
    );
  }
  return (
    verifiableCredential?.credentialSubject?.policyNumber ||
    getMosipIdentifier(verifiableCredential.credentialSubject)
  );
};
