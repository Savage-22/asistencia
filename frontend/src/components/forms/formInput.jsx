export default function FormInput({
    id,
    name,
    type = 'text',
    autoComplete,
    value,
    onChange,
    placeholder,
    error,
    maxLength,
}) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-sm font-medium text-gray-700 text-left">
                {name}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                autoComplete={autoComplete}
                value={value}
                onChange={onChange}
                placeholder={placeholder || name}
                maxLength={maxLength}
                className={`w-full bg-white rounded-md border-2 px-4 py-3 text-gray-900 placeholder-gray-400 
                    focus:border-green-500 focus:ring-2 focus:ring-green-500
                    ${error ? 'border-red-500' : 'border-green-500'
                    }`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
