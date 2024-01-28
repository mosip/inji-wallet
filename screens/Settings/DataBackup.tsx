import React from 'react';
import {Pressable} from 'react-native';
import {ListItem} from 'react-native-elements';
import {Row, Text} from '../../components/ui';
import {Error} from '../../components/ui/Error';
import {Loader} from '../../components/ui/Loader';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
import {AccountSelection} from './AccountSelection';
import {useBackupAndRestore} from './BackupAndRestoreController';
import BackupAndRestoreScreen from './BackupAndRestoreScreen';

export const DataBackup: React.FC = ({} = () => {
  const controller = useBackupAndRestore();

  return (
    <React.Fragment>
      <Pressable onPress={controller.BACKUP_AND_RESTORE}>
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

      {controller.isSigningInFailed && (
        // TODO: make Error UI to match mockup
        <Error
          isModal
          isVisible={controller.isSigningInFailed}
          title="Permission Denied!"
          message="We noticed that you've cancelled the creation of data backup settings. We strongly recommend revisiting the data backup settings to ensure your data availability. Click “Configure Settings” to set up data backup now, or “Cancel” to go back to settings screen."
          image={SvgImage.NoInternetConnection()}
          goBack={controller.GO_BACK}
          goBackButtonVisible
          tryAgain={controller.TRY_AGAIN}
          tryAgainButtonTranslationKey="configureSettings"
          testID="CloudBackupConsentDenied"
        />
      )}

      {(controller.isSigningIn || controller.isSigningInSuccessful) && (
        <BackupAndRestoreScreen
          profileInfo={controller.profileInfo}
          onBackPress={controller.GO_BACK}
          isLoading={controller.isSigningIn}
        />
      )}
      {controller.isLoading && (
        <Modal isVisible>
          <Loader title={'Loading setting up'} subTitle="Loading..."></Loader>
        </Modal>
      )}

      {controller.showAccountSelectionConfirmation && (
        <AccountSelection
          isVisible={controller.showAccountSelectionConfirmation}
          onProceed={controller.PROCEED_ACCOUNT_SELECTION}
          goBack={controller.GO_BACK}
        />
      )}
    </React.Fragment>
  );
});
