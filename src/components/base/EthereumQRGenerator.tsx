import { QRCodeCanvas } from "qrcode.react";
import { encodeEthURI } from "@/utils/encodeEthURI.util";

function QRCodeGenerator({
  amount,
  ethAddress,
  chainId,
}: {
  amount?: string;
  ethAddress: string;
  chainId: string;
}) {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <QRCodeCanvas
        value={encodeEthURI({ amount, ethAddress, chainId })}
        size={200}
      />
    </div>
  );
}

export default QRCodeGenerator;
