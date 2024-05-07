package inji.utils;

public class TestDataReader {
    public static String readData(String key) {
        return getValueForKey(key);
    }

    //ToDo - Need to remove this once path issue is fixed on device farm
    private static String getValueForKey(String key) {
        switch (key) {
            case "externalemail":
                return "Resident_AddIdentity_ValidParam_smoke_Pos@mosip.net";
            case "emailsForBackupAndRestore":
                return UinGenerationUtil.getRandomEmails("Emails.json");
            case "passcode":
                return "111111";
            case "otp":
                return "111111";
            case "invalidOtp":
                return "666666";
            case "newuin":
                return "8671546927";
            case "revokevid":
                return "6205860394830280";
            case "vid":
                return UinGenerationUtil.getRandomVid();
            case "newaid":
                return "10001112180007620240217011225";
            case "invalidaid":
                return "10004101950000920240314061837";
            case "invalidpasscode":
                return "123456";
            case "invaliduin":
                return "1234567891";
            case "fullName":
                return "TEST_FULLNAMEeng";
            case "idType":
                return "National ID";
            case "gender":
                return "MLEeng";
            case "genderVidEsignet":
                return "MLE";
            case "status":
                return "Valid";
            case "phoneNumber":
                return "9876543210";
            case "generatedOn":
                return "13/12/2023";
            case "dateOfBirth":
                return "01/01/1996";
            case "dateOfBirthForVidEsignet":
                return "1996/01/01";
            case "aid":
                return UinGenerationUtil.getRandomAidData();
            case "emailPassword":
                return "Hello@98";
            case "denyEmailPassword":
                return "Hello@988";
            case "denyEmailId":
                return UinGenerationUtil.getRandomEmails("EmailsDenyPermission.json");
            case "noBackupMail":
                return UinGenerationUtil.getRandomEmails("NoBackupEmails.json");
            case "setExcludedGroups":
                return "AVT,PVT";
            case "uin":
                return UinGenerationUtil.getRandomUin();
            case "uin2":
                return "5945769861";
            case "uin2FullName":
                return "TEST_FULLNAMEeng";
            case "newEnv":
                return "https://api.qa-upgrade-f1.mosip.net";
            case "injiEnv":
                return "https://api.qa-inji1.mosip.net";
            case "invalidenv":
                return "https://api.dev3.mosip";
            case "fullNameSunbird":
                return "Aswin";
            case "policyNameSunbird":
                return "Talapathy Rasigar Mandram";
            case "policyNumberSunbird":
                return "1234567890";
            case "idTypeSunbird":
                return "Insurance Card";
            case "phoneNumberSunbird":
                return "8220255752";
            case "dateOfBirthSunbird":
                return "01/01/2024";
            case "genderValueSunbird":
                return "Female";
            case "emailIdValueSunbird":
                return "santhosdss14@gmail.com";
            case "statusValueSunbird":
                return "Valid";
            case "isDeviceFarmRun":
                return "true";
            default:
                return "Key not found";
        }
    }
}
