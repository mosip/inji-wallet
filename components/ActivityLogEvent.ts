enum ActivityLogType {
  TAMPERED_VC_REMOVED = 'TAMPERED_VC_REMOVED',
}

export class ActivityLog {
  _vcKey: string;
  timestamp: number;
  deviceName: string;
  vcLabel: string;
  type: ActivityLogType | string;

  constructor({
    _vcKey = '',
    type = '',
    timestamp = Date.now(),
    deviceName = '',
    vcLabel = '',
  } = {}) {
    this._vcKey = _vcKey;
    this.type = type;
    this.timestamp = timestamp;
    this.deviceName = deviceName;
    this.vcLabel = vcLabel;
  }

  static logTamperedVCs() {
    return {
      _vcKey: '',
      type: ActivityLogType.TAMPERED_VC_REMOVED,
      timestamp: Date.now(),
      deviceName: '',
      vcLabel: '',
    };
  }
}

export function getActionText(activity: ActivityLog, t) {
  return activity.vcLabel
    ? `${activity.vcLabel} ${t(activity.type)}`
    : `${t(activity.type)}`;
}
