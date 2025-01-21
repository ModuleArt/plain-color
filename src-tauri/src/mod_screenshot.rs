use crate::mod_coloradjustments;
use crate::mod_display;
use crate::mod_globalvars;

use core_graphics::display::{CGPoint, CGRect, CGSize};
use image::{DynamicImage, Rgb, RgbImage};

pub fn color_space_adjustment(r: u8, g: u8, b: u8) -> (u8, u8, u8) {
    let rgb = mod_coloradjustments::apply_p3_to_srgb_correction(r, g, b);

    (rgb.0, rgb.1, rgb.2)
}

pub fn capture_screen_area(
    physical_x: f64,
    physical_y: f64,
    physical_width: f64,
    physical_height: f64,
    scale_factor: f64,
) -> Option<DynamicImage> {
    let logical_x: f64 = (physical_x / scale_factor).round();
    let logical_y: f64 = (physical_y / scale_factor).round();
    let logical_width: f64 = (physical_width / scale_factor).round();
    let logical_height: f64 = (physical_height / scale_factor).round();

    // coordinates with offset in all sides
    let capture_x = logical_x - 1 as f64;
    let capture_y = logical_y - 1 as f64;
    let capture_width = logical_width + 2 as f64;
    let capture_height = logical_height + 2 as f64;

    if let Some(display) = mod_display::get_display_from_coordinates(logical_x, logical_y) {
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

        // if let Some(color_space) = mod_display::get_display_color_space(display) {
        for y in 0..img_height {
            for x in 0..img_width {
                // Cast `x` and `y` to `usize` before multiplying with `stride` and `4`
                let offset = (y as usize * stride + x as usize * 4) as usize; // Adjust for row stride

                // Ensure the offset is within the bounds of the data array
                if offset + 3 < data_len {
                    let mut r = data[offset + 2];
                    let mut g = data[offset + 1];
                    let mut b = data[offset];

                    let color_profile = mod_globalvars::get_color_profile();

                    if color_profile == mod_globalvars::ScreenColorProfile::SRGB {
                        let rgb = color_space_adjustment(r, g, b);
                        r = rgb.0;
                        g = rgb.1;
                        b = rgb.2;
                    }

                    // Set the pixel color in the image
                    img.put_pixel(x, y, Rgb([r, g, b]));
                }
            }
        }
        // }

        // Convert RgbImage to DynamicImage for cropping
        let mut dynamic_img = DynamicImage::ImageRgb8(img);

        let crop_x = ((physical_x / scale_factor).trunc() - capture_x) as u32; // Adjust for the offset
        let crop_y = ((physical_y / scale_factor).trunc() - capture_y) as u32;
        let crop_width = physical_width.round() as u32;
        let crop_height = physical_height.round() as u32;

        let cropped = dynamic_img.crop(crop_x, crop_y, crop_width, crop_height);

        Some(cropped)
    } else {
        println!(
            "No display found for coordinates ({}, {})",
            physical_x, physical_y
        );
        None // Return None if no display is found
    }
}
