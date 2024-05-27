#!/bin/bash

file_name="Inji-bridging-header.h"

file_content="#ifndef Inji_bridging_header_h
#define Inji_bridging_header_h
#import \"React/RCTBridgeModule.h\"

#endif
"

echo "$file_content" > "$file_name"

project_dir=$(pwd)

echo "Updating build settings"

sed -i '' '/PROVISIONING_PROFILE_SPECIFIER = "";/{a\
\     SWIFT_OBJC_BRIDGING_HEADER = "Inji_bridging-header.h";
}' "$project_dir/ios/Inji.xcodeproj/project.pbxproj"

sed -i '' '/PROVISIONING_PROFILE_SPECIFIER = "";/{a\
\     SWIFT_OBJC_BRIDGING_HEADER = "Inji_bridging-header.h";
}' "$project_dir/ios/Inji.xcodeproj/project.pbxproj"

echo "Build settings updated successfully!"