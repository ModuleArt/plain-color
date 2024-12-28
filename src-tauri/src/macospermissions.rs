use objc::runtime::{Class, Object};
use objc::{msg_send, sel, sel_impl};

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

        // Step 2: Get the shared workspace
        let workspace: *mut Object = msg_send![ns_workspace_class, sharedWorkspace];
        assert!(!workspace.is_null(), "sharedWorkspace returned null");

        // Step 3: Construct the URL
        let ns_url_class = Class::get("NSURL").expect("NSURL class not found");
        let url_string =
            "x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenRecording";
        let ns_url: *mut Object = msg_send![ns_url_class, URLWithString: url_string];
        assert!(!ns_url.is_null(), "NSURL creation failed");

        // Step 4: Open the URL with NSWorkspace
        let success: bool = msg_send![workspace, openURL: ns_url];
        assert!(success, "Failed to open System Preferences URL");
    }
}
