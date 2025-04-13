// Direct export of auth options to prevent circular imports
// For NextAuth v5, we directly import the object without type annotations
import { authOptions } from "./src/auth";
export default authOptions;
