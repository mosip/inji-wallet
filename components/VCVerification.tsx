import testIDProps from '../shared/commonUtil';
import {setTextColor} from './VC/common/VCItemField';
import VerifiedIcon from './VerifiedIcon';
import {Row, Text} from './ui';
import {Theme} from './ui/styleUtils';
import React from 'react';
import {useTranslation} from 'react-i18next';
import PendingIcon from './PendingIcon';

export const VCVerification: React.FC = ({wellknown, isVerified}: any) => {
  const {t} = useTranslation('VcDetails');
  const statusText = isVerified ? t('valid') : t('pendingVerification');
  const statusIcon = isVerified ? <VerifiedIcon /> : <PendingIcon />;
  return (
    <Row
      {...testIDProps('verified')}
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <React.Fragment>
        {statusIcon}
        <Text
          testID="verificationStatus"
          color={Theme.Colors.Details}
          style={[
            Theme.Styles.detailsValue,
            setTextColor(wellknown),
            {fontFamily: 'Inter_600SemiBold'},
          ]}>
          {statusText}
        </Text>
      </React.Fragment>
    </Row>
  );
};
