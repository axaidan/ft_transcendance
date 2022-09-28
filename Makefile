all:
	docker-compose up --build -d
 
build: 
	docker-compose build --no-cache

re: clean-docker build all
	docker-compose up -d

restart: stop all

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

perms-back:
	docker exec -it back "chmod -R 777 ."

enter-back:
	docker exec -it back sh

enter-db:
	docker exec -it db sh

enter-front:
	docker exec -it front sh

prisma-studio:
	docker exec -it back sh -c 'npx prisma studio'

# FOR axaidan ONLY
postgre-stop:
	service postgresql stop

react-cmd:
	npx create-react-app ./ --template typescript
