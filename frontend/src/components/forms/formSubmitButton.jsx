export default function FormSubmitButton({ children, disabled = false, ...props }) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="w-full rounded-md bg-green-500 px-4 py-3 text-white font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            {...props}
        >
            {children}
        </button>
    );
}
