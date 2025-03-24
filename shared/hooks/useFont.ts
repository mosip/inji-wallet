import * as Font from 'expo-font';
import {useState, useEffect} from 'react';

export function useFont() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'Inter Regular': require('../../assets/fonts/Inter Regular.ttf'),
          // 'Inter SemiBold',
          // 'Inter Bold',
          // 'Inter Medium',
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(false);
      }
    };

    loadFonts();
  }, []);

  return true;
}
