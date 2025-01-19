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
