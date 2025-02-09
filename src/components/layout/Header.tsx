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
    <div className="flex items-center justify-between relative my-2">
      {left ? <Fragment>{left}</Fragment> : <div></div>}
      <h1 className="text-xl absolute left-1/2 transform -translate-x-1/2">{title}</h1>
      {right ? <Fragment>{right}</Fragment> : <div></div>}
    </div>
  );
}
