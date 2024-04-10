const Input = ({
    name,
    children,
    type,
    value,
    onChange,
    fullWidth,
    isGrow,
    userInput,
    disabled,
    required,
    defaultValue,
}) => {
    const inputClassName = `rounded-full border border-stone-200 px-4 py-2
    text-sm text-stone-400 transition-all duration-300 
    placeholder:text-stone-400 focus:outline-none 
    focus:ring focus:ring-yellow-400 md:px-6 md:py-3 
    ${fullWidth ? 'w-full' : ''} ${isGrow ? 'grow' : ''}
    ${userInput ? 'mb-8 w-72' : ''}`

    return (
        <>
            <input
                value={value}
                type={type}
                onChange={onChange}
                className={inputClassName}
                name={name}
                disabled={disabled}
                required={required}
                defaultValue={defaultValue}
            />
            {children}
        </>
    )
}

export default Input
