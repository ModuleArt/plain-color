use core_graphics::display::{CGDisplay, CGPoint};

pub fn get_display_from_coordinates(x: f64, y: f64) -> Option<CGDisplay> {
    let valid_x = x.max(0 as f64);
    let valid_y = y.max(0 as f64);

    // Get the active displays (Vec<u32>, each representing a display ID)
    let displays = CGDisplay::active_displays().unwrap();

    // Iterate through the display IDs
    for display_id in displays {
        let display = CGDisplay::new(display_id);

        // Get the bounds of the display using the display ID
        let bounds = CGDisplay::bounds(&display);

        let point = CGPoint::new(valid_x, valid_y);

        // Check if the point (x, y) is inside the display's bounds
        if bounds.contains(&point) {
            return Some(display); // Return the display ID if the point is within its bounds
        }
    }

    None // Return None if no display contains the point
}
