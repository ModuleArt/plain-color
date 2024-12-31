use objc::runtime::{Class, Object};
use objc::{msg_send, sel, sel_impl};
use std::ffi::CString;
use std::process::Command;

extern "C" {
    fn CGPreflightScreenCaptureAccess() -> bool;
}

pub fn check_macos_screen_recording_permission() -> bool {
    unsafe { CGPreflightScreenCaptureAccess() }
}

pub fn request_macos_screen_recording_permission() {
    unsafe {
        // Step 1: Get NSWorkspace class
        let ns_workspace_class = Class::get("NSWorkspace").expect("NSWorkspace class not found");
        println!("NSWorkspace class found");

        // Step 2: Get sharedWorkspace instance
        let workspace: *mut Object = msg_send![ns_workspace_class, sharedWorkspace];
        if workspace.is_null() {
            eprintln!("sharedWorkspace returned null");
        } else {
            println!("sharedWorkspace instance created");
        }

        // Step 3: Create a CString for the URL
        let url_string = CString::new(
            "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture",
        )
        .expect("CString::new failed");
        println!("CString created: {:?}", url_string);

        // Step 4: Create NSString from CString
        let ns_string_class = Class::get("NSString").expect("NSString class not found");
        let ns_string: *mut Object = msg_send![ns_string_class, alloc];
        let ns_string: *mut Object = msg_send![ns_string, initWithCString: url_string.as_ptr()];

        if ns_string.is_null() {
            eprintln!("NSString creation failed");
        } else {
            println!("NSString instance created");
        }

        // Step 5: Create NSURL from NSString
        let ns_url_class = Class::get("NSURL").expect("NSURL class not found");
        let ns_url: *mut Object = msg_send![ns_url_class, URLWithString: ns_string];
        if ns_url.is_null() {
            eprintln!("NSURL creation failed");
        } else {
            println!("NSURL instance created");
        }

        // Step 6: Open the URL with NSWorkspace
        let success: bool = msg_send![workspace, openURL: ns_url];

        if success {
            println!("Successfully opened System Preferences using URL.");
        } else {
            println!("Failed to open System Preferences using URL. Falling back to AppleScript...");

            // Fallback: AppleScript
            let script = r#"
                tell application "System Preferences"
                    reveal anchor "Privacy_ScreenCapture" of pane id "com.apple.preference.security"
                    activate
                end tell
            "#;

            let _ = Command::new("osascript")
                .arg("-e")
                .arg(script)
                .output()
                .expect("Failed to run AppleScript to open Screen Recording preferences");
        }
    }
}
