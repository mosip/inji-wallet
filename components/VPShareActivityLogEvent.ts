export type VPActivityLogType =
  | '' // replacement for undefined
  | 'SHARED_SUCCESSFULLY'
  | 'SHARED_WITH_FACE_VERIFIACTION'
  | 'VERIFIER_AUTHENTICATION_FAILED'
  | 'INVALID_AUTH_REQUEST'
  | 'USER_DECLINED_CONSENT'
  | 'SHARED_AFTER_RETRY'
  | 'SHARED_WITH_FACE_VERIFICATION_AFTER_RETRY';

export class VPShareActivityLog {
  timestamp: number;
  type: VPActivityLogType;

  constructor({type = '' as VPActivityLogType, timestamp = Date.now()}) {
    this.type = type;
    this.timestamp = timestamp;
  }

  getActionText(t) {
    return `${t(this.type)}`;
  }
}
