import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

interface SelectContentProps {
    children: React.ReactNode;
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    children: React.ReactNode;
}

interface SelectValueProps {
    placeholder?: string;
}

const SelectContext = React.createContext<{
    value?: string;
    onValueChange?: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}>({
    isOpen: false,
    setIsOpen: () => {},
});

const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
            <div className="relative">
                {children}
            </div>
        </SelectContext.Provider>
    );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
    ({ className = '', children, ...props }, ref) => {
        const { isOpen, setIsOpen } = React.useContext(SelectContext);

        return (
            <button
                ref={ref}
                type="button"
                className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
                onClick={() => setIsOpen(!isOpen)}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
        );
    }
);
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
    const { isOpen, setIsOpen } = React.useContext(SelectContext);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    if (!isOpen) return null;

    return (
        <div
            ref={contentRef}
            className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg"
        >
            <div className="p-1">
                {children}
            </div>
        </div>
    );
};

const SelectItem: React.FC<SelectItemProps> = ({ value, children, className = '', ...props }) => {
    const { onValueChange, setIsOpen } = React.useContext(SelectContext);

    const handleClick = () => {
        onValueChange?.(value);
        setIsOpen(false);
    };

    return (
        <div
            className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-3 pr-2 text-sm hover:bg-gray-100 focus:bg-gray-100 ${className}`}
            onClick={handleClick}
            {...props}
        >
            {children}
        </div>
    );
};

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
    const { value } = React.useContext(SelectContext);

    return (
        <span>
      {value || <span className="text-gray-500">{placeholder}</span>}
    </span>
    );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };