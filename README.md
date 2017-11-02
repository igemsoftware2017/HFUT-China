# BioDesigner Dolphin - IGEM HFUT Software 2017

## System Introduction

In iGEM, competitors always have a hard time finding helpful information. However, with the help of BioDesigner Dolphin now, competitors do not have to worry about the problem mentioned above and they just need to type what they are looking for into the searching box of BioDesigner, then the results will be exhibited as expected. What’s more, BioDesigner also integrates a design panel in which competitors can design their own biobricks conveniently. To further spark their inspiration, we also provide the recommended biobricks for users. Users can also find a gene relationship shown in a big relationship map in BioDesigner which can help to find relationships among genes quickly and easily. Chemical compounds and relationships among them can also be retrieved using BioDesigner. Papers and diseases related to these compounds are also presented. We sincerely hope BioDesigner Dolphin can help iGEMers and synthetic biologists.

## Structure of the project

+ `biosearch: ` Wiki search function
+ `accounts: ` User information management, such as register, login and so on.
+ `geneRelationship: ` Functions related to gene.
+ `projectManage: ` Functions related to project. such as create a new project, delete a project, create a new device and so on.
+ `system: ` Show the relationships bettween parts or compounds by visualization.
+ `static: ` source files of front-end.
+ `utils: ` Some tool functions.
+ `data: ` Some data used in the system.

## System Environments Requires

+ Python 3
+ Java version "1.8.0_20" or later
+ pip 1.5.6 or later
+ MySQL 5.6.20 or later
+ Mongodb 3.2.10 or later

## Pachage Requires

+ Django
+ elasticsearch
+ mysql-python
+ Pillow
+ pymongo

## Install docker

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