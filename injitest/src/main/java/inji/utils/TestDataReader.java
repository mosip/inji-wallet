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
            case "fullNameForMobileDrivingLicense":
                return "Joseph";
            case "idType":
                return "MOSIP National ID";
            case "idTypeForMobileDrivingLicense":
                return "Mobile Driving License";
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
            case "dateOfBirthForMobileDrivingLicense":
                return "1994-11-06";
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
                return "2162743612";
            case "MockVc":
                return "1234567";
            case "uin2FullName":
                return "TEST_FULLNAMEeng";
            case "newEnv":
                return "https://api.qa-upgrade-f1.mosip.net";
            case "injiEnv":
                return "https://api.qa-inji1.mosip.net";
            case "invalidenv":
                return "https://api.dev3.mosip";
            case "fullNameSunbird":
                return "PolicyTestAutomation";
            case "policyNameSunbird":
                return "Start Insurance Gold Premium";
            case "policyNumberSunbird":
                return "120-720-24";
            case "idTypeSunbird":
                return "Health Insurance";
            case "idTypeSunbirdHindi":
                return "Health Insurance";
            case "phoneNumberSunbird":
                return "0123456789";
            case "dateOfBirthSunbird":
                return "2024-01-01";
            case "genderValueSunbird":
                return "Male";
            case "emailIdValueSunbird":
                return "abhishek@gmail.com";
            case "statusValueSunbird":
                return "Valid";
            case "statusValueSunbirdForVaild":
                return "Valid";
            case "statusForEsignet":
                return "Valid";
            case "isDeviceFarmRun":
                return "true";
            case "ED25519Key":
                return "ED25519";
            case "ECCK1Key":
                return "ECC K1";
            case "ECCR1Key":
                return "ECC R1";
            case "RSAKey":
                return "RSA";
            default:
                return "Key not found";
        }
    }
}
