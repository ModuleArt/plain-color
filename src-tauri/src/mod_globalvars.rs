use std::sync::{Arc, Mutex};

pub static mut GLOBAL_PREVIEW_SIZE: Option<Arc<Mutex<u32>>> = None;

pub fn initialize_global_vars() {
    unsafe {
        // Initialize the global variable if it's not already initialized
        if GLOBAL_PREVIEW_SIZE.is_none() {
            GLOBAL_PREVIEW_SIZE = Some(Arc::new(Mutex::new(12)));
        }
    }
}

pub fn get_preview_size() -> u32 {
    unsafe {
        // Safe to unwrap here because we initialize it beforehand in the runtime
        let preview_size = GLOBAL_PREVIEW_SIZE.as_ref().unwrap().lock().unwrap();
        *preview_size
    }
}

pub fn set_preview_size(value: u32) {
    unsafe {
        // Safe to unwrap here because we initialize it beforehand in the runtime
        let mut preview_size = GLOBAL_PREVIEW_SIZE.as_ref().unwrap().lock().unwrap();
        *preview_size = value;
    }
    println!("Picker preview size changed to {}", value);
}
