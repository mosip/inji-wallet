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
    const formattedHours = (date.getHours() % 12 || 12)
      .toString()
      .padStart(2, '0');
    const formattedMinutes = date.getMinutes().toString().padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${day} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${period}`;
  }

  return (
    <View>
      <Text
        testID={`${props.testId}Time`}
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
  time: number;
  testId: string;
}
