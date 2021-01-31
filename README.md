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
