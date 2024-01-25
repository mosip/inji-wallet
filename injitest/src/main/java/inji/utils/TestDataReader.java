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

    //ToDo - Need to remove this once path issue is fixed on device farm
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
                return "2176493605";
            case "revokevid":
                return "6205860394830280";
            case "vid":
                return "8349769368792139";
            case "newaid":
                return "10007100470009820240117074603";
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
                return "13/12/2023";
            case "dateOfBirth":
                return "01/01/1996";
            case "aid":
                return "10001100050003220231220202338";
            case "setExcludedGroups":
                return "AVT,PVT";
            case "uin":
                return "9685190798";
            case "uin2":
                return "2073912798";
            case "uin2FullName":
                return "TEST_FULLNAMEeng";
            case "newEnv":
                return "https://api.dev.mosip.net";
            case "injiEnv":
                return "https://api.qa-inji1.mosip.net";
            case "invalidenv":
                return "https://api.dev3.mosip";
            case "isDeviceFarmRun":
                return "true";
            default:
                return "Key not found";
        }
    }
}
