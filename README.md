<p align=center>
:skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull:</p> 
<br>
<h3 align=center>
<a>Stand by since 01/06/2020</a></h3>
<br>
<br><p align=center>
:skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull::skull:
</p> 


<br>
<br>

# TextStyle

TextStyle simplifie la rédaction des textes normatifs

## Dev

```
docker-compose up -d
cd app
yarn dev
```

### Dev setup

- `cat hasura/dump.sql | docker-compose exec -T postgres psql -U postgres`
- Import hasura/metadata.json from hasura web ui settings
- Unzip `app/public/ckeditor`
- Start frontend `cd app && yarn && yarn dev`
- Start API `cd api && yarn && yarn start`

### Dev environment variables
```
- TIPI_USER             // Username Mailer
- TIPI_PASSWORD         // Password Mailer
- OAUTH_CLIENT_ID       // Dila API OAUT
- OAUTH_CLIENT_SECRET   // Dila API OAUT
```

# Prod

Copy and customize `docker-compose.override.prod.yml` to `docker-compose.override.yml`.

# Copy database

```
docker exec -t [container_postgre_name] pg_dumpall -c -U postgres > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql
```

# Reset database

Run the postgre container after deleting all project then :

```
psql -U postgres

SELECT c.relname FROM pg_class c WHERE c.relkind = 'S'; // to get all sequence name

SELECT setval('sequence_name', 1); // to reset the sequence number
```
