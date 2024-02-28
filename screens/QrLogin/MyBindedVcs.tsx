import React from 'react';
import {Button, Centered, Column, Text} from '../../components/ui';
import {Theme} from '../../components/ui/styleUtils';
import {useTranslation} from 'react-i18next';
import {useQrLogin} from './QrLoginController';
import {QrLoginRef} from '../../machines/QrLoginMachine';
import {Icon} from 'react-native-elements';
import {Modal} from '../../components/ui/Modal';
import {VcItemContainer} from '../../components/VC/VcItemContainer';
import {
  VCItemContainerFlowType,
  getVCsOrderedByPinStatus,
} from '../../shared/Utils';

export const MyBindedVcs: React.FC<MyBindedVcsProps> = props => {
  const controller = useQrLogin(props);
  const {t} = useTranslation('QrLogin');
  const shareableVcsMetadataOrderedByPinStatus = getVCsOrderedByPinStatus(
    controller.shareableVcsMetadata,
  );

  return (
    <Modal
      isVisible={controller.isShowingVcList}
      arrowLeft={true}
      headerTitle={t('selectId')}
      headerElevation={5}
      onDismiss={() => {
        controller.DISMISS();
      }}>
      <React.Fragment>
        <Column fill style={{display: props.isVisible ? 'flex' : 'none'}}>
          <Column fill>
            {controller.shareableVcsMetadata.length > 0 && (
              <>
                <Column
                  fill
                  backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
                  <Column padding="16 0" scroll>
                    <Column pX={14}>
                      {shareableVcsMetadataOrderedByPinStatus.length > 0 &&
                        shareableVcsMetadataOrderedByPinStatus.map(
                          (vcMetadata, index) => (
                            <VcItemContainer
                              key={vcMetadata.getVcKey()}
                              vcMetadata={vcMetadata}
                              margin="0 2 8 2"
                              onPress={controller.SELECT_VC_ITEM(index)}
                              flow={VCItemContainerFlowType.QR_LOGIN}
                              selectable
                              selected={index === controller.selectedIndex}
                              isPinned={vcMetadata.isPinned}
                            />
                          ),
                        )}
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
            {controller.shareableVcsMetadata.length === 0 && (
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
