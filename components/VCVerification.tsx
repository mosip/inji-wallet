import testIDProps from '../shared/commonUtil';
import {getTextColor} from './VC/common/VCUtils';
import VerifiedIcon from './VerifiedIcon';
import {Row, Text} from './ui';
import {Theme} from './ui/styleUtils';
import React from 'react';
import {useTranslation} from 'react-i18next';
import PendingIcon from './PendingIcon';

export const VCVerification: React.FC = ({wellknown, vcMetadata}: any) => {
  const {t} = useTranslation('VcDetails');
  const statusText = vcMetadata.isVerified
    ? vcMetadata.isExpired
      ? t('expired')
      : t('valid')
    : t('pending');

  const statusIcon = vcMetadata.isVerified ? (
    vcMetadata.isExpired ? (
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
          color={getTextColor(wellknown, Theme.Colors.Details)}
          style={Theme.Styles.verificationStatus}>
          {statusText}
        </Text>
      </React.Fragment>
    </Row>
  );
};
