# Pages Frontend

## Structure des Pages

Les pages sont organisées de manière modulaire, chacune représentant une vue principale de l'application.

## 1. Page de Connexion (LoginPage)

```typescript
// LoginPage.tsx
const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      // Gestion des erreurs
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm onSubmit={handleSubmit} />
    </div>
  );
};
```

## 2. Tableau de Bord (DashboardPage)

```typescript
// DashboardPage.tsx
const DashboardPage: React.FC = () => {
  const { data: stats } = useQuery('dashboardStats', getDashboardStats);
  
  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Tableau de Bord" 
        description="Vue d'ensemble du système de paie"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Employés"
          value={stats?.employeeCount}
          icon={<UserIcon />}
        />
        <StatCard
          title="Fiches de Paie"
          value={stats?.payslipCount}
          icon={<DocumentIcon />}
        />
        <StatCard
          title="Masse Salariale"
          value={stats?.totalPayroll}
          icon={<CurrencyIcon />}
          format="currency"
        />
      </div>
      
      {/* Autres sections du tableau de bord */}
    </div>
  );
};
```

## 3. Gestion des Employés (ProfilPaieListPage)

```typescript
// ProfilPaieListPage.tsx
const ProfilPaieListPage: React.FC = () => {
  const {
    profilsPaie,
    searchTerm,
    setSearchTerm,
    selectedIds,
    isAllSelected,
    toggleSelectedId,
    toggleAllSelected,
    clearSelection,
    modalMode,
    selectedProfil,
    openModal,
    closeModal,
    onDeleteConfirm,
    isLoading
  } = useProfilPaiePage();

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Liste des Profils de Paie"
        description="Gérer les profils de paie"
      >
        <ProfilPaieToolbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onAdd={() => openModal(null, "create")}
          onImport={() => handleImport()}
          onExport={() => handleExport()}
        />
      </PageHeader>

      <ProfilPaieTable
        profilsPaie={profilsPaie}
        selectedIds={selectedIds}
        toggleSelectedId={toggleSelectedId}
        toggleAllSelected={toggleAllSelected}
        clearSelection={clearSelection}
        isAllSelected={isAllSelected}
        onView={(p) => openModal(p, "view")}
        onEdit={(p) => openModal(p, "edit")}
        onDelete={(p) => openModal(p, "delete")}
        onDuplicate={(p) => openModal(p, "duplicate")}
        onBulkDelete={() => openModal(null, "bulk-delete")}
      />

      <ProfilPaieModals
        modalMode={modalMode}
        selectedProfil={selectedProfil}
        selectedIds={selectedIds}
        onClose={closeModal}
        onSubmit={handleSubmit}
        onDeleteConfirm={onDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
```

## 4. Gestion des Rubriques (RubriquesPage)

```typescript
// RubriquesPage.tsx
const RubriquesPage: React.FC = () => {
  const {
    rubriques,
    createRubrique,
    updateRubrique,
    deleteRubrique
  } = useRubriques();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit' | 'delete';
    selectedRubrique?: Rubrique;
  }>({
    isOpen: false,
    mode: 'create'
  });

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Rubriques de Paie"
        description="Gérer les rubriques de calcul de paie"
      >
        <Button
          onClick={() => setModalState({ isOpen: true, mode: 'create' })}
          icon={<PlusIcon />}
        >
          Nouvelle Rubrique
        </Button>
      </PageHeader>

      <DataTable
        data={rubriques}
        columns={[
          { key: 'code', label: 'Code' },
          { key: 'nom', label: 'Nom' },
          { key: 'type', label: 'Type' },
          // ...autres colonnes
        ]}
        actions={[
          {
            label: 'Modifier',
            onClick: (rubrique) => setModalState({
              isOpen: true,
              mode: 'edit',
              selectedRubrique: rubrique
            })
          },
          {
            label: 'Supprimer',
            onClick: (rubrique) => setModalState({
              isOpen: true,
              mode: 'delete',
              selectedRubrique: rubrique
            })
          }
        ]}
      />

      <RubriqueModal
        {...modalState}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
```

## 5. Génération de Fiches de Paie (FichePaiePage)

```typescript
// FichePaiePage.tsx
const FichePaiePage: React.FC = () => {
  const { id } = useParams();
  const { data: fichePaie, isLoading } = useFichePaie(id);
  const { generatePDF } = usePayslipPDF();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Fiche de Paie"
        description={`Période: ${fichePaie?.periode}`}
      >
        <Button
          onClick={() => generatePDF(fichePaie)}
          icon={<DownloadIcon />}
        >
          Télécharger PDF
        </Button>
      </PageHeader>

      <div className="bg-white shadow-md rounded-lg p-6">
        <EmployeeInfo employee={fichePaie?.employee} />
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Détail des Rubriques</h3>
          <RubriquesTable rubriques={fichePaie?.lignes_paie} />
        </div>
        
        <div className="mt-6">
          <SalaryTotals
            brutSalary={fichePaie?.salaire_brut}
            deductions={fichePaie?.total_retenues}
            netSalary={fichePaie?.salaire_net}
          />
        </div>
      </div>
    </div>
  );
};
```

## 6. Configuration (SettingsPage)

```typescript
// SettingsPage.tsx
const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useSettings();
  
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Paramètres"
        description="Configuration du système de paie"
      />
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">
            Paramètres Généraux
          </h3>
          <SettingsForm
            settings={settings}
            onSubmit={updateSettings}
          />
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold mb-4">
            Configuration Email
          </h3>
          <EmailSettingsForm
            settings={settings?.email}
            onSubmit={updateEmailSettings}
          />
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold mb-4">
            Modèles de Document
          </h3>
          <DocumentTemplateSettings
            templates={settings?.templates}
            onUpdate={updateTemplate}
          />
        </Card>
      </div>
    </div>
  );
};
```

## Routage

```typescript
// App.tsx
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/employees" element={<ProfilPaieListPage />} />
              <Route path="/rubriques" element={<RubriquesPage />} />
              <Route path="/fiches-paie" element={<FichePaieListPage />} />
              <Route path="/fiches-paie/:id" element={<FichePaiePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};
```
