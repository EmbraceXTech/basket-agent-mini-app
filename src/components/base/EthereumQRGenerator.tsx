import { QRCodeCanvas } from "qrcode.react";
// import {
//   generateEIP681URI,
//   generateNativeTokenURI,
// } from "@/utils/encodeEthURI.util";

function QRCodeGenerator({
  tokenAddress,
  toAddress,
  chainId,
  isNativeToken = true,
}: {
  amount?: string;
  tokenAddress?: string;
  toAddress: string;
  chainId: string;
  isNativeToken?: boolean;
}) {
  // const eip681URI = isNativeToken
  //   ? generateNativeTokenURI({
  //       amount: amount || "0",
  //       toAddress,
  //       chainId: parseInt(chainId),
  //     })
  //   : generateEIP681URI({
  //       tokenAddress: tokenAddress || "",
  //       toAddress,
  //       amount: amount || "0",
  //       chainId: parseInt(chainId),
  //     });
  // console.log(eip681URI);
  const deeplink = isNativeToken
    ? `https://metamask.app.link/send/${toAddress}@${chainId}`
    : `https://metamask.app.link/send/pay-${tokenAddress}@${chainId}/transfer?address=${toAddress}`;
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <QRCodeCanvas value={deeplink} size={200} />
    </div>
  );
}

export default QRCodeGenerator;
