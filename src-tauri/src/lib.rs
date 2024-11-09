use base64::{engine::general_purpose, Engine as _};
use image::{DynamicImage, GenericImageView, ImageFormat};
use mouse_position::mouse_position::Mouse;
use screenshots::Screen;
use std::io::Cursor;
use tauri::{
    // menu::{Menu, MenuItem},
    // tray::TrayIconBuilder,
    AppHandle,
    Emitter,
    EventTarget,
    LogicalPosition,
    Manager,
};

fn get_screen_area(x: i32, y: i32, w: u32, h: u32) -> DynamicImage {
    // Get the screen object for the specified coordinates
    let screen = Screen::from_point(x, y).expect("Failed to get screen");

    let target_w = (w as f32) / screen.display_info.scale_factor;
    let target_h = (h as f32) / screen.display_info.scale_factor;

    // Round to the nearest integer and then cast to u32
    let rounded_w = target_w.round() as u32;
    let rounded_h = target_h.round() as u32;

    // Capture the specified area on the screen
    let area = screen
        .capture_area(x, y, rounded_w, rounded_h)
        .expect("Failed to capture area");

    DynamicImage::ImageRgba8(area)
}

fn image_to_base64(img: &DynamicImage) -> String {
    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageFormat::Png)
        .unwrap();
    let res_base64 = general_purpose::STANDARD.encode(image_data);
    format!("data:image/png;base64,{}", res_base64)
}

fn get_center_pixel_color(img: DynamicImage) -> Option<(u8, u8, u8)> {
    // Get the dimensions of the image
    let (width, height) = img.dimensions();

    // Find the center pixel coordinates
    let center_x = width / 2;
    let center_y = height / 2;

    // Get the pixel at the center
    let pixel = img.get_pixel(center_x - 1, center_y - 1);

    // Convert the pixel to RGB and return its color values
    let image::Rgba([r, g, b, _]) = pixel;
    Some((r, g, b))
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn fetch_preview(app: AppHandle, size: u32) {
    let position = Mouse::get_mouse_position();
    match position {
        Mouse::Position { x, y } => {
            // move window to cursor
            let win = app.get_webview_window("picker").unwrap();
            win.set_position(LogicalPosition::new(x - 64, y - 64))
                .unwrap();

            // capture image
            let offset = (size / 2) as i32;
            let img = get_screen_area(x - offset, y - offset, size, size);

            // transform image to base64
            let img_base64 = image_to_base64(&img);

            // capture color
            let color = get_center_pixel_color(img);

            // emit image and color
            app.emit_to(
                EventTarget::labeled("picker"),
                "preview_fetched",
                (img_base64, color),
            )
            .unwrap();
        }
        Mouse::Error => println!("Error getting mouse position"),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![fetch_preview])
        // .setup(|app| {
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
        //     Ok(())
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
