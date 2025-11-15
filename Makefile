INFRA_DIR=infra
BACKEND_DIR=backend
FRONTEND_DIR=frontend

.PHONY: up down ps logs backend frontend prisma-migrate prisma-generate db-shell

# --- Docker / Infra ---

up:
	cd $(INFRA_DIR) && docker-compose up -d

down:
	cd $(INFRA_DIR) && docker-compose down

ps:
	cd $(INFRA_DIR) && docker-compose ps

logs:
	cd $(INFRA_DIR) && docker-compose logs -f

# --- Backend (NestJS + Prisma) ---

backend:
	cd $(BACKEND_DIR) && npm run start:dev

prisma-migrate:
	cd $(BACKEND_DIR) && npx prisma migrate dev

prisma-generate:
	cd $(BACKEND_DIR) && npx prisma generate

db-shell:
	psql postgresql://$${POSTGRES_USER:-dfp_user}:$${POSTGRES_PASSWORD:-dfp_password}@localhost:5432/$${POSTGRES_DB:-dfp_db}

# --- Frontend (Vite) ---

frontend:
	cd $(FRONTEND_DIR) && npm run dev