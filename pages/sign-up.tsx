// Simple sign-up page
import { SignUpForm } from "../components/auth/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Sign Up</h1>
      <SignUpForm />
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        Already have an account?{" "}
        <Link href="/sign-in">Sign in</Link>
      </div>
    </div>
  );
}
