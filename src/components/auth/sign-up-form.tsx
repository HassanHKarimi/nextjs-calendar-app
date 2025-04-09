"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/schemas";
import { useToast } from "@/hooks/use-toast";

export function SignUpForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Create form
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Form submission handler
  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    setIsLoading(true);
    console.log("Starting registration process...");

    try {
      // For demo purposes, we'll bypass actual API call in case the API is not available
      if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
        console.log("Demo mode: bypassing registration API");
        
        // Show success toast
        toast({
          title: "Registration successful! (Demo Mode)",
          description: "Redirecting to sign-in page...",
        });
        
        // Manual redirect with simulated delay for better UX
        setTimeout(() => {
          try {
            const redirectUrl = `/sign-in?email=${encodeURIComponent(values.email)}&registered=true`;
            
            if (router) {
              router.push(redirectUrl);
            } else if (typeof window !== 'undefined') {
              window.location.href = redirectUrl;
            }
          } catch (navError) {
            console.error("Navigation error:", navError);
            if (typeof window !== 'undefined') {
              window.location.href = `/sign-in?email=${encodeURIComponent(values.email)}&registered=true`;
            }
          }
        }, 1000);
        
        return;
      }
      
      // If not in demo mode, proceed with real API call
      const registerResponse = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          role: "USER" // Explicitly add the role field
        }),
      });

      console.log("Registration response status:", registerResponse.status);

      if (!registerResponse.ok) {
        const error = await registerResponse.json();
        throw new Error(error.message || "Failed to register");
      }
      
      // Get the response data
      const userData = await registerResponse.json();
      console.log("User registered successfully:", userData);

      toast({
        title: "Registration successful!",
        description: "Redirecting to sign-in page...",
      });

      // Redirect to sign-in page with prefilled email
      try {
        const redirectUrl = `/sign-in?email=${encodeURIComponent(values.email)}&registered=true`;
        
        if (router) {
          router.push(redirectUrl);
        } else if (typeof window !== 'undefined') {
          window.location.href = redirectUrl;
        }
      } catch (navError) {
        console.error("Navigation error:", navError);
        if (typeof window !== 'undefined') {
          window.location.href = `/sign-in?email=${encodeURIComponent(values.email)}&registered=true`;
        }
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Check for specific error types
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error.message && error.message.includes("Email already in use")) {
        errorMessage = "This email is already registered. Please try signing in instead.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Registration Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-2">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          try {
            signIn("google", { callbackUrl: "/calendar" });
          } catch (error) {
            console.error("Google sign-in error:", error);
            toast({
              title: "Google Sign-Up Unavailable",
              description: "This feature is not available in demo mode.",
              variant: "destructive",
            });
          }
        }}
        disabled={isLoading}
      >
        Continue with Google
      </Button>
    </div>
  );
}
