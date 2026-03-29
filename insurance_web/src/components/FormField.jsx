export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options,
  rows,
  disabled = false,
}) {
  const baseClass =
    'block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500';
  const borderClass = error ? 'border-red-300' : 'border-gray-300';

  const renderInput = () => {
    if (type === 'select') {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`${baseClass} ${borderClass}`}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options?.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows || 3}
          placeholder={placeholder}
          disabled={disabled}
          className={`${baseClass} ${borderClass}`}
        />
      );
    }

    return (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseClass} ${borderClass}`}
      />
    );
  };

  return (
    <div>
      {label && (
        <label htmlFor={name} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
