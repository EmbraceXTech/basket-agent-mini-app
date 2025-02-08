import { useLoginWithTelegram, usePrivy } from "@privy-io/react-auth";

export function ThemeParamsPage() {
  const { ready, authenticated, user, login, logout, linkTelegram } =
    usePrivy();
  const { login: loginTelegram, state } = useLoginWithTelegram();

  const handleTelegramLink = async () => {
    linkTelegram();
  };

  const handleTelegramLogin = async () => {
    try {
      await loginTelegram();
  
      setTimeout(() => {
        if (state.status === "loading") {
          console.warn("⚠️ Still stuck in 'loading' - retrying login...");
          window.location.reload(); // Force retry
        }
      }, 5000);
    } catch (error) {
      console.error("❌ Login Error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div>{state.status}</div>
      <p>{window.location.href}</p>
      <h1>Privy Telegram Auth</h1>
      <p>{authenticated ? "Authenticated" : "Not authenticated"}</p>
      <p>{ready ? "Ready" : "Not ready"}</p>
      {!authenticated ? (
        <>
          <button onClick={() => login({ loginMethods: ["telegram", "email"] })}>
            Login with Privy
          </button>
          <button onClick={handleTelegramLogin}>Login with Telegram</button>
        </>
      ) : (
        <>
          <h2>Welcome, {user?.email?.toString() || "User"}</h2>
          <p>Telegram: {user?.telegram?.username || "Not linked"}</p>

          <button onClick={handleTelegramLink}>Link Telegram</button>
          <button onClick={logout} style={{ marginLeft: "10px" }}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}
