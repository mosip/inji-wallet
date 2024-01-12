SONAR_HOST_URL=https://sonarcloud.io
SONAR_PROJECT_KEY=mosip_inji
FILTER=severities="CRITICAL&statuses=OPEN&createdAfter=2024-01-04"

if [[ $1 ]]; then
    BRANCH_NAME=$1
    FILTER=severities="CRITICAL&statuses=OPEN&createdAfter=2024-01-04&branch=${BRANCH_NAME}"
fi

echo "${FILTER}"

# sonar check for critical issues is analyzed only for newly created issues. Once the existing critical issues ( use createdBefore=2024-01-04 search) are resolved, this createdAfter can be removed
response=$(curl -s "${SONAR_HOST_URL}/api/issues/search?componentKeys=${SONAR_PROJECT_KEY}&${FILTER}")
echo "The response is $response"

issues_count=$(echo "$response" | jq '.issues | length')
echo "The number of issues $issues_count"

if [ "$issues_count" -eq 0 ]; then
    echo "No critical issues found."
else
    echo "Critical issues found. Failing the pipeline"
    exit 1
fi
