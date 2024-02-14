import VerifiedIcon from './VerifiedIcon';
import {Row, Text} from './ui';
import {Theme} from './ui/styleUtils';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {setTextColor} from './VC/common/VCUtils';

export const VCVerification: React.FC = ({wellknown, isVerified}: any) => {
  const {t} = useTranslation('VcDetails');
  return (
    <Row
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      {isVerified && (
        <React.Fragment>
          <VerifiedIcon />
          <Text
            testID="verificationStatus"
            color={Theme.Colors.Details}
            style={[
              Theme.Styles.detailsValue,
              setTextColor(wellknown),
              {fontFamily: 'Inter_600SemiBold'},
            ]}>
            {t('valid')}
          </Text>
        </React.Fragment>
      )}
    </Row>
  );
};
