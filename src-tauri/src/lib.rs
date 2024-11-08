use base64::{engine::general_purpose, Engine as _};
use image::{DynamicImage, ImageFormat, ImageOutputFormat};
use screenshots::Screen;
use std::io::Cursor;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    AppHandle, Emitter, EventTarget, LogicalPosition, Manager,
};

fn get_screen_area(
    x: i32,
    y: i32,
    w: i32,
    h: i32,
    pixel_at_x: i32,
    pixel_at_y: i32,
) -> (DynamicImage, [u8; 4]) {
    let screen = Screen::from_point(x, y).unwrap();
    let (x, y) = (x - screen.display_info.x, y - screen.display_info.y);
    let screenshot = screen.capture_area(x, y, w as u32, h as u32).unwrap();
    let img = image::load_from_memory_with_format(screenshot.buffer(), ImageFormat::Png).unwrap();
    let pixel = img.as_rgba8().unwrap().get_pixel(pixel_at_x as u32, pixel_at_y as u32).0;
    return (img, pixel);
}

fn image_to_base64(img: &DynamicImage) -> String {
    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageOutputFormat::Png)
        .unwrap();
    let res_base64 = general_purpose::STANDARD.encode(image_data);
    format!("data:image/png;base64,{}", res_base64)
}

fn f64_to_i32(num: f64) -> i32 {
    return num.round() as i32;
}

fn convert_position_to_i32(position: LogicalPosition<f64>) -> (i32, i32) {
    let x = f64_to_i32(position.x);
    let y = f64_to_i32(position.y);
    (x, y)
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn fetch_preview(app: AppHandle) {
    // get cursor position
    let p_pos = app.cursor_position().unwrap();
    let win = app.get_webview_window("picker").unwrap();
    let scale_factor = win.scale_factor().unwrap();
    let l_pos = p_pos.to_logical(scale_factor);
    let l_coords = convert_position_to_i32(l_pos);

    // move window to cursor
    let l_coords_shifted = (l_coords.0 - 50, l_coords.1 - 50);
    win.set_position(LogicalPosition::new(l_coords_shifted.0, l_coords_shifted.1))
        .unwrap();

    // capture image
    let scale_factor_int = f64_to_i32(scale_factor);
    let data = get_screen_area(
        l_coords.0,
        l_coords.1,
        16 / scale_factor_int,
        16 / scale_factor_int,
        8 / scale_factor_int,
        8 / scale_factor_int,
    );
    let img = data.0;
    let res = image_to_base64(&img);

    app.emit_to(
        EventTarget::labeled("picker"),
        "preview_fetched",
        (res, data.1),
    )
    .unwrap()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![fetch_preview])
        .setup(|app| {
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_i])?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .menu_on_left_click(true)
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {
                        println!("menu item {:?} not handled", event.id);
                    }
                })
                .build(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application")
}
