// Simple sign-in page
import { SignInForm } from "../components/auth/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px" }}>Sign In</h1>
      <SignInForm />
      <div style={{ textAlign: "center", marginTop: "16px" }}>
        Don't have an account?{" "}
        <Link href="/sign-up">Sign up</Link>
      </div>
    </div>
  );
}
