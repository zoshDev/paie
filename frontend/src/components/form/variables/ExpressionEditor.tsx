// src/components/form/ExpressionEditor.tsx
import React, { useState, useRef, useEffect } from 'react'; // Ajout de useEffect ici
// import { calculService } from '@/services/calculService'; // Supprimé car non disponible pour l'instant
// import { InformationCircleIcon } from '@heroicons/react/24/outline'; // Supprimé car non utilisé dans le JSX actuel

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
  // const lastChangeTime = useRef(Date.now()); // Supprimé car lié au debounce de validation

  // Debounce pour la validation backend - Supprimé car calculService n'est pas disponible
  /*
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (value.trim()) {
        try {
          const res = await calculService.validateFormula(value);
          setValidationStatus(res);
        } catch (err) {
          setValidationStatus({ isValid: false, error: "Erreur de connexion à la validation." });
        }
      } else {
        setValidationStatus(null);
      }
    }, 700); // Valider après 700ms d'inactivité

    return () => clearTimeout(handler);
  }, [value]);
  */

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
      setSuggestions([]); // Réinitialise les suggestions si pas de mot
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
        // Remplace le mot partiel par la suggestion complète
        const startOfWord = lastWordMatch.index;
        newValue = value.substring(0, startOfWord) + suggestion + value.substring(cursorPosition);
      } else {
        // Ajoute la suggestion si pas de mot partiel
        newValue = value.substring(0, cursorPosition) + suggestion + value.substring(cursorPosition);
      }
      
      onChange(newValue);
      setShowSuggestions(false);
      // Optionnel: repositionner le curseur après l'insertion
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = cursorPosition + suggestion.length - (lastWordMatch ? lastWordMatch[1].length : 0);
        }
      }, 0);
    }
  };

  // Logique de coloration syntaxique (simplifiée pour l'exemple)
  // Une implémentation réelle utiliserait un parser plus robuste ou une librairie
  // Cette fonction est maintenue mais son affichage est commenté dans le JSX
  const renderHighlightedText = (text: string) => {
    // Remplacer les opérateurs par des spans stylisées
    let highlightedText = text
      .replace(/(\+|\-|\*|\/|\(|\)|==|!=|>|<|>=|<=| ET | OU )/g, '<span class="text-blue-600 font-bold">$1</span>');

    // Surligner les variables connues
    availableVariables.forEach(variable => {
      const regex = new RegExp(`\\b(${variable})\\b`, 'g'); // \b pour mots entiers
      highlightedText = highlightedText.replace(regex, '<span class="text-purple-600 font-semibold">$1</span>');
    });

    return <div dangerouslySetInnerHTML={{ __html: highlightedText }} className="whitespace-pre-wrap font-mono text-sm" />;
  };

  return (
    <div className={`relative w-full ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInputChange}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Masquer après un court délai
        onFocus={() => {
          // Afficher les suggestions si le champ n'est pas vide et qu'il y a des variables disponibles
          if (availableVariables.length > 0) { // Simplifié car pas de validation de trim ici
            setSuggestions(availableVariables.filter(v => v.toLowerCase().startsWith(value.toLowerCase())));
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        rows={4}
        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200
          border-gray-300 // Style par défaut sans validation
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        style={{ fontFamily: 'monospace' }} // Pour une meilleure lisibilité des formules
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={s}
              onMouseDown={(e) => e.preventDefault()} // Empêche le blur du textarea
              onClick={() => handleSuggestionClick(s)}
              className="px-3 py-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {/* Validation status UI removed as calculService is not present */}
      {/*
      {validationStatus && (
        <div className={`mt-2 flex items-center gap-2 text-sm ${validationStatus.isValid ? 'text-green-600' : 'text-red-600'}`}>
          {validationStatus.isValid ? (
            <CheckCircleIcon className="h-5 w-5" />
          ) : (
            <XCircleIcon className="h-5 w-5" />
          )}
          <span>{validationStatus.isValid ? 'Formule valide' : validationStatus.error || 'Erreur de validation'}</span>
        </div>
      )}
      */}

      {/* Optionnel: Affichage stylisé de la formule pour la coloration syntaxique */}
      {/* <div className="mt-2 p-2 border border-gray-200 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white">
        {renderHighlightedText(value)}
      </div> */}
    </div>
  );
};

export default ExpressionEditor;
