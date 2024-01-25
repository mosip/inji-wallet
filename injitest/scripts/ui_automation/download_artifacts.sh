#!/bin/bash -e

RUN_ARN=$1
PLATFORM=$2
ARTIFACT_DIRECTORY=""

get_directory_name() {
    local platform=$1

    case "$platform" in
        "Android") echo "android_artifacts" ;;
        "IOS") echo "ios_artifacts" ;;
        *) return 1 ;;
    esac
}

wait_for_run_completion() {
    local run_arn=$1

    while true; do
        run_status=$(aws devicefarm get-run --arn "$run_arn" --query 'run.status' --output text)
        if [ "$run_status" == "COMPLETED" ]; then
            echo "Run completed..."
            sleep 120 # wait for 2 minutes to process the artifacts
            break
        fi
        echo "Waiting for the run to complete..."
        sleep 180 # wait for 3 minutes before checking again
    done
}

download_customer_artifacts() {
    local run_arn=$1

    ARTIFACT_DIRECTORY=$(get_directory_name "$PLATFORM")
    mkdir -p "artifacts/$ARTIFACT_DIRECTORY"

    response=$(aws devicefarm list-artifacts --arn "arn:aws:devicefarm:us-west-2:931337674770:run:b356580b-c561-4fd2-bfdf-8993aebafc5a/36910efb-e008-49f7-ac59-5eb8a22dd293" --type FILE --query 'artifacts[?name==`Customer Artifacts`].[url]' --output json)
        url=$(echo "$response" | jq -r '.[0][0]')
        echo "Downloading customer artifact from $url"
        cd "artifacts/$ARTIFACT_DIRECTORY"
        curl -O "$url"
        echo "Artifacts downloaded successfully"
}

download_videos() {
    local run_arn=$1

    aws devicefarm list-artifacts --arn "$run_arn" --type VIDEO --query 'artifacts[].[url, name]' --output text | while read -r url name; do
        echo "Downloading video $name from $url"
        curl -o "artifacts/$ARTIFACT_DIRECTORY/$name" "$url"
    done
}

# Wait for run completion
wait_for_run_completion "$RUN_ARN"

# Download customer artifacts after run completion
download_customer_artifacts "$RUN_ARN"

# Download videos after run completion
#download_videos "$RUN_ARN"