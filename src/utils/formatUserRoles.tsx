// Helper function to format role
const formatUserRole = (role: string) => {
    switch (role) {
      case "UserRole.PHARMACIST":
        return "Pharmacist";
      default:
        return role; // Fallback to raw value if not found
    }
  };

  export default formatUserRole