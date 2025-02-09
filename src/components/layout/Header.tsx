import { Fragment } from "react/jsx-runtime";

export default function Header({
  title,
  left,
  right,
}: {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between relative bg-white/80 backdrop-blur-md">
      <div className="w-[24px]">
        {left ? <Fragment>{left}</Fragment> : null}
      </div>
      <h1 className="text-lg font-semibold text-center flex-1">{title}</h1>
      <div className="w-[24px] flex justify-end">
        {right ? <Fragment>{right}</Fragment> : null}
      </div>
    </div>
  );
}
