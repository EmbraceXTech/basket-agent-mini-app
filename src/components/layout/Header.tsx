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
    <div className="flex items-center justify-between relative backdrop-blur-md mb-4">
      <div className="w-[30px]">
        {left ? <Fragment>{left}</Fragment> : null}
      </div>
      <h1 className="text-lg font-meduim text-center">{title}</h1>
      <div className="w-[30px] flex justify-end">
        {right ? <Fragment>{right}</Fragment> : null}
      </div>
    </div>
  );
}
