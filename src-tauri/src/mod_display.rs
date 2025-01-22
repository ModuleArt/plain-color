use core_graphics::display::{CGDisplay, CGPoint};

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
