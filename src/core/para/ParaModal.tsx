import {
  // AuthLayout,
  // ExternalWallet,
  OAuthMethod,
  ParaModal as ParaModalComponent,
} from "@getpara/react-sdk";
import para from "./config";
import "@getpara/react-sdk/styles.css";

export default function ParaModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <>
      <ParaModalComponent
        para={para}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        logo={"/public/basket-agent-logo.svg"}
        theme={{}}
        oAuthMethods={[
          OAuthMethod.GOOGLE,
          OAuthMethod.TELEGRAM,
        ]}
        // authLayout={[AuthLayout.AUTH_FULL, AuthLayout.EXTERNAL_FULL]}
        externalWallets={[]}
        recoverySecretStepEnabled
        onRampTestMode={true}
      />
    </>
  );
}
