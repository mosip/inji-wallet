import React, { useEffect, useState } from 'react';
import i18n, { SUPPORTED_KEY_TYPES } from '../i18n';
import { useTranslation } from 'react-i18next';
import { Button, Column, Row } from '../components/ui';
import { Theme } from '../components/ui/styleUtils';
import { Icon, ListItem } from 'react-native-elements';
import { RootRouteProps } from '../routes';
import { useWelcomeScreen } from './WelcomeScreenController';
import { BackHandler, Dimensions, NativeModules, TouchableOpacity, View } from 'react-native';
import { useBackupRestoreScreen } from './Settings/BackupRestoreController';
import DragList from 'react-native-draglist'
import { Text } from '../components/ui';


export const SetupKeySelectionScreen: React.FC<RootRouteProps> = props => {
    const{RNSecureKeystoreModule}=NativeModules
    const { t } = useTranslation('SetupKey');
    const controller = useWelcomeScreen(props);
    const backupRestoreController = useBackupRestoreScreen();
    const keys = Object.entries(SUPPORTED_KEY_TYPES).map(
        ([label, value]) => ({ label, value }),
    );
    console.log(keys)
    const [keyOrder, setKeyOrder] = useState(keys);

    const renderItem = ({ item, onDragStart, onDragEnd}) => {
        console.log(item.label);
        return (
            <TouchableOpacity
                onLongPress={onDragStart}
                onPressOut={onDragEnd}>
                <ListItem bottomDivider topDivider>
                    <ListItem.Title style={Theme.KeyManagementScreenStyle.listItemTitle}>
                        <Text weight='regular'>{item.label}</Text>
                    </ListItem.Title>
                    <ListItem.Content />
                    <Icon name='drag-handle' color={Theme.Colors.GrayIcon} />
                </ListItem>
            </TouchableOpacity>
        );
    };

    const handleReorder = (fromIndex, toIndex) => {
        const newData = [...keyOrder];
        const item = newData.splice(fromIndex, 1)[0];
        newData.splice(toIndex, 0, item);
        setKeyOrder(newData);
    };

    const convertToKeyValue = (items) => {
        const result = {};
        items.forEach((item, index) => {
          result[index] = item.value;
        });
        return result;
      };      

    useEffect(() => {
        backupRestoreController.DOWNLOAD_UNSYNCED_BACKUP_FILES();
    }, []);

    useEffect(() => {
        const backAction = () => {
            BackHandler.exitApp();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    return (
        <Column style={Theme.SetupLanguageScreenStyle.columnStyle}>
            <Icon
                name="vpn-key"
                type="outline"
                color={Theme.Colors.Icon}
                size={80}
            />
            <Column crossAlign="center" width={Dimensions.get('window').width * 0.8}>
                <Text
                    testID="chooseLanguage"
                    style={Theme.KeyManagementScreenStyle.listItemTitle}
                    margin="10 0 10 0"
                    weight="semibold">
                    {t('header')}
                </Text>
                <Text
                    weight="semibold"
                    style={Theme.KeyManagementScreenStyle.listItemTitle}
                    align="center"
                    color={Theme.Colors.GrayText}>
                    {t('description')}
                </Text>
            </Column>
            <View style={Theme.KeyManagementScreenStyle.dragViewStyle}  >
                <DragList
                    scrollEnabled={false}
                    data={keyOrder}
                    renderItem={renderItem}
                    keyExtractor={item => item.value}
                    onReordered={handleReorder}
                />
            </View>
            <Column><Button
                testID="saveKeyPreferenceSetup"
                type="gradient"
                title={t('save')}
                onPress={async () => {
                    const keyOrderMap=convertToKeyValue(keyOrder)
                    await RNSecureKeystoreModule.storeData("keyPreference",JSON.stringify(keyOrderMap));
                    controller.SELECT('IntroSliders'), controller.unlockPage;
                }}
            />
            <Button
                testID="skipKeySelection"
                type="clear"
                title={t('skip')}
                onPress={async() =>{
                    const keyOrderMap=convertToKeyValue(keyOrder)
                    await RNSecureKeystoreModule.storeData("keyPreference",JSON.stringify(keyOrderMap));
                    controller.SELECT('IntroSliders'), controller.unlockPage;
                }}
            /></Column>
        </Column>
    );


};
