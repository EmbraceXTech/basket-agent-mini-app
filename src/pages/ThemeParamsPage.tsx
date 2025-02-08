import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";

export function ThemeParamsPage() {
  const { authenticated, user, login, logout, linkTelegram } = usePrivy();

  const handleTelegramLink = async () => {
    try {
      await linkTelegram();
      alert("Telegram account linked successfully!");
    } catch (error) {
      console.error("Error linking Telegram:", error);
      alert("Failed to link Telegram.");
    }
  };
  useEffect(() => {
    const telegramWebApp = (
      window as unknown as { Telegram?: { WebApp?: { expand: () => void } } }
    ).Telegram?.WebApp;
    if (telegramWebApp) {
      console.log("Telegram Mini App detected");
      telegramWebApp.expand(); // Ensure app is expanded
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Privy Telegram Auth</h1>
      {!authenticated ? (
        <button onClick={() => login({ loginMethods: ["telegram"] })}>
          Login with Privy
        </button>
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
