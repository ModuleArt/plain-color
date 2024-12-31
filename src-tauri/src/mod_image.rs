use base64::{engine::general_purpose, Engine as _};
use image::{DynamicImage, GenericImageView, ImageFormat, Rgba};
use std::io::Cursor;

pub fn image_to_base64(img: &DynamicImage) -> String {
    let mut image_data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut image_data), ImageFormat::Png)
        .unwrap();
    let res_base64 = general_purpose::STANDARD.encode(image_data);
    format!("data:image/png;base64,{}", res_base64)
}

pub fn get_center_pixel_color(img: DynamicImage) -> Option<(u8, u8, u8)> {
    // Get the dimensions of the image
    let (width, height) = img.dimensions();

    // Find the center pixel coordinates
    let center_x = width / 2;
    let center_y = height / 2;

    // Get the pixel at the center
    let pixel = img.get_pixel(center_x - 1, center_y - 1);

    // Convert the pixel to RGB and return its color values
    let Rgba([r, g, b, _]) = pixel;
    Some((r, g, b))
}
