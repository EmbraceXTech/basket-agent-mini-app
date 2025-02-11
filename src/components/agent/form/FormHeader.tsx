export default function FormHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4 mt-3">
      <h2 className="text-xl font-meduim">{title}</h2>
      <p className="text-sm text-secondary-text mt-2">{description}</p>
    </div>
  );
}
