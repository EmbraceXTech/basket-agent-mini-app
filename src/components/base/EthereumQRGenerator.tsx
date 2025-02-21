import { QRCodeCanvas } from "qrcode.react";
import { generateErc681 } from "@/utils/encodeEthURI.util";

function QRCodeGenerator({
  tokenAddress,
  to,
  chainId,
  isNativeToken = true,
  amount,
}: {
  amount?: string;
  tokenAddress?: string;
  to: string;
  chainId: string;
  isNativeToken?: boolean;
}) {
  const value = generateErc681({
    to: isNativeToken ? to : tokenAddress || "",
    chainId: parseInt(chainId),
    amount: amount,
    isErc20: !isNativeToken,
    recipient: !isNativeToken ? to : undefined,
  });
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <QRCodeCanvas value={value} size={200} fgColor="#ff4f29" />
    </div>
  );
}

export default QRCodeGenerator;
