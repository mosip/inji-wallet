TAG=$(git describe --abbrev=0 --tags --exact-match HEAD 2>/dev/null)
if [[ -z "$TAG" ]]; then
  echo "No  found for the current commit. Please provide a Tag to proceed with Build"
  exit
else
  echo "Tag for the current commit: $TAG"
fi