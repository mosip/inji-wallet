package inji.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import inji.driver.TestRunner;

import java.io.File;
import java.io.IOException;

public class TestDataReader {
    public static String readData(String key) {
        return getValueForKey(key);
    }

    private static String getValueForKey(String key) {
        switch (key) {
            case "externalemail":
                return "Resident_AddIdentity_ValidParam_smoke_Pos@mosip.net";
            case "passcode":
                return "111111";
            case "otp":
                return "111111";
            case "invalidOtp":
                return "666666";
            case "newuin":
                return "7059849273";
            case "revokevid":
                return "6205860394830280";
            case "newaid":
                return "10001100400008120231110021527";
            case "invalidpasscode":
                return "123456";
            case "invaliduin":
                return "1234567891";
            case "fullName":
                return "TEST_FULLNAMEeng";
            case "idType":
                return "National Card";
            case "gender":
                return "MLEeng";
            case "status":
                return "Valid";
            case "phoneNumber":
                return "9876543210";
            case "generatedOn":
                return "9/5/2023";
            case "dateOfBirth":
                return "01/01/1996";
            case "aid":
                return "10001100660000620230714065538";
            case "setExcludedGroups":
                return "AVT,PVT";
            case "uin":
                return "6920386351";
            case "uin2":
                return "5740943928";
            case "uin2FullName":
                return "fbgfhgfhghd";
            case "newEnv":
                return "https://api.qa-trinity.mosip.net";
            case "injiEnv":
                return "https://api.qa-inji.mosip.net";
            case "invalidenv":
                return "https://api.dev3.mosip";
            case "isDeviceFarmRun":
                return "false";
            default:
                return "Key not found";
        }
    }
}
