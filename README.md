# Web
Web app is the way to turn your life easier with just few clicks.

# Getting Started

This project is using Docker to turn development easier, so to start it just copy and paste in root directory the dotenv file in `_setup/example.env` and rename it to `.env` after paste. After it, fill out fields with values you got and settings are ready.

Next step is just run project using `docker compose up` or run manually using `yarn dev`!

```shell
# Docker
docker compose up

# manually
yarn
yarn dev
```

## Tests

To do tests, just run `yarn test` (or `yarn test:coverage` for test coverage) in local environment that everything gonna be ok!

## Certificates

This app must run in HTTPS to authentication works properly. So, to install it, just setup `[mkcert](https://github.com/FiloSottile/mkcert)` into your machine and then run command below into root directory of this project.

```
mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem 'localhost'
```
### Disclaimer

In Chromium-based browsers the app will just work when opening this app when running. But, in Firefox, you still might have issues with certificates. To Fix it, you have to add your local certificate manually, to say to Firefox the thumbprinting is trusty. So, to do that, after setup `mkcert` into your machine, just follow steps below.

**1. Find Your `mkcert` Root Certificate**

First, you need to find the `rootCA.pem` file that `mkcert` created. You can find its location by running this command in your terminal:

```bash
mkcert -CAROOT
```
This will print a path, for example: `C:\Users\YourUser\AppData\Local\mkcert`. Go to that folder and find the file named `rootCA.pem`.

**2. Import the Certificate into Firefox**

-  In Firefox, go to the menu `(hamburger icon ☰)` and click `Settings`.
-  In the search bar at the top, type `Certificates`.
-  Click the View `Certificates...` button that appears.
-  A new window will pop up. Go to the `Authorities` tab.
-  Click the `Import...` button at the bottom.
-  Navigate to the folder you found in Step 1, select the `rootCA.pem` file, and click `Open`.

**3. Trust the Certificate (The Most Important Step)**

- After you click "Open" Firefox will show a small dialog asking what you want to trust this CA for.
- You must check the box that says: "Trust this CA to identify websites."
- Click `OK` to save, and `OK` again to close the certificate manager.

## Network

You can use a custom network for this services, using then `synk_network` you must create before run it. So, to create on just run command below once during initial setup.

```
docker network create synk_network
```