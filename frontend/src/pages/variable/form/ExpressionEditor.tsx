// src/components/form/ExpressionEditor.tsx
import React, { useState, useRef, useEffect } from 'react';
// import { calculService } from '@/services/calculService'; // Commenté car non disponible pour l'instant
// import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'; // Commenté si non utilisé

interface ExpressionEditorProps {
  value: string;
  onChange: (value: string) => void;
  availableVariables?: string[]; // Liste des noms de variables disponibles pour l'autocomplétion
  placeholder?: string;
  className?: string; // Pour passer des classes Tailwind
}

const ExpressionEditor: React.FC<ExpressionEditorProps> = ({
  value,
  onChange,
  availableVariables = [],
  placeholder,
  className,
}) => {
  // const [validationStatus, setValidationStatus] = useState<{ isValid: boolean; error?: string } | null>(null); // Supprimé
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Logique d'autocomplétion
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    const lastWordMatch = textBeforeCursor.match(/(\w+)$/); // Cherche le dernier mot

    if (lastWordMatch) {
      const lastWord = lastWordMatch[1];
      const filteredSuggestions = availableVariables.filter(v =>
        v.toLowerCase().startsWith(lastWord.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const textBeforeCursor = value.substring(0, cursorPosition);
      const lastWordMatch = textBeforeCursor.match(/(\w+)$/);
      
      let newValue = value;
      if (lastWordMatch) {
        const startOfWord = lastWordMatch.index;
        newValue = value.substring(0, startOfWord) + suggestion + value.substring(cursorPosition);
      } else {
        newValue = value.substring(0, cursorPosition) + suggestion + value.substring(cursorPosition);
      }
      
      onChange(newValue);
      setShowSuggestions(false);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = cursorPosition + suggestion.length - (lastWordMatch ? lastWordMatch[1].length : 0);
        }
      }, 0);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Masquer après un court délai
        onFocus={() => {
          if (availableVariables.length > 0) {
            setSuggestions(availableVariables.filter(v => v.toLowerCase().startsWith(value.toLowerCase())));
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        rows={4}
        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
          border-gray-300
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        style={{ fontFamily: 'monospace' }}
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSuggestionClick(s)}
              className="px-3 py-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpressionEditor;
