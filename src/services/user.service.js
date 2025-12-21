async function createUser(data) {
  const { user_type, matric_no, staff_id } = data;

  if (user_type === "student" && !matric_no) {
    throw new Error("matric_no is required for students");
  }

  if (
    (user_type === "admin_staff" || user_type === "regular_staff") &&
    !staff_id
  ) {
    throw new Error("staff_id is required for staff users");
  }

  return User.create(data);
}
