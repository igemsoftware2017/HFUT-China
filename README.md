#BioDesigner Coral - IGEM HFUT Software 2017

##System Introduction

For biologists, it is quite frustrating to find suitable BioBricks and collect useful genetic information in large volumes of literature. Now with BioDesigner Coral, biologists can search BioBricks, design with the help of recommendations and   obtain genetic information of BioBricks in a more comprehensive way. It can analyze user's design, then give recommendations about parts they may need. Through analysis of massive literature, we find useful information about genes, BioBricks, and the relations between genes. All genetic information will be exhibited in a network graph through visualization method to help users understand and use them better. Clicking on the nodes in the network, which represent genes or BioBricks, users can obtain relatively accurate information about related genes, corresponding protein, and relevant literature. We hope BioDesigner Coral can relieve the arduous work in labs and give inspirations to synthetic biologists.

##Structure of the project

+ `biosearch: ` Wiki search function
+ `accounts: ` User information management, such as register, login and so on.
+ `geneRelationship: ` Functions related to gene.
+ `projectManage: ` Functions related to project. such as create a new project, delete a project, create a new device and so on.
+ `system: ` Show the relationships bettween parts or compounds by visualization.
+ `static: ` source files of front-end.
+ `utils: ` Some tool functions.
+ `data: ` Some data used in the system.

##System Environments Requires

+ Python 3
+ Java version "1.8.0_20" or later
+ pip 1.5.6 or later
+ MySQL 5.6.20 or later
+ Mongodb 3.2.10 or later

##Pachage Requires

+ Django
+ elasticsearch
+ mysql-python
+ Pillow
+ pymongo

##Install docker

+ Please make sure that you have installed docker and run it fisrt.

+ $ sudo apt-get update
+ $ sudo apt-get install docker

## install docker-compose

+ $ sudo curl -L https://github.com/docker/compose/releases/download/1.16.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
+ $ sudo chmod +x /usr/local/bin/docker-compose

## run a new container

+ $ git pull (the url of docker)
+ $ cd docker
+ $ sudo docker-compose up --build

### Enter http://127.0.0.1 in a browser to see the application running.