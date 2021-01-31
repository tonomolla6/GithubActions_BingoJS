# GithubActions_BingoJS

## Qué son los GitHub Actions y los flujos de trabajo (workflows)?

GitHub Actions permite crear flujos de trabajo (workflows) que se pueden utilizar para compilar, probar y desplegar código, dando la posibilidad de crear flujos de integración y despliegue continuo dentro del propio repositorio de git.

Los flujos de trabajo tienen que contener al menos un job. Estos incluyen una serie de pasos que ejecutan tareas individuales que pueden ser acciones o comandos. Un flujo de trabajo puede comenzar por distintos eventos que suceden dentro de GitHub, como un push al repositorio o un pull request.

En esta practica vamos a trabajar sobre un proyecto en javascript, Bingo online.

## Conceptos básicos para empezar

Los archivos de workflow deben ser almacenados en la carpeta .github/workflows en formato yaml en la raíz del repositorio.

1. Creamos un archivo llamado bingo_workflow.yml

![Archivo creado en el repositorio de github](/img/img1.png)

2. Le añadimos el nombre a nuestro flujo de trabajo

```yml
name: BINGO WORKFLOW
```

3. Le indicamos que cada vez que detecte un cambio en la rama **githubActions_improvement** ejecute los jobs.

```yml
on:
  push:
    branches:
      - githubActions_improvement
```

Despues de esta configuración para todos los jobs, empezamos la practica.

## Job de verificación de sintaxis correcta

Se denominará **syntax_check_job** y se encargará de realizar la descarga del proyecto y de verificar que la sintaxis utilizada es correcta en los ficheros javascript.

1. Establecemos el nombre del job y le decimos que se inicie en la ultima version de ubuntu

```yml
jobs:
  syntax_check_job:
    name: syntax_check_job
    runs-on: ubuntu-latest
```

2. Asignamos los pasos que debe de realizar nuestro job.
   **Checkout repository** - Este paso desprotege su repositorio en $ GITHUB*WORKSPACE, para que su flujo de trabajo pueda acceder a él. Solo se obtiene una única confirmación de forma predeterminada.
   **Linter execution** - Ejecuta el verificador de javascript de nuestro proyecto, configurado en *.eslintrc.js\_.

```yml
steps:
 - name: Checkout repository
 uses: actions/checkout@v2
 - name: Linter execution
 uses: github/super-linter@v3
  env:
   DEFAULT_BRANCH: githubActions_improvement
   GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   LINTER_RULES_PATH: /
   JAVASCRIPT_ES_CONFIG_FILE: .eslintrc.js
   VALIDATE_JAVASCRIPT_ES: true
```

Nota: Para que no analice los js que hay en doc del worflow ni los js de testing los añadimos a _.eslintignore_.

```sh
doc
*.test.js
```

Hacemos un push a la rama que hemos indicado anteriormente y comprobamos que el job se ejecuta correctamente.

![Job de verificación de sintaxis correcta](/img/img2.png)

## Job de ejecución de tests

Se denominará **test_execution_job**, como en nuestra aplicación del Bingo disponemos de una batería de tests, se
encargará de ejecutarlos y verificar que todos funcionan como se esperaba.

1. Establecemos el nombre del job y le decimos que se inicie en la ultima version de ubuntu.

```yml
jobs:
  test_execution_job:
    name: test_execution_job
    runs-on: ubuntu-latest
```

2. Asignamos los pasos que debe de realizar nuestro job.
   **Checkout repository** - Este paso desprotege su repositorio en $ GITHUB*WORKSPACE, para que su flujo de trabajo pueda acceder a él. Solo se obtiene una única confirmación de forma predeterminada.
   **Run jest tests** - Este paso instala las dependencias necesarias para ejecutar el codigo, busca todos los archivos js \*\*.test.js* y los ejecuta para validar que el bingo funciona correctamente.

```yml
steps:
  - name: Checkout repository
    uses: actions/checkout@v2
  - name: Run jest tests
    run: npm install; npm test
```

Hacemos un push a la rama que hemos indicado anteriormente y comprobamos que el job se ejecuta correctamente.

![Job de verificación de sintaxis correcta](/img/img3.png)

## Job de generación de estáticos

Se denominará **build_statics_job**, este job será el encargado de realizar el proceso de compilado del proyecto. Se realizará siempre que hayan terminado los 2 jobs anteriores y depositará los artefactos generados en la ruta build.

1. Establecemos el nombre del job y le decimos que se inicie en la ultima version de ubuntu, esta vez le diremos que sin el job de syntax_check_job y test_execution_job no se ejecute.

```yml
jobs:
  build_statics_job:
    name: build_statics_job
    runs-on: ubuntu-latest
    needs: [syntax_check_job, test_execution_job]
```

2. Asignamos los pasos que debe de realizar nuestro job.
   **Checkout repository** - Este paso desprotege su repositorio en $ GITHUB\*WORKSPACE, para que su flujo de trabajo pueda acceder a él. Solo se obtiene una única confirmación de forma predeterminada.
   **Build code** - Este paso crea el proyecto minificado en la carpeta build.
   **Generate artifacts** - Esto carga artefactos de su flujo de trabajo, lo que le permite compartir datos entre trabajos y almacenar datos una vez que se completa un flujo de trabajo. (Seleccionamos la carpeta donde esta el proyecto minificado.)

```yml
steps:
  - name: Checkout code
    uses: actions/checkout@v2
  - name: Build code
    run: npm install; npm run buildDev
  - name: Generate artifacts
    uses: actions/upload-artifact@v2
    with:
      name: artifact
      path: ./build
```

Hacemos un push a la rama que hemos indicado anteriormente y comprobamos que el job se ejecuta correctamente.

![Job de verificación de sintaxis correcta](/img/img4.png)

## Job de despliegue de los estáticos generados

Se denominará **deploy_job**, partiendo de los estáticos generados en el job anterior (por eso siempre se ejecutará tras el job anterior), desplegará el proyecto en surge.sh. Por supuesto, necesitará configurar una serie de variables de entorno algunas de las cuales, al contener valores comprometidos, serán secrets de nuestro repositorio github.

1. Establecemos el nombre del job y le decimos que se inicie en la ultima version de ubuntu, le diremos que sin el job anterior build_statics_job no se ejecute ya que lo que genera los hace falta para subirlo a surge.sh.

```yml
jobs:
  deploy_job:
    runs-on: ubuntu-latest
    needs: build_statics_job
```

2. Asignamos los pasos que debe de realizar nuestro job.
   **Artifact download** - Este paso descarga artefactos de nuestro proyecto minificado del job anterior.
   **Surge upload** - Despues de descargar los artefactos subimos el proyecto minificado a la surge.hs, le tenemos que especificar la configuracion.

   - domain: Donde vamos a subir nuestro proyecto
   - project: Los archivos que vamos a subir, en este caso los artefactos.
   - login: El email registrado en surge.sh
   - token: El email generado con surge para validar las subidas.
     ![Token generado desde terminal](/img/img5.png)

   Como son cosas que deberiamos ocultar para que nadie pueda robarnos la identidad lo vamos a añadir a nuestro repositorio de github, Settings -> Secrets.

   ![Token generado desde terminal](/img/img6.png)

```yml
steps:
  - name: Artifact download
    uses: actions/download-artifact@v2
    with:
      name: artifact
  - name: Surge upload
    uses: dswistowski/surge-sh-action@v1
    with:
      domain: tonomolla6.surge.sh
      project: .
      login: ${{ secrets.SURGE_EMAIL }}
      token: ${{ secrets.SURGE_TOKEN }}
```

Hacemos un push a la rama que hemos indicado anteriormente y comprobamos que el job se ejecuta correctamente.

![Job de despliegue de los estáticos generados](/img/img7.png)

Vamos a http://tonomolla6.surge.sh/ para comprobar que se ha subido correctamente.

![http://tonomolla6.surge.sh/](/img/img8.png)

## Job de envío de notificación a los usuarios del proyecto

Se denominará **notification_job** y ejecutará una action propia basada en Javascript. Se ejecutará siempre (aunque se
haya producido un error en algún job previo), y se encargará de enviar un correo con:

**Destinatario** dirección de correo vuestra personal tomada de un secret de github
**Asunto** Resultado del workflow ejecutado
**Cuerpo del mensaje**

```txt
Se ha realizado un push en la rama githubActions_improvement que
ha provocado la ejecución del workflow Bingo_Workflow con los
siguientes resultados:

- syntax_check_job: resultado asociada
- test_execution_job: resultado asociada
- build_statics_job: resultado asociada
- deploy_job: resultado asociada
```

1. Establecemos el nombre del job y le decimos que se inicie en la ultima version de ubuntu.

```yml
jobs:
  notification_job:
    name: notification_job
    runs-on: ubuntu-latest
```

2. Vamos a decirle a nuestro job que se ejecutara despues de que todos los jobs anteriores hayan acabado, hayan salido bien o mal.

```yml
needs: [syntax_check_job, test_execution_job, build_statics_job, deploy_job]
if: ${{ always() }}
```

3. Asignamos los pasos que debe de realizar nuestro job.
   **Checkout repository** - Este paso desprotege su repositorio en $ GITHUB\*WORKSPACE, para que su flujo de trabajo pueda acceder a él. Solo se obtiene una única confirmación de forma predeterminada.
   **Run action** - Este paso ejecuta el action que vamos a crear, enviara el correo que nos pide la practica. - uses: Ruta donde estara nuestro action.
   Vamos a pasarle variables de contexto para configurar la libreria de correo. - user: Email del correo de gmail que se logeara para enviar los mails. - pass: Contraseña del email del correo anterior. - email_destination: Dirección de email que recibira el correo. - otros: Son los estados de los jobs anteriores, para que aparezcan en el correo.

```yml
steps:
    - name: Checkout code
        uses: actions/checkout@v2
      - name: Run action
        uses: ./.github/actions/send_email
        with:
          user: ${{ secrets.EMAIL_USERNAME }}
          pass: ${{ secrets.EMAIL_PASSWORD }}
          email_destination: ${{ secrets.EMAIL_DESTINATION }}
          syntax_check_job: ${{ needs.syntax_check_job.outputs.job-status }}
          test_execution_job: ${{ needs.test_execution_job.outputs.job-status }}
          build_statics_job: ${{needs.build_statics_job.outputs.job-status}}
          deploy_job: ${{ needs.deploy_job.outputs.job-status }}
```

4. Vamos a configurar el action.yml.
   4.1 Creamos los siguientes directorios _.github/actions/send_mail_
   4.2 Creamos un archivo action.yml
   4.3 Establecemos el nombre, la descripcion y añadimos todos los inputs que vamos a utilizar en javascript (Los que enviamos desde el workflow).
   4.4 Configuramos runs para que ejecute nuestro javascript minifacado.

```yml
name: "send_email"
description: "send_email_information"

inputs:
  user:
    description: "email_username"
    required: true
  pass:
    description: "email_password"
    required: true
  email_destination:
    description: "email_destination"
    required: true
  syntax_check_job:
    description: "syntax_check_job"
    required: true
  test_execution_job:
    description: "test_execution_job"
    required: true
  build_statics_job:
    description: "build_statics_job"
    required: true
  deploy_job:
    description: "deploy_job"
    required: true

outputs:
  message:
    description: "response_message"

runs:
  using: "node12"
  main: "dist/index.js"
```

5. Cremos el proyecto de js para que envie el correo.
   5.1 Hacemos un _npm init_ en _send_mail_ para inicializar un nuevo proyecto de node.
   5.2 Instalamos las librerias @actions/core, nodemailer.
   5.3 Creamos un archivo index.js.
   5.4 Importamos las librerias
   5.5 Obtenemos las credenciales
   5.6 Obtenemos el status de los jobs
   5.7 Inicializamos la conexion con gmail syntax_check_job: ${{ needs.syntax_check_job.outputs.job-status }}
   test_execution_job: ${{ needs.test_execution_job.outputs.job-status }}
   build_statics_job: ${{needs.build_statics_job.outputs.job-status}}
   deploy_job: ${{ needs.deploy_job.outputs.job-status }}
   5.8 Creamos el mensaje
   5.9 Lo enviamos y mostramos el resultado

```js
const core = require("@actions/core");
const nodemailer = require("nodemailer");

// Credentials
const user = core.getInput("user");
const pass = core.getInput("pass");
const email_destination = core.getInput("email_destination");

// Jobs
const syntax_check_job = core.getInput("syntax_check_job");
const test_execution_job = core.getInput("test_execution_job");
const build_statics_job = core.getInput("build_statics_job");
const deploy_job = core.getInput("deploy_job");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: user,
    pass: pass,
  },
});

const message = {
  from: user,
  to: email_destination,
  subject: "Resultado del workflow ejecutado",
  html: `
    <p>Se ha realizado un push en la rama githubActions_improvement que ha provocado la ejecución del workflow Bingo_Workflow con los siguientes resultados:</p>
    <br>
    <p>- syntax_check_job: ${
      syntax_check_job == "" ? "SKIPPED" : syntax_check_job
    }</p>
    <p>- test_execution_job: ${
      test_execution_job == "" ? "SKIPPED" : test_execution_job
    }</p>
    <p>- build_statics_job: ${
      build_statics_job == "" ? "SKIPPED" : build_statics_job
    }</p>
    <p>- deploy_job: ${deploy_job == "" ? "SKIPPED" : deploy_job}</p>
  `,
  attachments: [],
};

transporter.sendMail(message, function (err, info) {
  err ? console.log(err) : console.log(info);
});
```

5. Minificamos el proyecto que ejecutara nuestro action con el seguiente comando:

```sh
ncc build index.js -o dist
```

Nota: Si no lo tienes instalado

```sh
npm i -g @vercel/ncc
```

5. Finalmente vamos a este enlace con la cuenta de google para desactivar el captcha y se puedan enviar correos desde javascript (A los pocos minutos de vuelve a desactivar)
   https://accounts.google.com/b/0/DisplayUnlockCaptcha

acemos un push a la rama que hemos indicado anteriormente y comprobamos que el job se ejecuta correctamente.

![Job de envío de notificación a los usuarios del proyecto](/img/img9.png)

Vamos al correo y comprobamos que recibimos la informacion.

![Correo con resultados](/img/img10.png)

## Job de actualización del README principal del proyecto.

Se denominará **update_readme_job** y se ejecutará sólo si el job encargado de realizar el deploy (deploy*job ) ha funcionado correctamente. Su finalidad será actualizar el contenido del README principal del proyecto para que muestre un texto al final con “Ultima versión desplegada el día: FECHA_DE*ÚLTIMO_DESPLIEGUE”

1. Establecemos el nombre del job y le decimos que se inicie en la ultima version de ubuntu, le diremos que sin el job de deploy_jop no puede funcionar (Para que solo actualice el readme si de verdad se ha actualizado el producción).

```yml
jobs:
  update_readme_job:
    name: update_readme_job
    runs-on: ubuntu-latest
    needs: deploy_job
```

2. Asignamos los pasos que debe de realizar nuestro job.
   **Change date** - Elimina con sed la ultima linea, añade una linea al final del documento con la nueva fecha.
   **Update Readme** - Hace un git push a la rama _githubActions_improvement_ con el _README.md_ actualizado.

```yml
steps:
  - name: Change date
    run: "sed -i '$d' README.md; echo -e '\nUltima versión desplegada el día: `date`' >> README.md"
  - name: Update Readme
    run: |
      git config user.name tonomolla6
      git config user.email tonomolla6@gmail.com
      git commit -am "Actualizado el README!"
      git push origin githubActions_improvement
```

Hacemos un push a la rama que hemos indicado anteriormente y comprobamos que el job se ejecuta correctamente.

![Job de actualización del README principal del proyecto.](/img/img11.png)

Vamos a http://tonomolla6.surge.sh/ para comprobar que se ha subido correctamente.


Ultima versión desplegada el día: Sun Jan 31 20:34:04 UTC 2021
