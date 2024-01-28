import React from 'react';
import {View} from 'react-native';
import {Text} from '../ui/Text';

export const Timestamp: React.FC<TimestampProps> = props => {
  function formattedDate(): React.ReactNode {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const date = new Date(props.time);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;

    return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${period}`;
  }

  return (
    <View>
      <Text
        size="regular"
        style={{
          fontFamily: 'Inter_500Medium',
          fontWeight: '600',
          fontSize: 14,
          letterSpacing: 0,
          lineHeight: 17,
        }}>
        {formattedDate()}
      </Text>
    </View>
  );
};

interface TimestampProps {
  time: Date;
}
