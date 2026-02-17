import "server-only";

import { StackServerApp } from "@stackframe/stack";

// Check if Stack Auth is configured
const isStackConfigured = process.env.NEXT_PUBLIC_STACK_PROJECT_ID && 
                          process.env.NEXT_PUBLIC_STACK_PROJECT_ID !== '';

export const stackServerApp = isStackConfigured ? new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: '/signin',
    signUp: '/signup',
    accountSettings: '/account',
  }
}) : null;
