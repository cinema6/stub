stub
====

Stub project for initializing a Cinema6 Angular project.  This will seed an Angular web-app organized to fit into the overall site architecture.  It uses Grunt to run common development and build processes.

Steps for starting a new project using stub
-------------------------------------------

  1. On your dev machine, clone the stub repository

    ```bash
    $> git clone git@github.com:cinema6/stub.git
    ```

  2. Next, enter the cloned stub repo and delete the .git directory.

    ```bash
    $> cd stub
    $> rm -rf .git
    ```

  3. Initialize a new git repo

    ```bash
    $> git init
    ```

  4. Setup with Github
  
    ```bash
    $> git remote add origin git@github.com:cinema6/myawesomeapp.git
    ```
    
  5. Initialize your project
  
    ```bash
    $> grunt init
    ```
    
  6. Add the files in the repo (make sure to include the .c6stubinit file)
  
  7. Push to Github!
  
    ```bash
    $> git push origin master -u
    ```

### Grunt Tasks and Configuration
#### Configuration
##### package.json
The name and keywords in this file are used to configure certain application settings and defaults. For example, when executing E2E tests on SauceLabs, the name of the job will be the "name" property in this file, and the job tags will be the "keywords" array in this file.

##### settings.json
This file contains the application settings that are used accross grunt tasks and in automated testing. You can run
```bash
grunt init
```
to run a wizard that will walk you through configuring this file.

###### appUrl
This property configures the url that the sandbox should iframe in to load your application.

###### appModule
The main Angular module name for your application.

###### appDir
The folder that houses your application

###### distDir
The folder that grunt should build
#### Tasks
##### init
This task guides you through configuring your new application. You should only need to run this once when setting up your app for the first time.

ex:
```bash
$> grunt init
```

##### createexp
This task guides you through creating an experience object. While some apps will only have one experience, if your app can run many experiences, this task will be helpful!

ex:
```bash
$> grunt createexp
```

##### genid:(prefix)
This task will generate and log a Cinema6-formatted UUID with the supplied prefix.

ex:
```bash
$> grunt genid:e
Running "genid:e" (genid) task
e-6c7ed80e3d68ac
$> grunt genid:o
Running "genid:o" (genid) task
o-df80d6438ab29c
```

##### server
This task will start a development server that uses the c6-sandbox. Your application will appear inside the Cinema6 site chrome, and the Cinema6 site API will be available.

ex:
```bash
$> grunt server
```

##### test:unit
This task will check your JS files for lint and execute the unit tests

ex:
```bash
$> grunt test:unit
```

##### test:unit:debug
This task will watch your JS files for changes. If a file is changed, the unit tests will be re-executed.

ex:
```bash
$> grunt test:unit:debug
```

##### test:e2e:(browser||'all')
This task will execute the E2E tests on SauceLabs in the specified browser, or in all browsers if "all" is supplied.

ex:
```bash
$> grunt test:e2e:chrome #Run E2E tests in Chrome
$> grunt test:e2e:ie #Run E2E tests in IE
$> grunt test:e2e:all #Run E2E tests in all browsers
```

##### test:e2e:debug:(browser)
This task will watch your app and test files and run the E2E tests in the specified browser when any of the files change.

ex:
```bash
$> grunt test:e2e:debug:iphone
```

##### publish:collateral:('test'||'production')
This task will build and upload the collateral assets to the specified environment on S3.

ex:
```bash
$> grunt publish:collateral:test #Upload collateral assets to test server
$> grunt publish:collateral:production #Upload collateral assets to production server
```

##### publish:app:('test'||'production')
This task will build and upload the application to the specified environment on S3.

ex:
```bash
$> grunt publish:app:test #Upload app to test server
$> grunt publish:app:production #Upload app to production server
```

##### publish:('test'||'production')
This task will build and upload the collateral assets and app to the specified environment on S3.

ex:
```bash
$> grunt publish:test #Upload collateral assets and app to test server
$> grunt publish:production #Upload collateral assets and app to production server
```