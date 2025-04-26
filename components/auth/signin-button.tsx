"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SignInButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <p>Signed in as {session.user?.email}</p>
        <Button variant="outline" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => router.push("/auth/register")}>
        Register
      </Button>
      <Button onClick={() => signIn()}>    
        Sign in
      </Button>
    </div>
  );
}