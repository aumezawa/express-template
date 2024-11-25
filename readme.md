# Express-Template

## Description

This is a starter kit for an [Express](https://expressjs.com/) project.

## How to use

### Stap 1

Install pakcages.

```
npm i
```

### Step 2

Make `./local/cert` directory in the project root, and store the key files below in `./local/cert`.

```
mkdir ./local
mkdir ./local/cert
cd ./local/cert
openssl genrsa 2048 > private-key.pem
openssl rsa -in private-key.pem -pubout -out public-key.pem
openssl req -new -key private-key.pem > server-csr.pem
openssl x509 -req -in server-csr.pem -signkey private-key.pem -out server-cert.pem -days 3650
cd ../..
```

The directory for the files can be changed by modifying `./src/config/project.ts` file.

### Step 3

Add your codes in `./src/routes/api-v1.ts`.

### Step 4

Build your codes.

```
npm run build
```

### Step 5

Start servers.

```
npm start
```
