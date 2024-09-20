import React, { useState } from "react"
import { Pressable } from "react-native"
import { ListItem, Icon } from "react-native-elements"
import { t } from "xstate"
import { Row } from "../../components/ui"
import testIDProps from "../../shared/commonUtil"
import { Theme } from "../../components/ui/styleUtils"
import { Text } from "../../components/ui"
import { KeyManagementScreen } from "./KeyManagementScreen"

export const SettingskeyManagementScreen: React.FC<SettingskeyManagementScreenProps> = (props) => {
    const [pressed, setPressed] = useState(false)
    return <React.Fragment>
        <Pressable
            accessible={false}
            {...testIDProps('keyManagement')}
            onPress={() => {
                console.log("pressed")
                props.controller.SET_KEY_MANAGEMENT_EXPLORED()
                setPressed(true)
            }}>
            <ListItem topDivider bottomDivider>
                <Icon name="vpn-key" color={Theme.Colors.Icon} />
                <ListItem.Content>
                    <ListItem.Title
                        accessible={false}
                        {...testIDProps('keyManagementText')}>
                        <Row>
                            <Text
                                testID="keyManagementText"
                                weight="semibold"
                                color={Theme.Colors.settingsLabel}
                                style={Theme.KeyManagementScreenStyle.textStyle}>
                                {t('keyManagement')}
                            </Text>
                            {!props.isExplored && (
                                <Text
                                    testID="newLabel"
                                    style={Theme.Styles.newLabel}
                                    color={Theme.Colors.whiteText}>
                                    {t('NEW')}
                                </Text>
                            )}
                        </Row>
                    </ListItem.Title>
                </ListItem.Content>
                <Icon
                    name="chevron-right"
                    size={21}
                    {...testIDProps('keyManagementChevronRight')}
                    color={Theme.Colors.chevronRightColor}
                    style={Theme.KeyManagementScreenStyle.iconStyle}
                />
            </ListItem>
        </Pressable>
        <KeyManagementScreen controller={props.controller} isVisible={pressed} isClosed={() => {
            props.controller.SET_KEY_MANAGEMENT_TOUR_GUIDE_EXPLORED()
            setPressed(false)
        }} onBackPress={undefined} />
    </React.Fragment>
}

export interface SettingskeyManagementScreenProps {
    isExplored: boolean
    controller: any
}
