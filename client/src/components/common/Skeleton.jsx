const Skeleton = ({ className = '', variant = 'text', lines = 1 }) => {
  if (variant === 'circle') {
    return <div className={`skeleton rounded-full ${className}`} />;
  }

  if (variant === 'rect') {
    return <div className={`skeleton ${className}`} />;
  }

  // Text variant — renders multiple lines
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-4 ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          } ${className}`}
        />
      ))}
    </div>
  );
};

export default Skeleton;
