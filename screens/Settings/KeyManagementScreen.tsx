import React, { useState, useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { NativeModules, TouchableOpacity, BackHandler, Dimensions, View } from "react-native";
import DragList from "react-native-draglist";
import { ListItem, Icon } from "react-native-elements";
import { Column, Row } from "../../components/ui";
import { Text } from "../../components/ui";
import { Theme } from "../../components/ui/styleUtils";
import { Button } from "../../components/ui";
import { Modal } from "../../components/ui/Modal";
import { HelpScreen } from "../../components/HelpScreen";
import { SvgImage } from "../../components/ui/svg";
import { BannerNotificationContainer } from "../../components/BannerNotificationContainer";
import { Copilot } from "../../components/ui/Copilot";
import { useCopilot } from "react-native-copilot";



export const KeyManagementScreen: React.FC<KeyManagementScreenProps> = props => {
    const { RNSecureKeystoreModule } = NativeModules
    const { t } = useTranslation('SetupKey');
    const [isVisible, setIsVisible] = useState(props.isVisible)
    const { start } = useCopilot()

    useEffect(() => {
        const fetchSupportedKeyTypes = async () => {
            try {
                const result = JSON.parse((await RNSecureKeystoreModule.getData("keyPreference"))[1])
                const keys = Object.entries(result).map(
                    ([label, value]) => ({ label, value }),
                );
                setKeyOrder(keys);
            } catch (error) {
                console.error("Error fetching supported key types:", error);
            }
        };
        fetchSupportedKeyTypes();
    }, []);

    const [keyOrder, setKeyOrder] = useState([{ label: "", value: "" }]);

    useEffect(() => {
        setIsVisible(props.isVisible);
    }, [props.isVisible]);

    const renderItem = ({ item, onDragStart, onDragEnd }) => {

        return (
            <TouchableOpacity
                onLongPress={onDragStart}
                onPressOut={onDragEnd}>
                <ListItem bottomDivider topDivider>
                    <ListItem.Title style={Theme.KeyManagementScreenStyle.listItemTitle}>
                        <Text weight='regular'>{item.value}</Text>
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
    console.warn(props.controller.isKeyManagementTourGuideExplored)
    return (
        
        <Modal
            isVisible={isVisible}
            headerTitle={t('Key Management')}
            testID="keyManagementSettingsModal"
            headerElevation={2}
            arrowLeft={true}
            onDismiss={props.isClosed}
            onShow={() => !props.controller.isKeyManagementTourGuideExplored ? start(t('copilot:keyManagementTitle')) : null}
            headerRight={
                <HelpScreen
                    source={'keyManagement'}
                    triggerComponent={
                        <View testID="help" style={Theme.HelpScreenStyle.viewStyle}>
                            <Row crossAlign="center" style={Theme.HelpScreenStyle.rowStyle}>
                                <View testID="helpIcon" style={Theme.HelpScreenStyle.iconStyle}>
                                    {SvgImage.coloredInfo()}
                                </View>
                                <Text
                                    testID="helpText"
                                    style={Theme.HelpScreenStyle.labelStyle}>
                                    {t('help')}
                                </Text>
                            </Row>
                        </View>
                    }
                />
            }>
            <BannerNotificationContainer />
            <Column style={Theme.KeyManagementScreenStyle.columnStyle}>
                <Copilot
                    title={t('copilot:keyManagementTitle')}
                    description={t('copilot:keyManagementDesc')}
                    order={7}
                    children={
                        <View style={Theme.KeyManagementScreenStyle.dragViewStyleSettingsScreen}>
                            <DragList
                                scrollEnabled={false}
                                data={keyOrder}
                                renderItem={renderItem}
                                keyExtractor={item => item.value}
                                onReordered={handleReorder} />
                        </View>
                    }
                />

                <Button
                    testID="saveKeyOrderingPreference"
                    type="gradient"
                    title={t('save')}
                    onPress={async () => {
                        const keyOrderMap = convertToKeyValue(keyOrder)
                        try {
                            props.controller.SET_KEY_MANAGEMENT_TOUR_GUIDE_EXPLORED()
                            await RNSecureKeystoreModule.storeData("keyPreference", JSON.stringify(keyOrderMap));   
                            props.controller.SET_KEY_ORDER_SUCCESS()
                        }
                        catch (e) {
                            props.controller.SET_KEY_ORDER_ERROR()
                        }
                    }}
                />
            </Column>

        </Modal>

    );
};

interface KeyManagementScreenProps {
    onBackPress: ReactNode;
    isVisible: boolean;
    isClosed: () => void;
    controller: any
}
