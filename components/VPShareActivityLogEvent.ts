import {formatDistanceToNow} from 'date-fns';
import {ActivityLog} from './ActivityLogEvent';
import * as DateFnsLocale from 'date-fns/locale';
import {VCItemContainerFlowType, VCShareFlowType} from '../shared/Utils';

export type VPActivityLogType =
  | '' // replacement for undefined
  | 'SHARED_SUCCESSFULLY'
  | 'SHARED_WITH_FACE_VERIFIACTION'
  | 'VERIFIER_AUTHENTICATION_FAILED'
  | 'INVALID_AUTH_REQUEST'
  | 'USER_DECLINED_CONSENT'
  | 'SHARED_AFTER_RETRY'
  | 'SHARED_WITH_FACE_VERIFICATION_AFTER_RETRY';

export class VPShareActivityLog implements ActivityLog {
  timestamp: number;
  type: VPActivityLogType;
  flow: string;

  constructor({
    type = '' as VPActivityLogType,
    timestamp = Date.now(),
    flow = VCItemContainerFlowType.VP_SHARE,
  }) {
    this.type = type;
    this.timestamp = timestamp;
    this.flow = flow;
  }

  getActionText(t: any) {
    return `${t(this.type)}`;
  }

  static getLogFromObject(data: Object): VPShareActivityLog {
    return new VPShareActivityLog(data);
  }

  getActionLabel(language: string) {
    return [
      formatDistanceToNow(this.timestamp, {
        addSuffix: true,
        locale: DateFnsLocale[language],
      }),
    ]
      .filter(label => label?.trim() !== '')
      .join(' · ');
  }
}
