stub
====

Stub project for initializing an angular project.  This will seed an angular web-site organized to fit into the overall site architecture.  It also includes a Gruntfile.js script for common build tasks, and pulls in our typical platform and third party libraries.

Steps for starting a new project using stub
-------------------------------------------

  1) Create an empty repository on github, do not add README.md or .gitignore.

  2) On your dev machine, clone the stub repository

```bash
$> git clone --bare git@github.com:cinema6/stub.git
```

  3) Next, clone the new empty repository.

```bash
$> git clone git@github.com:cinema6/my-new-project.git
```

  4) Enter the stub.git directory.  Checkout its source to the new project directory.

```bash
$> cd stub.git
$> git --work-tree=/path/to/my-new-project checkout -f
```

  5) Enter the my-new-project directory and git add/commit everything you want to keep.

  6) From the my-new-project directory, push up to origin (github).

You can now remove the stub repo or keep it for starting future projects.

