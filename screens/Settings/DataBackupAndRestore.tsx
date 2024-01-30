import React from 'react';
import {useTranslation} from 'react-i18next';
import {Pressable} from 'react-native';
import {Icon, ListItem} from 'react-native-elements';
import {Row, Text} from '../../components/ui';
import {Error} from '../../components/ui/Error';
import {Loader} from '../../components/ui/Loader';
import {Modal} from '../../components/ui/Modal';
import {Theme} from '../../components/ui/styleUtils';
import {SvgImage} from '../../components/ui/svg';
import {AccountSelectionConfirmation} from '../backupAndRestore/AccountSelectionConfirmation';
import {useBackupAndRestore} from '../backupAndRestore/BackupAndRestoreController';
import BackupAndRestoreScreen from '../backupAndRestore/BackupAndRestoreScreen';
import testIDProps from '../../shared/commonUtil';

export const DataBackupAndRestore: React.FC = ({} = () => {
  const controller = useBackupAndRestore();
  const {t} = useTranslation('DataBackupScreen');

  return (
    <React.Fragment>
      <Pressable onPress={controller.BACKUP_AND_RESTORE}>
        <ListItem topDivider bottomDivider>
          {SvgImage.DataBackupIcon(25, 25)}
          <ListItem.Content>
            <ListItem.Title style={{paddingTop: 3}}>
              <Row>
                <Text
                  testID="dataBackupAndRestore"
                  weight="semibold"
                  color={Theme.Colors.settingsLabel}
                  style={{paddingRight: 10}}>
                  {t('dataBackupAndRestore')}
                </Text>
                <Text
                  testID="newLabel"
                  style={Theme.BackupStyles.newStyles}
                  color={Theme.Colors.whiteText}>
                  {t('new')}
                </Text>
              </Row>
            </ListItem.Title>
          </ListItem.Content>
          <Icon
            name="chevron-right"
            size={21}
            {...testIDProps('rightArrowIcon')}
            color={Theme.Colors.chevronRightColor}
            style={{marginRight: 15}}
          />
        </ListItem>
      </Pressable>

      {controller.isSigningInFailed && (
        <Error
          isModal
          alignActionsOnEnd
          showClose={false}
          isVisible={controller.isSigningInFailed}
          title={t('errors.permissionDenied.title')}
          message={t('errors.permissionDenied.message')}
          helpText={t('errors.permissionDenied.helpText')}
          image={SvgImage.PermissionDenied()}
          goBack={controller.GO_BACK}
          goBackButtonVisible
          tryAgain={controller.TRY_AGAIN}
          tryAgainButtonTranslationKey="configureSettings"
          testID="CloudBackupConsentDenied"
        />
      )}

      {controller.isNetworkOff && (
        <Error
          testID={`networkOffError`}
          isVisible={controller.isNetworkOff}
          isModal={true}
          showClose
          title={t('errors.noInternetConnection.title')}
          message={t('errors.noInternetConnection.message')}
          onDismiss={controller.DISMISS}
          tryAgain={controller.TRY_AGAIN}
          image={SvgImage.NoInternetConnection()}
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
        <Modal isVisible showClose={false}>
          <Loader title={t('loadingSubtitle')}></Loader>
        </Modal>
      )}

      {controller.showAccountSelectionConfirmation && (
        <AccountSelectionConfirmation
          isVisible={controller.showAccountSelectionConfirmation}
          onProceed={controller.PROCEED_ACCOUNT_SELECTION}
          goBack={controller.GO_BACK}
        />
      )}
    </React.Fragment>
  );
});
