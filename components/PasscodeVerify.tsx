import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PinInput } from './PinInput';

export const MAX_PIN = 6;

export const PasscodeVerify: React.FC<PasscodeVerifyProps> = (props) => {
  const { t } = useTranslation('PasscodeVerify');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isVerified) {
      props.onSuccess();
    }
  }, [isVerified]);

  return <PinInput length={MAX_PIN} onDone={verify} />;

  function verify(value: string) {
    if (props.passcode === value) {
      setIsVerified(true);
    } else {
      props.onError(t('passcodeMismatchError'));
    }
  }
};

interface PasscodeVerifyProps {
  passcode: string;
  onSuccess: () => void;
  onError?: (error: string) => void;
}
