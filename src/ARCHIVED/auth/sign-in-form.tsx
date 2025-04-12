"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { LoginSchema } from "@/schemas";
import { useToast } from "@/hooks/use-toast";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Get email from URL if present (from registration redirect)
  const emailFromUrl = searchParams?.get("email") || "";
  const justRegistered = searchParams?.get("registered") === "true";

  // Create form
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: emailFromUrl,
      password: "",
    },
  });

  // Show welcome toast if user just registered
  useEffect(() => {
    if (justRegistered) {
      toast({
        title: "Account created successfully!",
        description: "Please sign in with your new account.",
      });
    }
  }, [justRegistered, toast]);

  // Form submission handler
  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    setIsLoading(true);
    console.log("Attempting to sign in...");

    try {
      // For demo purposes, simulate authentication with sessionStorage
      console.log("Demo mode: simulating authentication");
      
      // Create a simulated user object
      const user = {
        id: "demo-user-id",
        name: "Demo User",
        email: values.email,
        role: "USER"
      };
      
      // Store auth in sessionStorage
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('calendarAuth', JSON.stringify({
            isAuthenticated: true,
            user,
            token: "demo-token",
            expiresAt: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) // 7 days
          }));
        } catch (storageError) {
          console.error("Error storing auth data:", storageError);
          // Fall back to direct navigation even if storage fails
        }
      }
      
      toast({
        title: "Success",
        description: "Signed in successfully (demo mode)",
      });
      
      // Use router for client-side navigation when possible
      // with a fallback to window.location for SSR environments
      try {
        if (router) {
          router.push("/calendar");
        } else {
          window.location.href = "/calendar";
        }
      } catch (navError) {
        console.error("Navigation error:", navError);
        // Last resort fallback
        window.location.href = "/calendar";
      }
      
      return;
      
      /* The code below would be used in production with working auth:
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: window.location.origin + "/calendar",
        redirect: false 
      });

      if (response?.error) {
        console.log("Sign-in error:", response.error);
        toast({
          title: "Error",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      console.log("Sign-in successful, redirecting to calendar");
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
      
      router.push("/calendar");
      */
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
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
              {isLoading ? "Signing in..." : "Sign in"}
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
              title: "Google Sign-In Unavailable",
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
