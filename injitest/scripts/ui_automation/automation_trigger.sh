#!/bin/bash -e

# Get input parameters
PLATFORM=$1
RUN_NAME=$2
TEST_TYPE=$3

# Constants
PROJECT_ARN="arn:aws:devicefarm:us-west-2:931337674770:project:b356580b-c561-4fd2-bfdf-8993aebafc5a"
TEST_PACKAGE_FILE_TYPE="APPIUM_JAVA_TESTNG_TEST_PACKAGE"

# Variables to be set later
APP_UPLOAD_ARN=""
DEVICE_POOL_ARN=""
TEST_PACKAGE_ARN=""

# Function to set paths and configurations based on platform
configure_platform() {
    local platform=$1
    local project_path=$(pwd)

    # Set default values
    DEVICE_POOL_NAME=""
    APP_NAME=""
    APP_TYPE=""
    TEST_PACKAGE_NAME=""
    TEST_SPEC_ARN=""
    TEST_PACKAGE_PATH=""
    APP_PATH=""

    # Get the absolute package path
    cd "$project_path/target"
    local package_path=$(pwd)
    TEST_PACKAGE_PATH="$package_path/zip-with-dependencies.zip"
    cd "$project_path"

    # Configure based on platform
    if [ "$platform" = "Android" ]; then

        # Android configuration
        DEVICE_POOL_NAME="ANDROID DEVICE POOL"
        APP_NAME="Inji_universal.apk"
        APP_TYPE="ANDROID_APP"
        TEST_PACKAGE_NAME="Android-Test"
        TEST_SPEC_ARN="arn:aws:devicefarm:us-west-2::upload:100e31e8-12ac-11e9-ab14-d663b5a4a910"

        cd "$project_path/../android/app/build/outputs/apk/residentapp/release"
        local app_path=$(pwd)
        APP_PATH="$app_path/Inji_universal.apk"
        cd "$project_path"
    else

        # iOS configuration
        DEVICE_POOL_NAME="IOS DEVICE POOL"
        APP_NAME="Inji.ipa"
        APP_TYPE="IOS_APP"
        TEST_PACKAGE_NAME="IOS-Test"
        TEST_SPEC_ARN="arn:aws:devicefarm:us-west-2::upload:100e31e8-12ac-11e9-ab14-d663bd873c82"

        cd "$project_path/../ios"
        local app_path=$(pwd)
        APP_PATH="$app_path/Inji.ipa"
        cd "$project_path"
    fi
}

# Update XML based on platform
update_xml_configuration() {

    #Go to file path
    cd ../../src/main/resources
    
    #Update the testng file
    if [ "$PLATFORM" = 'Android' ]; then
        if [ "$TEST_TYPE" = 'sanity' ]; then
            cat androidSanity.txt > testng.xml
        else
            cat androidRegression.txt > testng.xml
        fi
    elif [ "$PLATFORM" = 'IOS' ]; then
        if [ "$TEST_TYPE" = 'sanity' ]; then
            cat iosSanity.txt > testng.xml
        else
            cat iosRegression.txt > testng.xml
        fi
    fi

    #Move back to original path
    cd ../../../
}

#upload artifacts to device farm
upload_to_device_farm() {
    local project_arn=$1
    local file_path=$2
    local file_name=$3
    local file_type=$4

    #Get upload URL Link
    response=$(aws devicefarm create-upload --project-arn "$project_arn" --name "$file_name" --type "$file_type" --query 'upload.{url: url, arn: arn}' --output json)
    upload_url=$(echo "$response" | jq -r '.url')

    #Upload the file to the link
    curl -T $file_path "$upload_url"

    #Return the upload arn
    echo "$response" | jq -r '.arn'
}

#trigger the run
start_run_on_device_farm() {
    local project_arn=$1
    local app_arn=$2
    local device_pool_arn=$3
    local test_package_arn=$4
    local test_spec_arn=$5
    local run_name=$6

    #Start the run
    run_arn=$(aws devicefarm schedule-run --project-arn "$project_arn" --app-arn "$app_arn" --device-pool-arn "$device_pool_arn" --name "$run_name" --test testSpecArn=$test_spec_arn,type=APPIUM_JAVA_TESTNG,testPackageArn="$test_package_arn" --query run.arn --output text)

    #Return the run arn
    echo "$run_arn"
}

# #rewrite the xml file
update_xml_configuration

# # #build the test jar
mvn clean package -DskipTests=true

# Configure defaults based on platform
configure_platform "$PLATFORM"

#upload the jar and apk
TEST_PACKAGE_ARN=$(upload_to_device_farm $PROJECT_ARN $TEST_PACKAGE_PATH $TEST_PACKAGE_NAME $TEST_PACKAGE_FILE_TYPE)
echo "Test arn is ------ $TEST_PACKAGE_ARN"

#upload the app file
APP_UPLOAD_ARN=$(upload_to_device_farm $PROJECT_ARN $APP_PATH $APP_NAME $APP_TYPE)
echo "App arn is ------ $APP_UPLOAD_ARN"

#list device pools and filter by name
DEVICE_POOL_ARN=$(aws devicefarm list-device-pools --arn $PROJECT_ARN --query "devicePools[?name=='$DEVICE_POOL_NAME'].arn" --output text)
echo "Device pool arn is ------ $DEVICE_POOL_ARN"

# Wait for app upload to complete to start the run
sleep 100

#Start the run
RUN_ARN=$(start_run_on_device_farm $PROJECT_ARN $APP_UPLOAD_ARN $DEVICE_POOL_ARN $TEST_PACKAGE_ARN $TEST_SPEC_ARN $RUN_NAME)
echo "Run ARN is ------- $RUN_ARN"
echo "Run Started Successfully!"

echo "RUN ARN IS ---> $RUN_ARN"