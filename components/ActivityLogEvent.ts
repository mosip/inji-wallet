import {getIdType} from './VC/common/VCUtils';

export type ActivityLogType =
  | '' // replacement for undefined
  | 'VC_SHARED'
  | 'VC_RECEIVED'
  | 'VC_RECEIVED_NOT_SAVED'
  | 'VC_DELETED'
  | 'VC_DOWNLOADED'
  | 'VC_SHARED_WITH_VERIFICATION_CONSENT'
  | 'VC_RECEIVED_WITH_PRESENCE_VERIFIED'
  | 'VC_RECEIVED_BUT_PRESENCE_VERIFICATION_FAILED'
  | 'PRESENCE_VERIFIED_AND_VC_SHARED'
  | 'PRESENCE_VERIFICATION_FAILED'
  | 'QRLOGIN_SUCCESFULL'
  | 'WALLET_BINDING_SUCCESSFULL'
  | 'WALLET_BINDING_FAILURE'
  | 'VC_REMOVED'
  | 'TAMPERED_VC_REMOVED';

export class ActivityLog {
  id: string;
  credentialConfigurationId: string;
  _vcKey: string;
  timestamp: number;
  deviceName: string;
  type: ActivityLogType;
  issuer: string;

  constructor({
    id = '',
    idType = [],
    _vcKey = '',
    type = '',
    timestamp = Date.now(),
    deviceName = '',
    issuer = '',
  } = {}) {
    this.id = id;
    this.idType = idType;
    this._vcKey = _vcKey;
    this.type = type;
    this.timestamp = timestamp;
    this.deviceName = deviceName;
    this.issuer = issuer;
  }

  static logTamperedVCs() {
    return {
      _vcKey: '',
      type: 'TAMPERED_VC_REMOVED',
      timestamp: Date.now(),
      deviceName: '',
      vcLabel: '',
      issuer: '',
      id: '',
      credentialConfigurationId: '',
    };
  }
}

export function getActionText(activity: ActivityLog, t, wellknown: Object) {
  if (!!activity.credentialConfigurationId) {
    const cardType = getIdType(wellknown, activity.credentialConfigurationId);
    return `${t(activity.type, {idType: cardType, id: activity.id})}`;
  }
  return `${t(activity.type, {idType: '', id: activity.id})}`;
}
