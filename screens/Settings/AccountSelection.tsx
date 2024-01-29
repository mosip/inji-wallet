import React from 'react';
import {GestureResponderEvent, View} from 'react-native';
import {MessageOverlay} from '../../components/MessageOverlay';
import {Button, Column, Row, Text} from '../../components/ui';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
import {useBackupScreen} from './BackupController';
import {useTranslation} from 'react-i18next';

//TODO: Make this component adaptable to all screen size
export const AccountSelection: React.FC<AccountSelectionProps> = props => {
  const controller = useBackupScreen(props);
  const {t} = useTranslation('AccountSelection');

  return (
    <React.Fragment>
      {/* //TODO: Remove modal and make it screen as per mockup */}
      <Modal isVisible={props.isVisible} showClose={false}>
        <Column style={{flex: 1, justifyContent: 'space-around'}}>
          <View style={{alignItems: 'center', paddingTop: 30}}>
            {SvgImage.DataBackupIcon(80, 100)}
          </View>

          <Column>
            <Text
              size="large"
              style={Theme.BackupAndRestoreStyles.backupProcessInfo}>
              {t('backupProcessInfo')}
            </Text>
            <Text
              size="regular"
              color={Theme.Colors.GrayText}
              style={Theme.BackupAndRestoreStyles.cloudInfo}>
              {t('cloudInfo')}
            </Text>
          </Column>

          <Row style={{paddingHorizontal: 120, paddingBottom: 50}}>
            <View>{SvgImage.GoogleDriveIcon(45, 45)}</View>
            <Text style={Theme.BackupAndRestoreStyles.cloudLabel}>
              {t('googleDriveTitle')}
            </Text>
          </Row>

          <Column>
            <Button
              type="gradient"
              title={t('proceed')}
              onPress={props.onProceed}
              margin={[0, 0, 0, 0]}
            />
            <Button type="clear" title={t('goBack')} onPress={props.goBack} />
          </Column>
        </Column>
      </Modal>
    </React.Fragment>
  );
};

interface AccountSelectionProps {
  goBack: (event: GestureResponderEvent) => void;
  isVisible: boolean;
  onProceed: () => void;
}
