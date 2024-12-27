use base64::{engine::general_purpose, Engine as _};
use core_graphics::display::{CGDisplay, CGPoint, CGRect, CGSize};
use image::{DynamicImage, GenericImageView, ImageFormat, Rgb, RgbImage};
use once_cell::sync::Lazy;
use std::{io::Cursor, sync::Mutex};
use tauri::{
    menu::{Menu, PredefinedMenuItem, Submenu},
    // tray::TrayIconBuilder,
    AppHandle,
    Emitter,
    EventTarget,
    Manager,
    PhysicalPosition,
};

static GLOBAL_PICKER_WINDOW: Lazy<Mutex<Option<tauri::WebviewWindow>>> =
    Lazy::new(|| Mutex::new(None));

fn get_display_from_coordinates(x: f64, y: f64) -> Option<CGDisplay> {
    // Get the active displays (Vec<u32>, each representing a display ID)
    let displays = CGDisplay::active_displays().unwrap();

    // Iterate through the display IDs
    for display_id in displays {
        let display = CGDisplay::new(display_id);

        // Get the bounds of the display using the display ID
        let bounds = CGDisplay::bounds(&display);

        let point = CGPoint::new(x, y);

        // Check if the point (x, y) is inside the display's bounds
        if bounds.contains(&point) {
            return Some(display); // Return the display ID if the point is within its bounds
        }
    }

    None // Return None if no display contains the point
}

fn capture_screenshot(
    physical_x: f64,
    physical_y: f64,
    physical_width: f64,
    physical_height: f64,
    scale_factor: f64,
) -> Option<DynamicImage> {
    let logical_x = (physical_x / scale_factor).round();
    let logical_y = (physical_y / scale_factor).round();
    let logical_width = (physical_width / scale_factor).round();
    let logical_height = (physical_height / scale_factor).round();

    // coordinates with offset in all sides
    let capture_x = logical_x - 1 as f64;
    let capture_y = logical_y - 1 as f64;
    let capture_width = logical_width + 2 as f64;
    let capture_height = logical_height + 2 as f64;

    if let Some(display) = get_display_from_coordinates(logical_x, logical_y) {
        let point = CGPoint::new(capture_x, capture_y);
        let size = CGSize::new(capture_width, capture_height);

        // Capture the screenshot of the specified area from the display
        let image_data = display.image_for_rect(CGRect::new(&point, &size)).unwrap();

        let img_width = image_data.width() as u32;
        let img_height = image_data.height() as u32;

        // Handle image row stride, if available (some images have extra padding)
        let stride = image_data.bytes_per_row() as usize;

        let mut img = RgbImage::new(img_width, img_height); // Create a new image buffer
        let data = image_data.data(); // Access the raw pixel data (RGBA)

        let data_len = data.len() as usize;

        // Iterate through each pixel and set it in the image buffer
        for y in 0..img_height {
            for x in 0..img_width {
                // Cast `x` and `y` to `usize` before multiplying with `stride` and `4`
                let offset = (y as usize * stride + x as usize * 4) as usize; // Adjust for row stride

                // Ensure the offset is within the bounds of the data array
                if offset + 3 < data_len {
                    let r = data[offset];
                    let g = data[offset + 1];
                    let b = data[offset + 2];
                    // Ignore the alpha channel (data[offset + 3])

                    // Set the pixel color in the image
                    img.put_pixel(x, y, Rgb([r, g, b]));
                }
            }
        }

        // Convert RgbImage to DynamicImage for cropping
        let mut dynamic_img = DynamicImage::ImageRgb8(img);

        let crop_x = ((physical_x / scale_factor).trunc() - capture_x) as u32; // Adjust for the offset
        let crop_y = ((physical_y / scale_factor).trunc() - capture_y) as u32;
        let crop_width = physical_width.round() as u32;
        let crop_height = physical_height.round() as u32;

        let cropped = dynamic_img.crop(crop_x, crop_y, crop_width, crop_height);

        // Save the image to a file (e.g., PNG format)
        // match img.save("screenshot.png") {
        //     Ok(_) => println!("Image saved successfully to 'screenshot.png'"),
        //     Err(e) => println!("Failed to save image: {}", e),
        // }

        Some(cropped) // Return the captured image
    } else {
        println!(
            "No display found for coordinates ({}, {})",
            physical_x, physical_y
        );
        None // Return None if no display is found
    }
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
    let img = capture_screenshot(
        p_coords.x - offset,
        p_coords.y - offset,
        size as f64,
        size as f64,
        scale_factor,
    );

    match img {
        Some(img) => {
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
        None => {
            println!("No image captured");
        }
    }
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
        .invoke_handler(tauri::generate_handler![fetch_preview])
        .setup(|app| {
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            let picker_window: tauri::WebviewWindow = app.get_webview_window("picker").unwrap();
            let mut global_picker_screen = GLOBAL_PICKER_WINDOW
                .lock()
                .expect("Failed to lock GLOBAL_PICKER_WINDOW");
            *global_picker_screen = Some(picker_window.clone());

            // configure macOS window behavior
            #[cfg(target_os = "macos")]
            {
                use appkit_nsworkspace_bindings::{
                    INSNotificationCenter, INSWorkspace, NSWorkspace,
                    NSWorkspaceActiveSpaceDidChangeNotification,
                };
                use cocoa::{
                    appkit::{
                        NSMainMenuWindowLevel, NSWindow, NSWindowCollectionBehavior,
                        NSWindowStyleMask,
                    },
                    base::{id, nil},
                    foundation::NSPoint,
                };
                use objc::declare::ClassDecl;
                use objc::runtime::{Object, Sel};
                use objc::{class, msg_send, sel, sel_impl};

                let ns_win = picker_window.ns_window().unwrap() as id;

                unsafe {
                    // ns_win.makeKeyAndOrderFront_(nil);
                    ns_win.setLevel_(((NSMainMenuWindowLevel + 1) as u64).try_into().unwrap());
                    // ns_win.setCanHide_(false);
                    // ns_win.setCollectionBehavior_(
                    //     NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
                    //     | NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
                    // );

                    extern "C" fn notify_space_changed(
                        _self: &Object,
                        _cmd: Sel,
                        _notification: *mut Object,
                    ) {
                        println!("Received application launch notification");

                        let global_picker_window = GLOBAL_PICKER_WINDOW
                            .lock()
                            .expect("Failed to lock GLOBAL_PICKER_WINDOW");
                        if let Some(picker_window) = &*global_picker_window {
                            let ns_win = picker_window.ns_window().unwrap() as id;

                            unsafe {
                                println!("Hooray!");

                                // NSWindowCollectionBehavior::NSWindowCollectionBehaviorMoveToActiveSpace
                                // NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary
                                // NSWindowCollectionBehaviorStationary
                                // NSWindowCollectionBehaviorIgnoresCycle
                                // NSWindowCollectionBehaviorCanJoinAllSpaces

                                // ns_win.setLevel_(((NSMainMenuWindowLevel + 1) as u64).try_into().unwrap());
                                // ns_win.setStyleMask_(NSWindowStyleMask::NSBorderlessWindowMask);
                                // ns_win.setCollectionBehavior_(
                                //     NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
                                //     | NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
                                // );
                                // ns_win.orderFrontRegardless();

                                // ns_win.setLevel_(((NSMainMenuWindowLevel + 1) as u64).try_into().unwrap());
                                // ns_win.setCanHide_(false);
                                // ns_win.setCollectionBehavior_(
                                //     NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
                                //     | NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
                                // );
                            }
                        }
                    }

                    let mut class_decl = ClassDecl::new("RustObserver", class!(NSObject)).unwrap();
                    class_decl.add_method(
                        sel!(notify_space_changed:),
                        notify_space_changed as extern "C" fn(&Object, Sel, *mut Object),
                    );
                    let observer_class = class_decl.register();
                    let observer: *mut Object = msg_send![observer_class, new];
                    let name = NSWorkspaceActiveSpaceDidChangeNotification;

                    NSWorkspace::sharedWorkspace()
                        .notificationCenter()
                        .addObserver_selector_name_object_(
                            observer,
                            sel!(notify_space_changed:),
                            name,
                            nil,
                        );
                }
            }

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
