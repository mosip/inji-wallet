package io.mosip.residentapp;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import io.mosip.tuvali.common.events.*;

import java.lang.reflect.Field;
import java.util.Map;
import java.util.HashMap;

public class RNEventMapper {

    public static WritableMap toMap(Event event) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("type", getEventType(event));
        populateProperties(event, writableMap);
        return writableMap;
    }

    private static String getEventType(Event event) {   
        if (event instanceof DataReceivedEvent) {
            return "onDataReceived";
        } else if (event instanceof ErrorEvent) {
            return "onError";
        } else if (event instanceof VerificationStatusEvent) {
            return "onVerificationStatusReceived";
        } else if (event instanceof ConnectedEvent) {
            return "onConnected";
        } else if (event instanceof DataSentEvent) {
            return "onDataSent";
        } else if (event instanceof DisconnectedEvent) {
            return "onDisconnected";
        } else if (event instanceof SecureChannelEstablishedEvent) {
            return "onSecureChannelEstablished";
        } else {
            System.out.println("Invalid event type");
            return "";
        }
    }

    private static void populateProperties(Event event, WritableMap writableMap) {
        for (Field field : event.getClass().getDeclaredFields()) {  
            try {
                field.setAccessible(true);
                populateProperty(field, event, writableMap);
                field.setAccessible(false);
            } catch (Exception e) {
                System.out.println("Unable to populate RN event " + field.getName());
            }    
        }
    }

    private static void populateProperty(Field field, Event event, WritableMap writableMap) throws IllegalAccessException {
        Object propertyValue = field.get(event);
        if (propertyValue instanceof Enum) {
            propertyValue = readEnumValue((Enum<?>) propertyValue);
        }
        if (propertyValue instanceof Integer) {
            writableMap.putInt(field.getName(), (Integer) propertyValue);
        } else {
            writableMap.putString(field.getName(), propertyValue.toString());
        }
    }

    private static Object readEnumValue(Enum<?> enumValue) {
        try {
            Field valueField = enumValue.getClass().getDeclaredField("value");
            valueField.setAccessible(true);
            return valueField.get(enumValue);
        } catch (Exception e) {
            return enumValue.ordinal();
        }
    }
}
