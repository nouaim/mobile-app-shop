run:
	npx expo start

runssr:
	npm run dev:ssr

test:
	npx cypress run --browser chrome 

testui:
	npx cypress open --browser chrome --e2e 

check:
	npm run check

format:
	npm run format

mergem:
	git push origin develop
	git checkout master
	git pull origin master --no-edit
	git merge develop --no-edit
	git push origin master
	git checkout develop

	
setup:
	sudo apt update
	sudo apt install -y nodejs
	sudo npm install -g @angular/cli
	npm run prepare
	@make install


install:
	npm install

deploy:
	sudo git reset --hard
	sudo git checkout master
	sudo git pull origin master
	sudo npm install --verbose --force
	sudo ng build --configuration $(ENV)
# sudo docker compose -f docker-compose-$(ENV).yml up --build -d

