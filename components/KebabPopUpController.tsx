import { useInterpret, useSelector } from '@xstate/react';
import { useContext, useRef, useState } from 'react';
import { createVcItemMachine, VcItemEvents } from '../machines/vcItem';
import { GlobalContext } from '../shared/GlobalContext';

export function useKebabPopUp(props) {
  const { appService } = useContext(GlobalContext);
  const machine = useRef(
    createVcItemMachine(
      appService.getSnapshot().context.serviceRefs,
      props.vcKey
    )
  );
  const service = useInterpret(machine.current, { devTools: __DEV__ });
  const PIN_CARD = () => service.send(VcItemEvents.ADD_WALLET_BINDING_ID());
  const [visible, setVisible] = useState(false);

  return {
    visible,
    TOGGLE_KEBAB_POPUP: () => setVisible(!visible),
    PIN_CARD,
  };
}
