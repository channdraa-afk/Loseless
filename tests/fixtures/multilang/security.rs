use crate::auth::verify_token;

pub fn execute_transfer(user_id: &str, amount: f64) -> Result<(), &'static str> {
    if !verify_token(user_id) {
        return Err("Unauthorized");
    }
    Ok(())
}
