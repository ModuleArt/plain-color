use image::ImageFormat;
use screenshots::Screen;
use tauri::{AppHandle, Emitter};

#[cfg(feature = "device_query")]
use device_query::{DeviceQuery, DeviceState, MouseState};

#[cfg(feature = "mouce")]
use {
    mouce::{
        common::{MouseButton, MouseEvent},
        Mouse,
    },
    std::sync::mpsc,
};

#[cfg(feature = "device_query")]
fn request_pixel_position() -> Option<(i32, i32)> {
    let device_state: DeviceState = DeviceState::new();

    loop {
        let mouse: MouseState = device_state.get_mouse();

        if mouse.button_pressed[1] {
            return Some(mouse.coords);
        }

        if mouse.button_pressed[3] {
            return None;
        }
    }
}

#[cfg(feature = "mouce")]
fn request_pixel_position() -> Option<(i32, i32)> {
    let mut mouse_manager = Mouse::new();

    let (sender, receiver) = mpsc::channel();

    let callback_id = mouse_manager
        .hook(Box::new(move |x| match x {
            MouseEvent::Press(MouseButton::Left) => sender.send(true).unwrap(),
            MouseEvent::Press(MouseButton::Right) => sender.send(false).unwrap(),
            _ => (),
        }))
        .unwrap();

    let accepted = receiver.recv().unwrap();
    mouse_manager.unhook(callback_id).unwrap();

    if accepted {
        Some(mouse_manager.get_position().unwrap())
    } else {
        None
    }
}

fn get_pixel_colour((x, y): (i32, i32)) -> (u8, u8, u8) {
    let screen = Screen::from_point(x, y).unwrap();

    let (x, y) = (x - screen.display_info.x, y - screen.display_info.y);

    let screenshot = screen.capture_area(x, y, 1, 1).unwrap();

    let image = image::load_from_memory_with_format(screenshot.buffer(), ImageFormat::Png).unwrap();

    let pixel = image.as_rgba8().unwrap().pixels().next().unwrap().0;

    (pixel[0], pixel[1], pixel[2])
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[tauri::command]
fn pick_color(app: AppHandle) {
    let Some(coordinates) = request_pixel_position() else {
        println!("Ending program");
        return;
    };

    let res = get_pixel_colour(coordinates);

    app.emit("color_picked", res).unwrap();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![pick_color])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
