#!/bin/sh

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

    aws devicefarm list-artifacts --arn "$run_arn" --type CUSTOMER_ARTIFACT --query 'artifacts[].[url, name]' --output text | while read -r url name; do
        echo "Downloading customer artifact $name from $url"
        curl -o "artifacts/$ARTIFACT_DIRECTORY/$name" "$url"
    done
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
download_videos "$RUN_ARN"