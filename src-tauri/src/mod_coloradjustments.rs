use rcms::{link::link, profile::Intent, IccProfile};

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
