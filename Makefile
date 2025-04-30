build:
	docker build -t phpapp .

run:
	docker run -d -p 8000:80 --name phpapp phpapp

clear:
	docker stop phpapp
	docker rm phpapp
	docker rmi phpapp