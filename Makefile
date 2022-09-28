all:
	docker-compose up --build -d
 
build: 
	docker-compose build --no-cache

re: clean-docker build all
	docker-compose up -d

restart: stop all

test:
	docker-compose rm test-db -s -f -v
	docker-compose up test-db -d
	docker exec -it back sh -c "npm run test:e2e"

down:
	docker-compose down

stop:
	docker-compose stop

clean-docker:
	docker system prune -a

log-back:
	docker logs back -f

log-db:
	docker logs db -f

enter-back:
	docker exec -it back sh

enter-db:
	docker exec -it db sh

enter-front:
	docker exec -it front sh

test-prisma-studio:
	docker exec -it back sh -c 'npx dotenv -e .env.test -- prisma studio'
	#docker exec -it back sh -c 'npm run test-studio'

prisma-studio:
	docker exec -it back sh -c 'npx prisma studio'

# FOR axaidan ONLY
postgre-stop:
	service postgresql stop

# FOR axaidan ONLY
perms-back:
	docker exec -it back "chmod -R 777 ."

react-cmd:
	npx create-react-app ./ --template typescript
