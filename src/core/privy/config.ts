import env from "../env";

export const appId = env.VITE_PRIVY_APP_ID;

const privyConfig = {
  appId,
};

export default privyConfig;