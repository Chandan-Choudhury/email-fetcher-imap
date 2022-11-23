# Email fetcher using IMAP

## Setup project & run on local machine

#### 1. Clone the repository :

```
git clone https://github.com/Chandan-Choudhury/email-fetcher-imap.git
```

#### 2. Setup npm :

```
npm i
```

#### 3. Setup 2FA and create App Password for your gmail (Check below url for instructions):

```
https://support.google.com/mail/answer/185833?hl=en
```

#### 4. Create .env file and add below lines of code with your credentials and sender name :

```
email=PASTE_YOUR_EMAIL_HERE
password=PASTE_YOUR_APP_PASSWORD_HERE
sender=ADD_SENDER_NAME_TO_FILTER_HERE // I am using AMAZON to filter amazon emails
db_host=ADD_YOUR_LOCAL_IP_ADDRESS_HERE // I am using 192.168.0.8
db_user=ADD_DB_USER_NAME_HERE // I am using root
db_password=ADD_DB_PASSWORD_HERE // I am using root
db_name=ADD_DB_NAME_HERE  // I am using email
```

#### 5. Install docker on your system :

```
https://www.docker.com/
```

#### 6. Inside root directory run docker command on a terminal to start the db :

```
docker compose up
```

#### 7. Start the email fetcher in another terminal (inside root folder) :

```
node index.js
```

#### 8. To check DB open localhost:8080 and login with below credentials :

```
Server : host.docker.internal:3306
Username : root
Password : password
```
