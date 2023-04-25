import React, { HTMLAttributes } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import slugify from 'slugify';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import CaretDownIcon from './icons/CaretDownIcon';
import CheckIcon from './icons/CheckIcon';

type SettingProps = {
  name: string;
  selected: { label: string; value: string };
  options: { label: string; value: string }[];
  disabled?: boolean;
  status?: 'loading' | 'error' | 'success' | 'idle';
  onChecked: (value: string) => void;
} & HTMLAttributes<HTMLDivElement>;

export default function SettingDropdown({
  name,
  selected,
  options,
  disabled = false,
  className,
  children,
  status,
  onChecked,
}: SettingProps) {
  const id = slugify(name);

  return (
    <section className={className}>
      <div className="flex space-x-2">
        <DropdownMenu.Root aria-labelledby={id}>
          <DropdownMenu.Trigger
            className="default-focus input flex h-7 items-center rounded text-base font-semibold hover:bg-gray-50 sm:p-1"
            aria-label="Theme Options"
          >
            <span className="flex space-x-2 text-gray-600">
              {selected.label}
              {status === 'loading' && (
                <LoadingSpinner className="ml-2 h-4 w-4" />
              )}
            </span>
            <CaretDownIcon className="ml-2 h-4 w-4" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal className="z-50">
            <DropdownMenu.Content className="dropdown z-50 text-gray-800">
              <DropdownMenu.RadioGroup>
                {options.map((option) => (
                  <DropdownMenu.CheckboxItem
                    className="dropdown-item flex items-center pl-6"
                    disabled={disabled}
                    key={option.value}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        onChecked(option.value);
                      }
                    }}
                  >
                    {selected.value === option.value ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <span className="h-4 w-4" />
                    )}
                    <span className="ml-2 text-gray-600">{option.label}</span>
                  </DropdownMenu.CheckboxItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <div className="flex flex-1 flex-col justify-center">
          <h3 className="flex items-center font-semibold leading-6">{name}</h3>
          {children}
        </div>
      </div>
    </section>
  );
}
