#!/bin/sh

PROJECT_ARN=$1
PLATFORM=$2

update_xml_configuration() {
    if [ "$PLATFORM" == "Android" ]; then
       cat android.txt > testng.xml
    else
       cat ios.txt > testng.xml
    fi
}

upload_to_device_farm() {
    local project_arn=$1
    local file_path=$2
    local file_name=$3
    local file_type=$4

    response=$(aws devicefarm create-upload --project-arn "$project_arn" --name "$file_name" --type "$file_type" --query 'upload.{url: url, arn: arn}' --output json)
    upload_url=$(echo "$response" | jq -r '.url')
    curl -T $file_path "$upload_url"

    echo "$response"
}

start_run_on_device_farm() {
    local project_arn=$1
    local app_arn=$2
    local device_pool_arn=$3
    local test_package_arn=$4

    run_arn=$(aws devicefarm schedule-run --project-arn "$project_arn" --app-arn "$app_arn" --device-pool-arn "$device_pool_arn" --name "Test Run from Script" --test type=APPIUM_JAVA_TESTNG,testPackageArn="$test_package_arn" --query run.arn --output text)
    echo "$run_arn"
}

if [ "$PLATFORM" == "Android" ]; then

    DEVICE_POOL_NAME="MyPool"
    TEST_PACKAGE_PATH="../../injitest/target/zip-with-dependencies.zip"
    TEST_PACKAGE_NAME="MyTest"
    TEST_PACKAGE_FILE_TYPE="APPIUM_JAVA_TESTNG"
    TEST_PACKAGE_ARN=""

    APP_PATH="../../android/app/build/outputs/apk/residentapp/debug/Inji_universal.apk"
    APP_NAME="Inji_universal.apk"
    APP_TYPE="ANDROID_APP"
    APP_ARN=""

elif [ "$PLATFORM" == "IOS" ]; then

    DEVICE_POOL_NAME="AnotherPool"
    TEST_PACKAGE_PATH=".../path/to/another/test-package.zip"
    TEST_PACKAGE_NAME="AnotherTest"
    TEST_PACKAGE_FILE_TYPE="APPIUM_JAVA_TESTNG"
    TEST_PACKAGE_ARN=""

    APP_PATH=".../path/to/another/app.apk"
    APP_NAME="AnotherApp.apk"
    APP_TYPE="ANDROID_APP"
    APP_ARN=""
else
    echo "Invalid input value. Please mention 'Android' or 'IOS'"
    exit 1
fi

#rewrite the xml file
cd ../../
update_xml_configuration

#build the test jar
mvn clean package -DskipTests=true

#upload the jar and apk
jar_response = $(upload_to_device_farm $PROJECT_ARN "$TEST_PACKAGE_PATH" "$TEST_PACKAGE_NAME" "$TEST_PACKAGE_FILE_TYPE")
TEST_PACKAGE_ARN=$(echo "$jar_response" | jq -r '.arn')

#upload the apk file
app_response = $(upload_to_device_farm $PROJECT_ARN "$APP_PATH" "$APP_NAME" "$APP_TYPE")
APP_ARN=$(echo "$app_response" | jq -r '.arn')

#list device pools and filter by name
DEVICE_POOL_ARN=$(aws devicefarm list-device-pools --project-arn $PROJECT_ARN --query "devicePools[?name=='$DEVICE_POOL_NAME'].arn" --output text)

# Start the run
run_arn=$(start_run_on_device_farm "$PROJECT_ARN" "$APP_ARN" "$DEVICE_POOL_ARN" "$TEST_PACKAGE_ARN")

echo "::set-output name=run_arn::$run_arn"