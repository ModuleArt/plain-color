mod mod_clr;
mod mod_coloradjustments;
mod mod_commands;
mod mod_display;
mod mod_globalvars;
mod mod_image;
mod mod_macospermissions;
mod mod_pickerloop;
mod mod_screenshot;

use tauri::{
    generate_context, generate_handler,
    menu::{Menu, MenuItem, PredefinedMenuItem, Submenu},
    DragDropEvent, Emitter, Manager, WindowEvent,
};

#[allow(non_upper_case_globals)]
const NSWindowStyleMaskNonActivatingPanel: i32 = 1 << 7;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    mod_globalvars::initialize_global_vars();

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
                        &[
                            &MenuItem::with_id(
                                handle,
                                "about-item",
                                "About PlainColor",
                                true,
                                Some("CommandOrControl+Shift+,"),
                            )
                            .unwrap(),
                            &PredefinedMenuItem::separator(handle)?,
                            &MenuItem::with_id(
                                handle,
                                "settings-item",
                                "Settings",
                                true,
                                Some("CommandOrControl+,"),
                            )
                            .unwrap(),
                            &PredefinedMenuItem::separator(handle)?,
                            &PredefinedMenuItem::quit(handle, None)?,
                        ],
                    )?,
                    &Submenu::with_items(
                        handle,
                        "Edit",
                        true,
                        &[
                            &PredefinedMenuItem::undo(handle, None)?,
                            &PredefinedMenuItem::redo(handle, None)?,
                            &PredefinedMenuItem::separator(handle)?,
                            &PredefinedMenuItem::cut(handle, None)?,
                            &PredefinedMenuItem::copy(handle, None)?,
                            &PredefinedMenuItem::paste(handle, None)?,
                            &PredefinedMenuItem::select_all(handle, None)?,
                        ],
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
        .on_menu_event(|app, event| match event.id.as_ref() {
            "about-item" => app
                .get_webview_window("main")
                .expect("no main window")
                .emit("open_about_page", ())
                .unwrap(),
            "settings-item" => app
                .get_webview_window("main")
                .expect("no main window")
                .emit("open_settings_page", ())
                .unwrap(),
            _ => {}
        })
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_nspanel::init())
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }))
        .plugin(tauri_plugin_deep_link::init())
        .invoke_handler(generate_handler![
            mod_commands::start_picker_loop,
            mod_commands::stop_picker_loop,
            mod_commands::set_picker_preview_size,
            mod_commands::set_picker_color_profile,
            mod_commands::check_macos_screen_recording_permission,
            mod_commands::request_macos_screen_recording_permission,
            mod_commands::open_macos_screen_recording_settings,
            mod_commands::load_clr_file,
            mod_commands::save_clr_file,
        ])
        .setup(|app| {
            #[cfg(target_os = "macos")]
            {
                use cocoa::appkit::{NSMainMenuWindowLevel, NSWindowCollectionBehavior};
                use tauri_nspanel::WebviewWindowExt;

                let picker_window = app.get_webview_window("picker").unwrap();
                let picker_panel = picker_window.to_panel().unwrap();
                picker_panel.set_level(NSMainMenuWindowLevel + 1);
                picker_panel.set_style_mask(NSWindowStyleMaskNonActivatingPanel);
                picker_panel.set_collection_behaviour(
                    NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
                        | NSWindowCollectionBehavior::NSWindowCollectionBehaviorStationary
                        | NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
                );
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::DragDrop(drag_drop_event) = event {
                match drag_drop_event {
                    DragDropEvent::Drop { paths, .. } => {
                        if let Some(files) = Some(
                            paths
                                .into_iter()
                                .map(|path| path.to_string_lossy().to_string())
                                .collect::<Vec<String>>(),
                        ) {
                            window.emit("trigger_deep_link", files).unwrap();
                        }
                    }
                    _ => {}
                }
            }
        })
        .run(generate_context!())
        .expect("error while running tauri application")
}
