import testIDProps from '../shared/commonUtil';
import {Display} from './VC/common/VCUtils';
import VerifiedIcon from './VerifiedIcon';
import {Row, Text} from './ui';
import {Theme} from './ui/styleUtils';
import React from 'react';
import {useTranslation} from 'react-i18next';
import PendingIcon from './PendingIcon';
import {VCMetadata} from '../shared/VCMetadata';

export const VCVerification: React.FC = ({
  display,
  isVerified,
  isExpired,
}: any) => {
  const {t} = useTranslation('VcDetails');
  const statusText = isVerified
    ? isExpired
      ? t('expired')
      : t('valid')
    : t('pending');

  const statusIcon = isVerified ? (
    isExpired ? (
      <PendingIcon />
    ) : (
      <VerifiedIcon />
    )
  ) : (
    <PendingIcon />
  );
  return (
    <Row
      {...testIDProps('verified')}
      style={{
        alignItems: 'center',
      }}>
      <React.Fragment>
        {statusIcon}
        <Text
          testID="verificationStatus"
          color={display.getTextColor(Theme.Colors.Details)}
          style={Theme.Styles.verificationStatus}>
          {statusText}
        </Text>
      </React.Fragment>
    </Row>
  );
};

export interface VCVerificationProps {
  isVerified: boolean;
  display: Display;
}
