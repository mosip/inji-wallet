import React, {useState} from 'react';
import {Pressable, View} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {Row, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {useBackupScreen} from './BackupController';
import {BackupToggle} from './BackupToggle';
import {SvgImage} from '../../components/ui/svg';
import BackupAndRestoreScreen from './BackupAndRestoreScreen';

export const DataBackup: React.FC = ({} = props => {
  const controller = useBackupScreen(props);
  const [hadBackUpAlreadyDone, setHadBackUpAlreadyDone] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showBackAndRestoreScreen, setShowBackAndRestoreScreen] =
    useState(false);

  // TODO : Check if the setup is already done

  const handleBackupAndRestore = () => {
    if (hadBackUpAlreadyDone) setShowBackAndRestoreScreen(true);
    else setShowConfirmation(true);
  };

  return (
    <React.Fragment>
      <Pressable onPress={handleBackupAndRestore}>
        <ListItem topDivider bottomDivider>
          {SvgImage.DataBackupIcon(25, 25)}
          <ListItem.Content>
            <ListItem.Title style={{paddingTop: 3}}>
              <Row>
                <Text
                  weight="semibold"
                  color={Theme.Colors.settingsLabel}
                  style={{paddingRight: 10}}>
                  Backup & Restore
                </Text>
                <Text
                  style={Theme.BackupStyles.newStyles}
                  color={Theme.Colors.whiteText}>
                  New
                </Text>
              </Row>
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </Pressable>

      {showConfirmation && (
        <BackupToggle
          isVisible={showConfirmation}
          onDismiss={() => controller.DISMISS()}
          onConfirmation={() => setShowBackAndRestoreScreen(true)}
        />
      )}
      {showBackAndRestoreScreen && <BackupAndRestoreScreen />}
    </React.Fragment>
  );
});
