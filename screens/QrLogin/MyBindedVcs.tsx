import React from 'react';
import { Button, Column, Text, Centered } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useTranslation } from 'react-i18next';
import { VcItem } from '../../components/VcItem';
import { useQrLogin } from './QrLoginController';
import { QrLoginRef } from '../../machines/QrLoginMachine';
import { Icon } from 'react-native-elements';
import { Modal } from '../../components/ui/Modal';

export const MyBindedVcs: React.FC<MyBindedVcsProps> = (props) => {
  const controller = useQrLogin(props);
  const { t } = useTranslation('QrScreen');

  return (
    <Modal
      isVisible={controller.isShowingVcList}
      arrowLeft={<Icon name={''} />}
      headerTitle={t('selectId')}
      headerElevation={5}
      onDismiss={() => {
        controller.DISMISS();
      }}>
      <React.Fragment>
        <Column fill style={{ display: props.isVisible ? 'flex' : 'none' }}>
          <Column fill>
            {controller.vcKeys.length > 0 && (
              <>
                <Column
                  fill
                  backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
                  <Column padding="16 0" scroll>
                    <Column pX={14}>
                      {controller.vcKeys.length > 0 &&
                        controller.vcKeys.map((vcKey, index) => (
                          <VcItem
                            key={vcKey}
                            vcKey={vcKey}
                            margin="0 2 8 2"
                            onPress={controller.SELECT_VC_ITEM(index)}
                            showOnlyBindedVc
                            selectable
                            selected={index === controller.selectedIndex}
                          />
                        ))}
                    </Column>
                  </Column>
                </Column>
                <Column
                  align="flex-end"
                  style={{
                    borderTopRightRadius: 27,
                    borderTopLeftRadius: 27,
                  }}
                  padding="16 24"
                  margin="2 0 0 0"
                  elevation={2}>
                  <Button
                    title={t('verify')}
                    styles={Theme.ButtonStyles.radius}
                    disabled={controller.selectedIndex == null}
                    onPress={controller.VERIFY}
                  />
                </Column>
              </>
            )}
            {controller.vcKeys.length === 0 && (
              <React.Fragment>
                <Centered fill>
                  <Text weight="semibold" margin="0 0 8 0">
                    {t('noBindedVc')}
                  </Text>
                </Centered>
                <Button
                  title={t('back')}
                  margin="0 20 12 20"
                  styles={Theme.ButtonStyles.radius}
                  onPress={controller.DISMISS}
                />
              </React.Fragment>
            )}
          </Column>
        </Column>
      </React.Fragment>
    </Modal>
  );
};

interface MyBindedVcsProps {
  isVisible: boolean;
  service: QrLoginRef;
}
