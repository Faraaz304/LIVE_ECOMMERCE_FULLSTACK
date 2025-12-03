// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Import from the file you created in Step 1

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };