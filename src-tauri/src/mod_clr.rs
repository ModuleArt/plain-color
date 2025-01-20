use std::process::Command;

pub fn load_clr_file_with_script() -> String {
    // JXA script as a raw string literal
    let jxa_script = r#"
        var app;
        var clrFilePath;
        var colorList = {};
        var jsonFilePath;
        var nsColorList;
        var nsStringColorList;
        var paletteName;

        function c2h(colorValue) {
            return ('0' + Math.round(colorValue * 255).toString(16)).slice(-2);
        }

        function a2h(alphaValue) {
            var result = c2h(alphaValue);
            return result === 'ff' ? '' : result;
        }

        ObjC.import('AppKit');
        app = Application.currentApplication();
        app.includeStandardAdditions = true;
        clrFilePath = app.chooseFile({ withPrompt: 'Import palette from Apple Color List (.clr) file', ofType: ['clr'] }).toString();
        paletteName = clrFilePath.slice(clrFilePath.lastIndexOf('/') + 1);
        paletteName = paletteName.slice(0, paletteName.lastIndexOf('.'));

        nsColorList = $.NSColorList.alloc.initWithNameFromFile(paletteName, clrFilePath);
        nsColorList.allKeys.js.forEach(function _getColor(colorName) {
            var nsColor;
            var colorValue;

            nsColor = nsColorList.colorWithKey(colorName);
            if (nsColor.colorSpaceName.js === 'NSCalibratedWhiteColorSpace') {
                colorValue = ['#', c2h(nsColor.whiteComponent), c2h(nsColor.whiteComponent), c2h(nsColor.whiteComponent), a2h(nsColor.alphaComponent)].filter(Boolean).join('');
            } else {
                colorValue = ['#', c2h(nsColor.redComponent), c2h(nsColor.greenComponent), c2h(nsColor.blueComponent), a2h(nsColor.alphaComponent)].filter(Boolean).join('');
            }
            colorList[colorName.js] = colorValue;
        });

        JSON.stringify({ paletteName, colorList }, null, 2)
    "#;

    // Run the JXA script using osascript with the `-l JavaScript` flag
    let output = Command::new("osascript")
        .arg("-l")
        .arg("JavaScript")
        .arg("-e")
        .arg(jxa_script)
        .output();

    // Capture the output
    if let Ok(output) = output {
        if output.status.success() {
            let json_output = String::from_utf8_lossy(&output.stdout);
            return json_output.to_string(); // Return the JSON string
        } else {
            return format!(
                "Error executing JXA script: {}",
                String::from_utf8_lossy(&output.stderr)
            );
        }
    } else {
        return "Failed to execute osascript".to_string(); // Return error message as string
    }
}

pub fn save_clr_file_with_script(json: String) -> String {
    // JXA script as a raw string literal
    let jxa_script = r#"
        function run(argv) {
            var jsonString = argv[0]; // Get JSON string from argument
            var app, clrFilePath, colorCnt = 0, json, colorList, nsColorList, paletteName;

            function hex2rgba(color) {
                function ch(pos) {
                    return parseInt(color.slice(pos, pos + 2), 16) / 255;
                }

                if (color.indexOf('#') === 0) {
                    color = color.slice(1);
                }
                switch (color.length) {
                    case 3:
                    case 4:
                        color = color.split('').reduce(function (p, c) {
                            return p + c + c;
                        }, '');
                    case 6:
                    case 8:
                        color += 'ff';
                        return { r: ch(0), g: ch(2), b: ch(4), a: ch(6) };
                    default:
                        return { r: 0, g: 0, b: 0, a: 0 };
                }
            }

            ObjC.import('AppKit');
            app = Application.currentApplication();
            app.includeStandardAdditions = true;

            // Parse JSON string
            json = JSON.parse(jsonString);
            colorList = json.colorList;
            paletteName = json.paletteName;

            // Create NSColorList
            nsColorList = $.NSColorList.alloc.initWithName(paletteName);
            Object.keys(colorList).forEach(function (name) {
                var color = hex2rgba(colorList[name]);
                var nsColor = $.NSColor.colorWithCalibratedRedGreenBlueAlpha(color.r, color.g, color.b, color.a);
                nsColorList.insertColorKeyAtIndex(nsColor, name, colorCnt);
                ++colorCnt;
            });

            // Prompt user to save the .clr file
            clrFilePath = app.chooseFileName({
                withPrompt: "Select Apple Color List (.clr) file destination",
                defaultName: paletteName + ".clr"
            }).toString();

            nsColorList.writeToFile(clrFilePath);
            return clrFilePath; // Return the saved file path
        }
    "#;

    // Run the JXA script using osascript with the `-l JavaScript` flag
    let output = Command::new("osascript")
        .arg("-l")
        .arg("JavaScript")
        .arg("-e")
        .arg(jxa_script)
        .arg(json) // Pass JSON string as argument
        .output();

    // Capture the output
    if let Ok(output) = output {
        if output.status.success() {
            let saved_file_path = String::from_utf8_lossy(&output.stdout);
            return saved_file_path.to_string(); // Return the saved .clr file path
        } else {
            return format!(
                "Error executing JXA script: {}",
                String::from_utf8_lossy(&output.stderr)
            );
        }
    } else {
        return "Failed to execute osascript".to_string(); // Return error message as string
    }
}
