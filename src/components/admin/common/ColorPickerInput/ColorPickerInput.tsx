import React, { useState, useEffect, type ChangeEvent } from 'react';
import { ColorPickerWrapper, NativeColorInput, HexInput } from './ColorPickerInput.styles';

interface ColorPickerInputProps {
  id?: string;
  initialColor?: string; // e.g., '#RRGGBB'
  onChange: (color: string) => void;
  disabled?: boolean;
  className?: string;
}

const isValidHexColor = (hex: string): boolean => /^#[0-9A-F]{6}$/i.test(hex) || /^#[0-9A-F]{3}$/i.test(hex);


const ColorPickerInput: React.FC<ColorPickerInputProps> = ({
  id,
  initialColor = '#FFFFFF',
  onChange,
  disabled = false,
  className,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(initialColor);
  const [hexInputValue, setHexInputValue] = useState<string>(initialColor);

  useEffect(() => {
    // Ensure component updates if initialColor prop changes from outside
    if (isValidHexColor(initialColor)) {
        setSelectedColor(initialColor);
        setHexInputValue(initialColor);
    } else if (initialColor === '' && selectedColor !== '') { // Allow clearing
        setSelectedColor('#FFFFFF'); // Default color for picker if input is cleared but was valid
        setHexInputValue('');
    }
  }, [initialColor]);

  const handleNativeColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value; // Always #RRGGBB format
    setSelectedColor(newColor);
    setHexInputValue(newColor);
    onChange(newColor);
  };

  const handleHexInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newHex = event.target.value;
    setHexInputValue(newHex);
    if (isValidHexColor(newHex)) {
      setSelectedColor(newHex);
      onChange(newHex);
    }
    // If user types invalid hex, we don't update selectedColor or call onChange
    // until it's valid, but the input field reflects their typing.
  };

  const handleHexInputBlur = () => {
    // On blur, if hex input is invalid, revert it to the last valid selectedColor
    if (!isValidHexColor(hexInputValue)) {
      setHexInputValue(selectedColor);
    }
    // Or, if it was meant to be empty to clear (and that's allowed), handle that:
    // if (hexInputValue === '' && allowEmpty) { onChange(''); }
  };


  return (
    <ColorPickerWrapper className={className}>
      <NativeColorInput
        id={id}
        value={selectedColor} // Native picker shows the current valid color
        onChange={handleNativeColorChange}
        disabled={disabled}
        title="Select Color"
      />
      <HexInput
        value={hexInputValue} // Text input shows what user is typing or last valid color
        onChange={handleHexInputChange}
        onBlur={handleHexInputBlur}
        placeholder="#RRGGBB"
        maxLength={7}
        disabled={disabled}
        aria-label="Hex color input"
      />
    </ColorPickerWrapper>
  );
};

export default ColorPickerInput;