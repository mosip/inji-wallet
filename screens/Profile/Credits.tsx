import React, { useEffect, useState } from 'react';
import { Asset } from 'expo-asset';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Divider, Icon, ListItem, Overlay } from 'react-native-elements';
import Markdown from 'react-native-simple-markdown'
import { Button, Text, Column, Row } from '../../components/ui';
import { Colors } from '../../components/ui/styleUtils';
const mdFile = require('../../Credits.md')

export const Credits: React.FC<CreditsProps> = (props) => {
  const [isViewing, setIsViewing] = useState(false);
  const [content, setContent] = useState("");

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
      padding: 20
    }
  });

  const markdownStyles = {
    heading1: {
      fontSize: 24,
    }
  }

  const fetchLocalFile = async () => {
    let file = Asset.fromModule(mdFile)
    file = await fetch(file.uri)
    file = await file.text()
    setContent(file);
  }

  useEffect(() => {
    (async () => {
      await fetchLocalFile();
    })();
  }, [])

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
            <Text size="small">Credits and legal notices</Text>
          </Row>
          <Divider />
          <View style={styles.markdownView}>
            <Markdown children={content} />
          </View>
        </View>

      </Overlay>
    </ListItem>
  );
};

interface CreditsProps {
  label: string;
}
