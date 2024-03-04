import {setTextColor} from './VC/common/VCItemField';
import VerifiedIcon from './VerifiedIcon';
import {Row, Text} from './ui';
import {Theme} from './ui/styleUtils';
import React from 'react';
import {useTranslation} from 'react-i18next';

export const VCVerification: React.FC = ({wellknown}: any) => {
  const {t} = useTranslation('VcDetails');
  return (
    <Row
      style={{
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 9,
      }}>
      <VerifiedIcon />
      <Text
        testID="valid"
        numLines={1}
        color={Theme.Colors.Details}
        weight="semibold"
        size="smaller"
        style={[Theme.Styles.detailsValue, setTextColor(wellknown)]}>
        {t('valid')}
      </Text>
    </Row>
  );
};
