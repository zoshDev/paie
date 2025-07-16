const sections = [
  {
    title: "Élément de Salaire",
    columns: 2,
    fields: [
      { name: "libelle", label: "Libellé", type: "text" },
      { name: "type_element", label: "Type", type: "select", options: [
        { label: "Prime", value: "prime" },
        { label: "Retenue", value: "retenue" },
      ] },
      { name: "nature", label: "Nature", type: "select", options: [
        { label: "Fixe", value: "fixe" },
        { label: "Variable", value: "variable" },
      ] },
      { name: "imposable", label: "Imposable", type: "checkbox" },
      { name: "soumisCnps", label: "Soumis à la CNPS", type: "checkbox" },
      { name: "partEmploye", label: "Part Employé", type: "checkbox" },
      { name: "partEmployeur", label: "Part Employeur", type: "checkbox" },
      { name: "prorataBase", label: "Prorata Base", type: "number" },
      { name: "processCalculJson", label: "Processus de Calcul (JSON)", type: "text" },
    ],
  },
];
