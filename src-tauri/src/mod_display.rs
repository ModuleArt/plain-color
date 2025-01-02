use core_graphics::display::{CGDisplay, CGPoint};
// use objc::runtime::{Class, Object};
// use objc::{msg_send, sel, sel_impl};

pub fn get_display_from_coordinates(x: f64, y: f64) -> Option<CGDisplay> {
    let valid_x = x.max(0 as f64);
    let valid_y = y.max(0 as f64);

    let displays = CGDisplay::active_displays().unwrap();

    for display_id in displays {
        let display = CGDisplay::new(display_id);

        let bounds = CGDisplay::bounds(&display);

        let point = CGPoint::new(valid_x, valid_y);

        if bounds.contains(&point) {
            return Some(display);
        }
    }

    None
}

// pub fn get_display_color_space(display: CGDisplay) -> Option<*mut Object> {
//     let display_id = display.id;
//     let nsscreen_class = Class::get("NSScreen").expect("Class not found");
//     let screens: *mut Object = unsafe { msg_send![nsscreen_class, screens] };
//     let count: usize = unsafe { msg_send![screens, count] };

//     for i in 0..count {
//         let screen_at_index: *mut Object = unsafe { msg_send![screens, objectAtIndex: i] };

//         let screen_display_id: u32 = unsafe { msg_send![screen_at_index, deviceDescription] };

//         if screen_display_id == display_id {
//             let color_space: *mut Object = unsafe { msg_send![screen_at_index, colorSpace] };

//             if !color_space.is_null() {
//                 return Some(color_space);
//             }
//         }
//     }

//     None
// }
