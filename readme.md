##

for security reasons, you must manually create a file called .env in the backend directory.
this file should contain two lines:

Line #1
API_URL = /api/v1

Line #2
CONNECTION_STRING = mongodb+srv://<replace this with your own connection string from mongoDB database>

Before you can run this tou need to add/import data to yout mongoDB
in the directory called Backup you will found json data that you can import to mongodb

Give the database the name eshop-database and the collections you give the same name as the files you import.

then you have a functional backend api server if you use the code in this repo
