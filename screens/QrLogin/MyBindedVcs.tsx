import React from 'react';
import { Button, Column, Text, Centered } from '../../components/ui';
import { Theme } from '../../components/ui/styleUtils';
import { useTranslation } from 'react-i18next';
import { VcItem } from '../../components/VcItem';
import { useQrLogin } from './QrLoginController';
import { QrLoginRef } from '../../machines/QrLoginMachine';

export const MyBindedVcs: React.FC<MyBindedVcsProps> = (props) => {
  const controller = useQrLogin(props);
  const { t } = useTranslation('QrScreen');

  return (
    <React.Fragment>
      <Column fill style={{ display: props.isVisible ? 'flex' : 'none' }}>
        <Column fill pY={32} pX={24}>
          {controller.vcKeys.length > 0 && (
            <React.Fragment>
              <Column
                fill
                backgroundColor={Theme.Colors.lightGreyBackgroundColor}>
                <Column padding="16 0" scroll>
                  <Column>
                    {controller.vcKeys.length > 0 &&
                      controller.vcKeys.map((vcKey, index) => (
                        <VcItem
                          key={vcKey}
                          vcKey={vcKey}
                          margin="0 2 8 2"
                          onPress={controller.SELECT_VC_ITEM(index)}
                          selectable
                          selected={index === controller.selectedIndex}
                        />
                      ))}
                  </Column>
                </Column>
                <Column
                  backgroundColor={Theme.Colors.whiteBackgroundColor}
                  padding="16 24"
                  margin="2 0 0 0"
                  elevation={2}>
                  <Button
                    title={t('verify')}
                    margin="12 0 12 0"
                    disabled={controller.selectedIndex == null}
                    onPress={controller.VERIFY}
                  />
                </Column>
              </Column>
            </React.Fragment>
          )}
          {controller.vcKeys.length === 0 && (
            <React.Fragment>
              <Centered fill>
                <Text weight="semibold" margin="0 0 8 0">
                  {t('noBindedVc', { vcLabel: controller.vcLabel.plural })}
                </Text>
              </Centered>
              <Button
                type="solid"
                title={t('back')}
                onPress={controller.DISMISS}
              />
            </React.Fragment>
          )}
        </Column>
      </Column>
    </React.Fragment>
  );
};

interface MyBindedVcsProps {
  isVisible: boolean;
  service: QrLoginRef;
}
