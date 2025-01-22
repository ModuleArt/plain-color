use std::sync::{Arc, Mutex};

use std::str::FromStr;

#[derive(PartialEq, Eq)]
pub enum ScreenColorProfile {
    SYSTEM,
    SRGB,
}

impl FromStr for ScreenColorProfile {
    type Err = ();

    fn from_str(input: &str) -> Result<ScreenColorProfile, Self::Err> {
        match input {
            "SYSTEM" => Ok(ScreenColorProfile::SYSTEM),
            "SRGB" => Ok(ScreenColorProfile::SRGB),
            _ => Err(()),
        }
    }
}

impl Clone for ScreenColorProfile {
    fn clone(&self) -> Self {
        match self {
            ScreenColorProfile::SYSTEM => ScreenColorProfile::SYSTEM,
            ScreenColorProfile::SRGB => ScreenColorProfile::SRGB,
        }
    }
}

static mut GLOBAL_PREVIEW_SIZE: Option<Arc<Mutex<u32>>> = None;
static mut GLOBAL_COLOR_PROFILE: Option<Arc<Mutex<ScreenColorProfile>>> = None;

pub fn initialize_global_vars() {
    unsafe {
        if GLOBAL_PREVIEW_SIZE.is_none() {
            GLOBAL_PREVIEW_SIZE = Some(Arc::new(Mutex::new(12)));
        }

        if GLOBAL_COLOR_PROFILE.is_none() {
            GLOBAL_COLOR_PROFILE = Some(Arc::new(Mutex::new(ScreenColorProfile::SRGB)));
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

pub fn get_color_profile() -> ScreenColorProfile {
    unsafe {
        let color_profile = GLOBAL_COLOR_PROFILE.as_ref().unwrap().lock().unwrap();
        color_profile.clone()
    }
}

pub fn set_screen_color_profile(value: ScreenColorProfile) {
    unsafe {
        let mut color_profile = GLOBAL_COLOR_PROFILE.as_ref().unwrap().lock().unwrap();
        *color_profile = value;
    }
}
