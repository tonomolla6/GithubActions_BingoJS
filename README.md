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
   **Checkout repository** - Esta acción desprotege su repositorio en $ GITHUB*WORKSPACE, para que su flujo de trabajo pueda acceder a él. Solo se obtiene una única confirmación de forma predeterminada.
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
   **Checkout repository** - Esta acción desprotege su repositorio en $ GITHUB*WORKSPACE, para que su flujo de trabajo pueda acceder a él. Solo se obtiene una única confirmación de forma predeterminada.
   **Run jest tests** - Esta accion instala las dependencias necesarias para ejecutar el codigo, busca todos los archivos js \*\*.test.js* y los ejecuta para validar que el bingo funciona correctamente.

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
   **Checkout repository** - Esta acción desprotege su repositorio en $ GITHUB\*WORKSPACE, para que su flujo de trabajo pueda acceder a él. Solo se obtiene una única confirmación de forma predeterminada.
   **Build code** - Esta accion crea el proyecto minificado en la carpeta build.
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
   **Artifact download** - Esta accion descarga artefactos de nuestro proyecto minificado del job anterior.
   **Surge upload** - Despues de descargar los artefactos subimos el proyecto minificado a la surge.hs, le tenemos que especificar la configuracion.

   - domain: Donde vamos a subir nuestro proyecto.
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
