// components/auth/sign-up-form.tsx - Simple version
import React, { useState } from "react";

export function SignUpForm(): React.ReactElement {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // Just log to console in this simplified version
    console.log("Sign up with:", { name, email, password });
  };
  
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "16px" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Name</label>
          <input
            className="input"
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Email</label>
          <input
            className="input"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Password</label>
          <input
            className="input"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button className="button" type="submit">Sign Up</button>
      </form>
    </div>
  );
}
