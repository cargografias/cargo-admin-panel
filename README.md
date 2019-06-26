========================
Cargografias Admin Panel
========================

Admin panel to manage and update cargografias.org instances.

Styles by Almsaeed Studio.

Requerimientos
==============


### Que software tenes que instalar?


Antes de empezar, asegurate tener los siguientes programas instalados.
* [Node.js]
* [MongoDB]
* [Bower]


Setup
=========

### Como empezar?

* Instala todas dependencias de NodeJS. Utilizando el comando en la carpeta principal del repositorio. 

```bash
$ npm install
```

* Instala todas las dependencias del FrontEnd. Utilizando el comando en la carpeta principal del repositorio. 

```bash
$ bower install
```

Nota: Si bower da un error relacionado con /public, se puede superar el problema creando un link simbólico desde /public/javascripts a cargo-admin-panel/public/javascirpts

* Crea un archivo .env en tu root, Podes utilizar (env.example)[https://github.com/cargografias/cargo-admin-panel/blob/master/env.example] como guia.



* Crea el usuario default en la base con 

```bash
$ node createAdminUser.js
```

* Inicia el servidor nodejs utilizando el comando

```bash
$  node app.js 
```

* Abri tu navegador en 'http://localhost:3003' y navega.



Setup Cargografias
========================

Este proyecto requiere para funcionar que tengas una instancia de cargografias andando en local.
Para instalarla, segui las instrucciones de 
https://github.com/cargografias/cargografias

Setup Cargografias Loader
========================
El admin panel requiere que se suba informacion parametrizada desde el formato spreeadshet de cargografias a una instancia de POPIT
para mas informacion
https://github.com/cargografias/cargografias-popit-loader

Actualmene la unica plataforma Popit abierta es http://popit.parlamentoabierto.org.py/


Active Collaborators
=======
* [Martín Rabaglia] 
* [Andres Snitcofsky] 
* [Daniel Calligaro]

