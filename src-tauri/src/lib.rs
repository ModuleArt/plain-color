use base64::{engine::general_purpose, Engine as _};
#[cfg(feature = "device_query")]
use device_query::{DeviceQuery, DeviceState, MouseState};
use image::{DynamicImage, ImageFormat, ImageOutputFormat};
#[cfg(feature = "mouce")]
use mouce::Mouse;
use screenshots::Screen;
use std::io::Cursor;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    AppHandle, Emitter, EventTarget, Manager, PhysicalPosition, Window,
};

// #[cfg(feature = "device_query")]
// fn request_pixel_position() -> Option<(i32, i32)> {
//     let device_state: DeviceState = DeviceState::new();

//     loop {
//         let mouse: MouseState = device_state.get_mouse();

//         if mouse.button_pressed[1] {
//             return Some(mouse.coords);
//         }

//         if mouse.button_pressed[3] {
//             return None;
//         }
//     }
// }

// #[cfg(feature = "mouce")]
// fn request_pixel_position() -> Option<(i32, i32)> {
//     let mut mouse_manager = Mouse::new();

//     let (sender, receiver) = mpsc::channel();

//     let callback_id = mouse_manager
//         .hook(Box::new(move |x| match x {
//             MouseEvent::Press(MouseButton::Left) => sender.send(true).unwrap(),
//             MouseEvent::Press(MouseButton::Right) => sender.send(false).unwrap(),
//             _ => (),
//         }))
//         .unwrap();

//     let accepted = receiver.recv().unwrap();
//     mouse_manager.unhook(callback_id).unwrap();

//     if accepted {
//         Some(mouse_manager.get_position().unwrap())
//     } else {
//         None
//     }
// }

#[cfg(feature = "device_query")]
fn request_mouse_position() -> Option<(i32, i32)> {
    let device_state: DeviceState = DeviceState::new();
    let mouse: MouseState = device_state.get_mouse();
    return Some(mouse.coords);
}

#[cfg(feature = "mouce")]
fn request_mouse_position() -> Option<(i32, i32)> {
    let mut mouse_manager = Mouse::new();
    return Some(mouse_manager.get_position().unwrap());
}

// fn get_pixel_colour((x, y): (i32, i32)) -> (u8, u8, u8) {
//     let screen = Screen::from_point(x, y).unwrap();

//     let (x, y) = (x - screen.display_info.x, y - screen.display_info.y);

//     let screenshot = screen.capture_area(x, y, 1, 1).unwrap();

//     let image = image::load_from_memory_with_format(screenshot.buffer(), ImageFormat::Png).unwrap();

//     let pixel = image.as_rgba8().unwrap().pixels().next().unwrap().0;

//     (pixel[0], pixel[1], pixel[2])
// }

fn get_screen_area(
    x: i32,
    y: i32,
    w: u32,
    h: u32,
    pixel_at_x: u32,
    pixel_at_y: u32,
) -> (DynamicImage, [u8; 4]) {
    let screen = Screen::from_point(x, y).unwrap();
    let (x, y) = (x - screen.display_info.x, y - screen.display_info.y);
    let screenshot = screen.capture_area(x, y, w, h).unwrap();
    let img = image::load_from_memory_with_format(screenshot.buffer(), ImageFormat::Png).unwrap();
    let pixels = img.as_rgba8().unwrap().get_pixel(pixel_at_x, pixel_at_y).0;
    return (img, pixels);
}

fn image_to_base64(img: &DynamicImage) -> String {
    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageOutputFormat::Png)
        .unwrap();
    let res_base64 = general_purpose::STANDARD.encode(image_data);
    format!("data:image/png;base64,{}", res_base64)
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

// #[tauri::command]
// fn pick_color(app: AppHandle) {
//     let Some(coordinates) = request_pixel_position() else {
//         println!("Ending program");
//         return;
//     };

//     let res = get_pixel_colour(coordinates);

//     app.emit("color_picked", res).unwrap();
// }

fn convert_position_to_i32(position: PhysicalPosition<f64>) -> (i32, i32) {
    let x = position.x.round() as i32;
    let y = position.y.round() as i32;
    (x, y)
}

#[tauri::command]
fn fetch_preview(app: AppHandle) {
    let Some(coordinates) = request_mouse_position() else {
        println!("Ending program");
        return;
    };
    // let coordinates = app.cursor_position().unwrap();
    let xy = convert_position_to_i32(coordinates);

    let data = get_screen_area(xy.0 - 12, xy.1 - 12, 24, 24, 12, 12);
    let img = data.0;

    let res = image_to_base64(&img);

    let win_pos: PhysicalPosition<i32> = PhysicalPosition::new(coordinates.0, coordinates.1);
    app.get_webview_window("picker")
        .unwrap()
        .set_position(win_pos);

    // tauri::Window::
    // tauri::Window::set_position(&self, position)
    app.emit_to(
        EventTarget::labeled("picker"),
        "preview_fetched",
        (res, data.1, coordinates),
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
