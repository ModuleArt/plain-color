use std::sync::{Arc, Mutex};

use std::str::FromStr;

#[derive(PartialEq, Eq)]
pub enum ColorProfile {
    SYSTEM,
    SRGB,
}

impl FromStr for ColorProfile {
    type Err = ();

    fn from_str(input: &str) -> Result<ColorProfile, Self::Err> {
        match input {
            "SYSTEM" => Ok(ColorProfile::SYSTEM),
            "SRGB" => Ok(ColorProfile::SRGB),
            _ => Err(()),
        }
    }
}

impl Clone for ColorProfile {
    fn clone(&self) -> Self {
        match self {
            ColorProfile::SYSTEM => ColorProfile::SYSTEM,
            ColorProfile::SRGB => ColorProfile::SRGB,
        }
    }
}

static mut GLOBAL_PREVIEW_SIZE: Option<Arc<Mutex<u32>>> = None;
static mut GLOBAL_COLOR_PROFILE: Option<Arc<Mutex<ColorProfile>>> = None;

pub fn initialize_global_vars() {
    unsafe {
        if GLOBAL_PREVIEW_SIZE.is_none() {
            GLOBAL_PREVIEW_SIZE = Some(Arc::new(Mutex::new(12)));
        }

        if GLOBAL_COLOR_PROFILE.is_none() {
            GLOBAL_COLOR_PROFILE = Some(Arc::new(Mutex::new(ColorProfile::SRGB)));
        }
    }
}

pub fn get_preview_size() -> u32 {
    unsafe {
        let preview_size = GLOBAL_PREVIEW_SIZE.as_ref().unwrap().lock().unwrap();
        *preview_size
    }
}

pub fn set_preview_size(value: u32) {
    unsafe {
        let mut preview_size = GLOBAL_PREVIEW_SIZE.as_ref().unwrap().lock().unwrap();
        *preview_size = value;
    }
}

pub fn get_color_profile() -> ColorProfile {
    unsafe {
        let color_profile = GLOBAL_COLOR_PROFILE.as_ref().unwrap().lock().unwrap();
        color_profile.clone()
    }
}

pub fn set_color_profile(value: ColorProfile) {
    unsafe {
        let mut color_profile = GLOBAL_COLOR_PROFILE.as_ref().unwrap().lock().unwrap();
        *color_profile = value;
    }
}
