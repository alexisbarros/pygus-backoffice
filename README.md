# Pygus Backoffice

Backoffice of the Pygus app developed with ReactJs.

- [Screens](#screens)
- [Running the project](#running-the-project)
  - [Prerequisites](#prerequisites)
  - [Instalation](#instalation)
  - [Start](#start)
- [Project structure](#project-structure)
  - [/Components](#Components)
  - [/node_modules](#node_modules)
- [/Endpoints](#endpoints)
- [Authors](#authors)

## Screems

<img alt='Login' src="./src/assets/img/screens/screen_login.png">

<img alt='List' src="./src/assets/img/screens/screen_list.png">

<img alt='Form' src="./src/assets/img/screens/screen_form.png">

## Running the project

Follow the instructions below to copy the project and run locally.

### Prerequisites

As prerequisites to run the project is needed to have Node.js and the package manager NPM installed in you machine.

The backend server needs to be runing too. The backend repo can be access [here](https://github.com/alexisbarros/pygus-api.git).

### Instalation

Clone the project with the command:

```sh
$ git clone https://github.com/alexisbarros/pygus-backoffice.git
```

Go to the created folder:

```sh
$ cd pygus-backoffice
```

Install all dependencies:

```sh
$ npm install
```

### Start

With backend server runing, start the project using:

```sh
$ npm start
```

## Project structure

The project is structured as follows:

```
pygus-backoffice/
  public/
  node_modules/
  src/
    Components/
      Home/
      Login/
      TaskForm/
      TaskList/
    env.json
    index.js
    index.css
  package.json
  README.md
```

Below is a breakdown of some project directories.

### /src/Components

Contains all components of the project.

### /node_modules

Contains all the modules installed by NPM.

## Authors

Alexis Barros - [github](https://github.com/alexisbarros)
Rodrigo Ferreira - [github](https://github.com/rodlferreira)
