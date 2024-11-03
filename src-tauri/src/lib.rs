#[cfg(feature = "device_query")]
use device_query::{DeviceQuery, DeviceState, MouseState};
use image::ImageFormat;
use screenshots::Screen;
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    AppHandle, Emitter,
};
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
