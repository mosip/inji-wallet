import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Image} from 'react-native';
import {Overlay} from 'react-native-elements';
import {Button, Column, Text, Row} from '../../../components/ui';
import {Theme} from '../../../components/ui/styleUtils';
import {SvgImage} from '../../../components/ui/svg';

export const RemoveVcWarningOverlay: React.FC<
  RemoveVcWarningOverlayProps
> = props => {
  const {t} = useTranslation('RemoveVcWarningOverlay');

  return (
    <Overlay
      isVisible={props.isVisible}
      overlayStyle={Theme.BindingVcWarningOverlay.overlay}>
      <Column
        align="space-between"
        crossAlign="center"
        padding={'10'}
        width={Dimensions.get('screen').width * 0.8}
        height={Dimensions.get('screen').height * 0}>
        <Row align="center" crossAlign="center" margin={'0 80 -10 0'}>
          {SvgImage.WarningLogo()}
          <Text
            margin={'0 0 0 -80'}
            color={Theme.Colors.whiteText}
            weight="bold">
            !
          </Text>
        </Row>

        <Column crossAlign="center" margin="0 0 30 0">
          <Text testID="alert" weight="semibold">
            {t('alert')}
          </Text>

          <Text
            testID="warningMsg"
            align="center"
            size="small"
            weight="semibold"
            color={Theme.Colors.GrayText}>
            {t('removeWarning')}
          </Text>
        </Column>

        <Button
          testID="yesConfirm"
          margin={'30 0 0 0'}
          type="gradient"
          title={t('confirm')}
          onPress={props.onConfirm}
        />

        <Button
          testID="no"
          margin={'10 0 0 0'}
          type="clear"
          title={t('no')}
          onPress={props.onCancel}
        />
      </Column>
    </Overlay>
  );
};

interface RemoveVcWarningOverlayProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
