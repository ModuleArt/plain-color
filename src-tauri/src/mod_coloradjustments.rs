use rcms::{link::link, profile::Intent, IccProfile};

pub fn apply_p3_to_srgb_correction_manual(wrong_r: u8, wrong_g: u8, wrong_b: u8) -> (u8, u8, u8) {
    // Normalize the input color (u8 -> f32 in range 0.0 to 1.0)
    let wrong_r_norm = wrong_r as f32 / 255.0;
    let wrong_g_norm = wrong_g as f32 / 255.0;
    let wrong_b_norm = wrong_b as f32 / 255.0;

    // Gamma decode the colors (convert from gamma-corrected to linear space)
    fn gamma_decode(channel: f32) -> f32 {
        if channel <= 0.04045 {
            channel / 12.92
        } else {
            ((channel + 0.055) / 1.055).powf(2.4)
        }
    }
    let linear_r = gamma_decode(wrong_r_norm);
    let linear_g = gamma_decode(wrong_g_norm);
    let linear_b = gamma_decode(wrong_b_norm);

    // Apply the Display P3 to sRGB transformation matrix
    fn p3_to_srgb_matrix(r: f32, g: f32, b: f32) -> (f32, f32, f32) {
        let r_srgb = 1.2249 * r - 0.2249 * g + 0.0000 * b;
        let g_srgb = -0.0420 * r + 1.0420 * g + 0.0000 * b;
        let b_srgb = -0.0197 * r - 0.0787 * g + 1.0984 * b;
        (r_srgb, g_srgb, b_srgb)
    }
    let (srgb_r, srgb_g, srgb_b) = p3_to_srgb_matrix(linear_r, linear_g, linear_b);

    // Gamma encode the colors (convert back from linear space to sRGB gamma-corrected space)
    fn gamma_encode(channel: f32) -> f32 {
        if channel <= 0.0031308 {
            channel * 12.92
        } else {
            1.055 * channel.powf(1.0 / 2.4) - 0.055
        }
    }
    let corrected_r = gamma_encode(srgb_r);
    let corrected_g = gamma_encode(srgb_g);
    let corrected_b = gamma_encode(srgb_b);

    // Convert back to u8 and apply more aggressive rounding
    fn to_u8_precise(channel: f32) -> u8 {
        // Slightly more aggressive rounding to combat tiny discrepancies
        let rounded_channel = channel * 255.0;
        if rounded_channel % 1.0 < 0.5 {
            rounded_channel.floor() as u8
        } else {
            rounded_channel.ceil() as u8
        }
    }

    // Convert and return the corrected color
    (
        to_u8_precise(corrected_r),
        to_u8_precise(corrected_g),
        to_u8_precise(corrected_b),
    )
}

pub fn apply_p3_to_srgb_correction(wrong_r: u8, wrong_g: u8, wrong_b: u8) -> (u8, u8, u8) {
    let p3_profile = IccProfile::new_display_p3();
    let srgb_profile = IccProfile::new_srgb();

    let transform_pipeline = link(
        &[&p3_profile, &srgb_profile],
        &[Intent::Perceptual, Intent::Perceptual],
        &[false, false],
        &[0., 0.],
    )
    .expect("failed to create color transform");

    let wrong_r_norm = wrong_r as f64 / 255.0;
    let wrong_g_norm = wrong_g as f64 / 255.0;
    let wrong_b_norm = wrong_b as f64 / 255.0;

    let wrong_rgb = [wrong_r_norm, wrong_g_norm, wrong_b_norm];

    let mut out_color = [0 as f64; 3];
    transform_pipeline.transform(&wrong_rgb, &mut out_color);

    let corrected_r = (out_color[0] * 255.0).round() as u8;
    let corrected_g = (out_color[1] * 255.0).round() as u8;
    let corrected_b = (out_color[2] * 255.0).round() as u8;

    (corrected_r, corrected_g, corrected_b)
}
