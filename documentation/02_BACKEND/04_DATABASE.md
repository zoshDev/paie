# Configuration de la Base de Données

## Configuration Générale

La base de données est configurée avec SQLAlchemy et utilise Alembic pour les migrations.

### 1. Configuration de la Base de Données (database.py)

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

SQLALCHEMY_DATABASE_URL = "postgresql+asyncpg://user:password@localhost/paie_db"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=True  # Pour le debugging
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()

# Dépendance pour obtenir une session DB
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

## 2. Configuration Alembic

### Initialisation d'Alembic
```bash
# Installation
pip install alembic

# Initialisation
alembic init migrations
```

### Configuration Alembic (alembic.ini)
```ini
[alembic]
script_location = migrations
sqlalchemy.url = postgresql+asyncpg://user:password@localhost/paie_db

[loggers]
keys = root,sqlalchemy,alembic

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console
qualname =

[logger_sqlalchemy]
level = WARN
handlers =
qualname = sqlalchemy.engine

[logger_alembic]
level = INFO
handlers =
qualname = alembic

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s
datefmt = %H:%M:%S
```

### Script de Migration (env.py)
```python
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from app.models import Base
from app.database import SQLALCHEMY_DATABASE_URL

config = context.config
fileConfig(config.config_file_name)
target_metadata = Base.metadata

def run_migrations_offline():
    url = SQLALCHEMY_DATABASE_URL
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    configuration = config.get_section(config.config_ini_section)
    configuration["sqlalchemy.url"] = SQLALCHEMY_DATABASE_URL
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

## 3. Gestion des Migrations

### Création d'une Migration
```bash
# Création automatique basée sur les modifications des modèles
alembic revision --autogenerate -m "Description de la migration"

# Création manuelle
alembic revision -m "Description de la migration"
```

### Structure Type d'une Migration
```python
"""Description de la migration

Revision ID: abc123def456
Revises: previous_revision_id
Create Date: 2025-07-15 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = 'abc123def456'
down_revision = 'previous_revision_id'
branch_labels = None
depends_on = None

def upgrade():
    # Opérations de mise à jour
    op.create_table(
        'employees',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('matricule', sa.String(), nullable=False),
        sa.Column('nom', sa.String(), nullable=False),
        sa.Column('prenom', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_employees_matricule', 'employees', ['matricule'], unique=True)

def downgrade():
    # Opérations de retour en arrière
    op.drop_index('ix_employees_matricule', 'employees')
    op.drop_table('employees')
```

### Application des Migrations
```bash
# Appliquer toutes les migrations
alembic upgrade head

# Revenir en arrière d'une version
alembic downgrade -1

# Revenir à une version spécifique
alembic downgrade revision_id

# Voir l'historique des migrations
alembic history --verbose
```

## 4. Bonnes Pratiques

1. **Versionnage des Migrations**
   - Toujours inclure les migrations dans le contrôle de version
   - Nommer les migrations de manière descriptive
   - Ne jamais modifier une migration déjà appliquée en production

2. **Sécurité**
   - Ne pas stocker les identifiants de base de données dans les fichiers de configuration
   - Utiliser des variables d'environnement pour les informations sensibles

3. **Sauvegarde**
   - Effectuer une sauvegarde avant d'appliquer des migrations
   - Tester les migrations sur un environnement de développement

4. **Tests**
   - Créer des tests pour les migrations
   - Vérifier les downgrades fonctionnent correctement
