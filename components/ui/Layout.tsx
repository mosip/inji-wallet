import React from 'react';
import {
  FlexStyle,
  StyleProp,
  SafeAreaView,
  ViewStyle,
  StyleSheet,
  ScrollView,
  RefreshControlProps,
} from 'react-native';
import { elevation, ElevationLevel, spacing } from './styleUtils';

function createLayout(
  direction: FlexStyle['flexDirection'],
  mainAlign?: FlexStyle['justifyContent'],
  crossAlign?: FlexStyle['alignItems']
) {
  const layoutStyles = StyleSheet.create({
    base: {
      flexDirection: direction,
      justifyContent: mainAlign,
      alignItems: crossAlign,
    },
    fill: {
      flex: 1,
    },
  });

  const Layout: React.FC<LayoutProps> = (props) => {
    const styles: StyleProp<ViewStyle> = [
      layoutStyles.base,
      props.fill ? layoutStyles.fill : null,
      props.padding ? spacing('padding', props.padding) : null,
      props.margin ? spacing('margin', props.margin) : null,
      props.backgroundColor ? { backgroundColor: props.backgroundColor } : null,
      props.width ? { width: props.width } : null,
      props.height ? { height: props.height } : null,
      props.align ? { justifyContent: props.align } : null,
      props.crossAlign ? { alignItems: props.crossAlign } : null,
      props.elevation ? elevation(props.elevation) : null,
      props.style ? props.style : null,
      props.pY ? { paddingVertical: props.pY } : null,
      props.pX ? { paddingHorizontal: props.pX } : null,
    ];

    return props.scroll ? (
      <ScrollView
        contentContainerStyle={styles}
        refreshControl={props.refreshControl}>
        {props.children}
      </ScrollView>
    ) : (
      <SafeAreaView style={styles}>{props.children}</SafeAreaView>
    );
  };

  return Layout;
}

export const Row = createLayout('row');

export const Column = createLayout('column');

export const Centered = createLayout('column', 'center', 'center');

interface LayoutProps {
  fill?: boolean;
  align?: FlexStyle['justifyContent'];
  crossAlign?: FlexStyle['alignItems'];
  padding?: string | number;
  margin?: string;
  backgroundColor?: string;
  width?: number | string;
  height?: number | string;
  elevation?: ElevationLevel;
  scroll?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  style?: StyleProp<ViewStyle>;
  pY?: number | string | undefined;
  pX?: number | string | undefined;
}
