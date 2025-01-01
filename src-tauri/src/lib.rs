mod mod_commands;
mod mod_display;
mod mod_image;
mod mod_macospermissions;
mod mod_pickerloop;
mod mod_screenshot;

use tauri::{
    menu::{Menu, PredefinedMenuItem, Submenu},
    // tray::TrayIconBuilder,
    Manager,
};
use tauri_nspanel::WebviewWindowExt;

#[allow(non_upper_case_globals)]
const NSWindowStyleMaskNonActivatingPanel: i32 = 1 << 7;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let loop_state =
        std::sync::Arc::new(tokio::sync::Mutex::new(mod_pickerloop::LoopState::default()));

    tauri::Builder::default()
        .manage(loop_state)
        .menu(|handle| {
            Menu::with_items(
                handle,
                &[
                    &Submenu::with_items(
                        handle,
                        "File",
                        true,
                        &[&PredefinedMenuItem::quit(handle, None)?],
                    )?,
                    &Submenu::with_items(
                        handle,
                        "Window",
                        true,
                        &[&PredefinedMenuItem::minimize(handle, None)?],
                    )?,
                ],
            )
        })
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_nspanel::init())
        .invoke_handler(tauri::generate_handler![
            mod_commands::start_picker_loop,
            mod_commands::stop_picker_loop,
            mod_commands::check_macos_screen_recording_permission,
            mod_commands::request_macos_screen_recording_permission,
            mod_commands::open_macos_screen_recording_settings,
        ])
        .setup(|app| {
            #[cfg(target_os = "macos")]
            let picker_window = app.get_webview_window("picker").unwrap();
            let picker_panel = picker_window.to_panel().unwrap();
            picker_panel.set_level(cocoa::appkit::NSMainMenuWindowLevel + 1);
            picker_panel.set_style_mask(NSWindowStyleMaskNonActivatingPanel);
            picker_panel.set_collection_behaviour(
                cocoa::appkit::NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
                    | cocoa::appkit::NSWindowCollectionBehavior::NSWindowCollectionBehaviorStationary
                    | cocoa::appkit::NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
            );

            //     let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            //     let menu = Menu::with_items(app, &[&quit_i])?;
            //     TrayIconBuilder::new()
            //         .icon(app.default_window_icon().unwrap().clone())
            //         .menu(&menu)
            //         .menu_on_left_click(true)
            //         .on_menu_event(|app, event| match event.id.as_ref() {
            //             "quit" => {
            //                 app.exit(0);
            //             }
            //             _ => {
            //                 println!("menu item {:?} not handled", event.id);
            //             }
            //         })
            //         .build(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
