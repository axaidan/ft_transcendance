#!/bin/bash

cp backend/package.json backend/save_package.json

sed -i "s+\"ts-node prisma.*+\"ts-node prisma/$1\"+g" backend/package.json

docker exec -it back  npx prisma migrate reset

