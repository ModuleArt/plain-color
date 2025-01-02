use crate::mod_globalvars;
use crate::mod_image;
use crate::mod_screenshot;

use std::sync::{
    atomic::{AtomicBool, Ordering},
    Arc,
};
use tauri::{Emitter, Manager};

#[derive(Default)]
pub struct LoopState {
    pub running: Arc<AtomicBool>,
    pub task_handle: tokio::sync::Mutex<Option<tokio::task::JoinHandle<()>>>,
}

pub fn start_picker_loop(
    app: tauri::AppHandle,
    state: tauri::State<'_, Arc<tokio::sync::Mutex<LoopState>>>,
) {
    let state = state.inner().clone();
    tauri::async_runtime::spawn(async move {
        let state_lock = state.lock().await;
        let running = state_lock.running.clone();
        let mut task_handle = state_lock.task_handle.lock().await;

        if running.load(Ordering::Relaxed) {
            return;
        }

        running.store(true, Ordering::Relaxed);
        let app_handle = app.clone();

        *task_handle = Some(tokio::spawn(async move {
            println!("Picker loop has started");

            while running.load(Ordering::Relaxed) {
                let preview_size = mod_globalvars::get_preview_size();
                let win = app_handle.get_webview_window("picker").unwrap();
                let res = process_loop_tick(win, preview_size);

                app_handle
                    .emit_to(
                        tauri::EventTarget::labeled("picker"),
                        "picker_loop_tick",
                        res,
                    )
                    .unwrap();

                tokio::time::sleep(tokio::time::Duration::from_millis(25)).await;
            }

            println!("Picker loop has stopped");
            let _ = app_handle.emit_to(
                tauri::EventTarget::labeled("picker"),
                "picker_loop_stopped",
                (),
            );

            return;
        }));
    });
}

pub fn stop_picker_loop(
    _app: tauri::AppHandle,
    state: tauri::State<'_, Arc<tokio::sync::Mutex<LoopState>>>,
) {
    let state = state.inner().clone();
    tauri::async_runtime::spawn(async move {
        let state_lock = state.lock().await;
        let running = state_lock.running.clone();
        let mut task_handle = state_lock.task_handle.lock().await;

        if !running.load(Ordering::Relaxed) {
            return;
        }

        running.store(false, Ordering::Relaxed);

        if let Some(handle) = task_handle.take() {
            handle.await.expect("Failed to stop the loop task");
        }
    });
}

fn process_loop_tick(win: tauri::WebviewWindow, size: u32) -> (String, Option<(u8, u8, u8)>, u32) {
    let picker_window_logical_w = 128;
    let picker_window_logical_h = 128;

    let scale_factor = win.scale_factor().unwrap();

    let p_coords: tauri::PhysicalPosition<f64> = win.cursor_position().unwrap();
    let picker_window_physical_w = picker_window_logical_w as f64 * scale_factor;
    let picker_window_physical_h = picker_window_logical_h as f64 * scale_factor;

    win.set_position(tauri::PhysicalPosition::new(
        p_coords.x as f64 - (picker_window_physical_w / 2 as f64),
        p_coords.y as f64 - (picker_window_physical_h / 2 as f64),
    ))
    .unwrap();

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
            let img_base64 = mod_image::image_to_base64(&img);

            let color = mod_image::get_center_pixel_color(img);

            return (img_base64, color, size);
        }
        None => {
            println!("No image captured");
            return (String::new(), Some((0, 0, 0)), size);
        }
    }
}
