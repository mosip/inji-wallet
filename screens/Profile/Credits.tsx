import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Divider, Icon, ListItem, Overlay } from 'react-native-elements';
import Markdown from 'react-native-simple-markdown'
import { Button, Text, Column, Row } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';

export const Credits: React.FC<CreditsProps> = (props) => {
  const [isViewing, setIsViewing] = useState(false);

  const styles = StyleSheet.create({
    buttonContainer: {
      position: 'absolute',
      left: 0,
      right: 'auto'
    },
    view: {
      flex: 1,
      width: Dimensions.get('screen').width
    },
    markdownView: {
      padding: 8
    }
  });

  const markdownStyles = {
    heading1: {
      fontSize: 24,
    }
  }

  return (
    <ListItem bottomDivider onPress={() => setIsViewing(true)}>
      <ListItem.Content>
        <ListItem.Title>
          <Text>{props.label}</Text>
        </ListItem.Title>
      </ListItem.Content>
      <Overlay
        overlayStyle={{ padding: 24 }}
        isVisible={isViewing}
        onBackdropPress={() => setIsViewing(false)}>
        <View style={styles.view}>
          <Row align="center" crossAlign="center" margin="0 0 10 0">
            <View style={styles.buttonContainer}>
              <Button type="clear" icon={<Icon name="chevron-left" color={Colors.Orange} />} title="Back" onPress={() => setIsViewing(false)}/>
            </View>
            <Text>Credits</Text>
          </Row>
          <Divider />
          <View styles={styles.markdownView}>
            <Markdown styles={markdownStyles}>
              #Legal Notices! {'\n\n'}
              #Legal Notices! {'\n\n'}
              #Legal Notices! {'\n\n'}
            </Markdown>
          </View>
        </View>

      </Overlay>
    </ListItem>
  );
};

interface CreditsProps {
  label: string;
}
