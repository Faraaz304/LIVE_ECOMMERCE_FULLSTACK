import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure this path is correct
import Link from "next/link";

export default async function Dnager() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h1>Not Logged In</h1>
        <Link href="/api/auth/signin">
          <button style={{ padding: "10px 20px", cursor: "pointer" }}>
            Login with Google
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto", fontFamily: "monospace" }}>
      <h1>User Credentials</h1>
      
      <div style={cardStyle}>
        <h3>🔑 Access Token</h3>
        <textarea readOnly style={textAreaStyle} value={session.accessToken} />
      </div>

      <div style={cardStyle}>
        <h3>🔄 Refresh Token</h3>
        {/* 
            NOTE: If this is empty, go to your Google Cloud Console, 
            Revoke access for this app, and sign in again to trigger a new refresh token.
        */}
        <textarea readOnly style={textAreaStyle} value={session.refreshToken || "No Refresh Token (Revoke access to get a new one)"} />
      </div>

      <div style={cardStyle}>
        <h3>⏳ Expires At</h3>
        <p>{new Date(session.expiresAt).toLocaleString()}</p>
        <p>(Timestamp: {session.expiresAt})</p>
      </div>

      <div style={cardStyle}>
        <h3>👤 User Data</h3>
        <pre>{JSON.stringify(session.user, null, 2)}</pre>
      </div>

      <Link href="/api/auth/signout">
        <button style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
          Sign Out
        </button>
      </Link>
    </div>
  );
}

// Simple styles for readability
const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "20px",
  backgroundColor: "#f9f9f9",
  color: "#333"
};

const textAreaStyle = {
  width: "100%",
  height: "100px",
  padding: "10px",
  fontSize: "12px",
  borderRadius: "5px",
  border: "1px solid #999",
  backgroundColor: "#fff"
};