import React from 'react';
import {Overlay} from 'react-native-elements';
import {Column, Text, Button} from '../../components/ui';
import {useTranslation} from 'react-i18next';
import {Dimensions} from 'react-native';
import {Theme} from '../../components/ui/styleUtils';

export const LocationPermissionRational: React.FC<
  LocationPermissionRationalProps
> = props => {
  const {t} = useTranslation('ScanScreen');
  return (
    <Overlay
      isVisible={true}
      overlayStyle={Theme.BindingVcWarningOverlay.overlay}>
      <Column
        align="space-between"
        crossAlign="center"
        padding={'10'}
        width={Dimensions.get('screen').width * 0.8}
        height={Dimensions.get('screen').height * 0}>
        <Text testID="alert" weight="semibold" margin="15 0 0 0">
          {t('rational.title')}
        </Text>

        <Text
          testID="warningMsg"
          align="center"
          size="small"
          weight="semibold"
          margin="15 0 0 0"
          color={Theme.Colors.GrayText}>
          {t('rational.message')}
        </Text>

        <Button
          testID="yesConfirm"
          margin={'30 0 0 0'}
          type="gradient"
          title={t('rational.accept')}
          onPress={props.onConfirm}
        />

        <Button
          testID="no"
          margin={'10 0 0 0'}
          type="clear"
          title={t('rational.cancel')}
          onPress={props.onCancel}
        />
      </Column>
    </Overlay>
  );
};

interface LocationPermissionRationalProps {
  onConfirm: () => void;
  onCancel: () => void;
}
