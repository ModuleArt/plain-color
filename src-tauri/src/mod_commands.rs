use crate::mod_clr;
use crate::mod_globalvars;
use crate::mod_macospermissions;
use crate::mod_pickerloop;

use std::str::FromStr;
use std::sync::Arc;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
pub fn start_picker_loop(
    app: tauri::AppHandle,
    state: tauri::State<'_, Arc<tokio::sync::Mutex<mod_pickerloop::LoopState>>>,
) {
    mod_pickerloop::start_picker_loop(app, state);
}

#[tauri::command]
pub fn stop_picker_loop(
    app: tauri::AppHandle,
    state: tauri::State<'_, Arc<tokio::sync::Mutex<mod_pickerloop::LoopState>>>,
) {
    mod_pickerloop::stop_picker_loop(app, state);
}

#[tauri::command]
pub fn set_picker_preview_size(
    _app: tauri::AppHandle,
    _state: tauri::State<'_, Arc<tokio::sync::Mutex<mod_pickerloop::LoopState>>>,
    size: u32,
) {
    mod_globalvars::set_preview_size(size);
}

#[tauri::command]
pub fn set_picker_color_profile(
    _app: tauri::AppHandle,
    _state: tauri::State<'_, Arc<tokio::sync::Mutex<mod_pickerloop::LoopState>>>,
    profile: String,
) {
    mod_globalvars::set_screen_color_profile(
        mod_globalvars::ScreenColorProfile::from_str(&profile).unwrap(),
    );
}

#[tauri::command]
pub fn check_macos_screen_recording_permission() -> bool {
    return mod_macospermissions::check_macos_screen_recording_permission();
}

#[tauri::command]
pub fn request_macos_screen_recording_permission() -> bool {
    return mod_macospermissions::request_macos_screen_recording_permission();
}

#[tauri::command]
pub fn open_macos_screen_recording_settings() {
    return mod_macospermissions::open_macos_screen_recording_settings();
}

#[tauri::command]
pub fn load_clr_file() -> String {
    return mod_clr::load_clr_file_with_script();
}
