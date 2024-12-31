mod mod_display;
mod mod_image;
mod mod_macospermissions;
mod mod_screenshot;

use cocoa::appkit::{NSMainMenuWindowLevel, NSWindowCollectionBehavior};
use tauri::{
    menu::{Menu, PredefinedMenuItem, Submenu},
    // tray::TrayIconBuilder,
    AppHandle,
    Emitter,
    EventTarget,
    Manager,
    PhysicalPosition,
};
use tauri_nspanel::WebviewWindowExt;

#[allow(non_upper_case_globals)]
const NSWindowStyleMaskNonActivatingPanel: i32 = 1 << 7;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn fetch_preview(app: AppHandle, size: u32) {
    let picker_window_logical_w = 128;
    let picker_window_logical_h = 128;

    // move window to cursor
    let win: tauri::WebviewWindow = app.get_webview_window("picker").unwrap();
    let scale_factor = win.scale_factor().unwrap();

    let p_coords: tauri::PhysicalPosition<f64> = win.cursor_position().unwrap();
    let picker_window_physical_w = picker_window_logical_w as f64 * scale_factor;
    let picker_window_physical_h = picker_window_logical_h as f64 * scale_factor;

    win.set_position(PhysicalPosition::new(
        p_coords.x as f64 - (picker_window_physical_w / 2 as f64),
        p_coords.y as f64 - (picker_window_physical_h / 2 as f64),
    ))
    .unwrap();

    // capture image
    let offset = (size / 2) as f64;
    let img = mod_screenshot::capture_screen_area(
        p_coords.x - offset,
        p_coords.y - offset,
        size as f64,
        size as f64,
        scale_factor,
    );

    match img {
        Some(img) => {
            // transform image to base64
            let img_base64 = mod_image::image_to_base64(&img);

            // capture color
            let color = mod_image::get_center_pixel_color(img);

            // emit image and color
            app.emit_to(
                EventTarget::labeled("picker"),
                "preview_fetched",
                (img_base64, color, size),
            )
            .unwrap();
        }
        None => {
            println!("No image captured");
        }
    }
}

#[tauri::command]
fn check_macos_screen_recording_permission() -> bool {
    return mod_macospermissions::check_macos_screen_recording_permission();
}

#[tauri::command]
fn request_macos_screen_recording_permission() -> bool {
    return mod_macospermissions::request_macos_screen_recording_permission();
}

#[tauri::command]
fn open_macos_screen_recording_settings() {
    mod_macospermissions::open_macos_screen_recording_settings();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
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
            fetch_preview,
            check_macos_screen_recording_permission,
            request_macos_screen_recording_permission,
            open_macos_screen_recording_settings,
        ])
        .setup(|app| {
            #[cfg(target_os = "macos")]
            let picker_window = app.get_webview_window("picker").unwrap();
            let picker_panel = picker_window.to_panel().unwrap();
            picker_panel.set_level(NSMainMenuWindowLevel + 1);
            picker_panel.set_style_mask(NSWindowStyleMaskNonActivatingPanel);
            picker_panel.set_collection_behaviour(
                NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
                    | NSWindowCollectionBehavior::NSWindowCollectionBehaviorStationary
                    | NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
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
