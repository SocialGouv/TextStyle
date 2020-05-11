--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--





--
-- Drop roles
--

DROP ROLE postgres;


--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;






--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 12.0 (Debian 12.0-1.pgdg100+1)
-- Dumped by pg_dump version 12.0 (Debian 12.0-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO postgres;

\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: postgres
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: postgres
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 12.0 (Debian 12.0-1.pgdg100+1)
-- Dumped by pg_dump version 12.0 (Debian 12.0-1.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO postgres;

\connect postgres

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_catalog;


ALTER SCHEMA hdb_catalog OWNER TO postgres;

--
-- Name: hdb_views; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_views;


ALTER SCHEMA hdb_views OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: hdb_schema_update_event_notifier(); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.hdb_schema_update_event_notifier() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
  DECLARE
    instance_id uuid;
    occurred_at timestamptz;
    curr_rec record;
  BEGIN
    instance_id = NEW.instance_id;
    occurred_at = NEW.occurred_at;
    PERFORM pg_notify('hasura_schema_update', json_build_object(
      'instance_id', instance_id,
      'occurred_at', occurred_at
      )::text);
    RETURN curr_rec;
  END;
$$;


ALTER FUNCTION hdb_catalog.hdb_schema_update_event_notifier() OWNER TO postgres;

--
-- Name: inject_table_defaults(text, text, text, text); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.inject_table_defaults(view_schema text, view_name text, tab_schema text, tab_name text) RETURNS void
    LANGUAGE plpgsql
    AS $$
    DECLARE
        r RECORD;
    BEGIN
      FOR r IN SELECT column_name, column_default FROM information_schema.columns WHERE table_schema = tab_schema AND table_name = tab_name AND column_default IS NOT NULL LOOP
          EXECUTE format('ALTER VIEW %I.%I ALTER COLUMN %I SET DEFAULT %s;', view_schema, view_name, r.column_name, r.column_default);
      END LOOP;
    END;
$$;


ALTER FUNCTION hdb_catalog.inject_table_defaults(view_schema text, view_name text, tab_schema text, tab_name text) OWNER TO postgres;

--
-- Name: insert_event_log(text, text, text, text, json); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) RETURNS text
    LANGUAGE plpgsql
    AS $$
  DECLARE
    id text;
    payload json;
    session_variables json;
    server_version_num int;
  BEGIN
    id := gen_random_uuid();
    server_version_num := current_setting('server_version_num');
    IF server_version_num >= 90600 THEN
      session_variables := current_setting('hasura.user', 't');
    ELSE
      BEGIN
        session_variables := current_setting('hasura.user');
      EXCEPTION WHEN OTHERS THEN
                  session_variables := NULL;
      END;
    END IF;
    payload := json_build_object(
      'op', op,
      'data', row_data,
      'session_variables', session_variables
    );
    INSERT INTO hdb_catalog.event_log
                (id, schema_name, table_name, trigger_name, payload)
    VALUES
    (id, schema_name, table_name, trigger_name, payload);
    RETURN id;
  END;
$$;


ALTER FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) OWNER TO postgres;

--
-- Name: user__insert__public__article(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views.user__insert__public__article() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."article"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_0_public_project" WHERE (((("_be_0_public_project"."id") = (NEW."project")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project_writer" AS "_be_1_public_project_writer" WHERE (((("_be_1_public_project_writer"."project_id") = ("_be_0_public_project"."id")) AND ('true')) AND ((((("_be_1_public_project_writer"."writer_id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_1_public_project_writer"."writer_id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR (((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_2_public_project" WHERE (((("_be_2_public_project"."id") = (NEW."project")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project_administrator" AS "_be_3_public_project_administrator" WHERE (((("_be_3_public_project_administrator"."project_id") = ("_be_2_public_project"."id")) AND ('true')) AND ((((("_be_3_public_project_administrator"."administrator_id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_3_public_project_administrator"."administrator_id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR ('false'))) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."article" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."article" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."article" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."article" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views.user__insert__public__article() OWNER TO postgres;

--
-- Name: user__insert__public__article_comment(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views.user__insert__public__article_comment() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."article_comment"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((((EXISTS  (SELECT  1  FROM "public"."article" AS "_be_0_public_article" WHERE (((("_be_0_public_article"."id") = (NEW."article_id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_1_public_project" WHERE (((("_be_1_public_project"."id") = ("_be_0_public_article"."project")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project_writer" AS "_be_2_public_project_writer" WHERE (((("_be_2_public_project_writer"."project_id") = ("_be_1_public_project"."id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."user" AS "_be_3_public_user" WHERE (((("_be_3_public_user"."id") = ("_be_2_public_project_writer"."writer_id")) AND ('true')) AND ((((("_be_3_public_user"."id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_3_public_user"."id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR (((EXISTS  (SELECT  1  FROM "public"."article" AS "_be_4_public_article" WHERE (((("_be_4_public_article"."id") = (NEW."article_id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_5_public_project" WHERE (((("_be_5_public_project"."id") = ("_be_4_public_article"."project")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project_administrator" AS "_be_6_public_project_administrator" WHERE (((("_be_6_public_project_administrator"."project_id") = ("_be_5_public_project"."id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."user" AS "_be_7_public_user" WHERE (((("_be_7_public_user"."id") = ("_be_6_public_project_administrator"."administrator_id")) AND ('true')) AND ((((("_be_7_public_user"."id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_7_public_user"."id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR ('false'))) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."article_comment" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."article_comment" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."article_comment" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."article_comment" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views.user__insert__public__article_comment() OWNER TO postgres;

--
-- Name: user__insert__public__article_revision(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views.user__insert__public__article_revision() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."article_revision"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((((EXISTS  (SELECT  1  FROM "public"."article" AS "_be_0_public_article" WHERE (((("_be_0_public_article"."id") = (NEW."article")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_1_public_project" WHERE (((("_be_1_public_project"."id") = ("_be_0_public_article"."project")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project_writer" AS "_be_2_public_project_writer" WHERE (((("_be_2_public_project_writer"."project_id") = ("_be_1_public_project"."id")) AND ('true')) AND ((((("_be_2_public_project_writer"."writer_id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_2_public_project_writer"."writer_id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR (((EXISTS  (SELECT  1  FROM "public"."article" AS "_be_3_public_article" WHERE (((("_be_3_public_article"."id") = (NEW."article")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_4_public_project" WHERE (((("_be_4_public_project"."id") = ("_be_3_public_article"."project")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project_administrator" AS "_be_5_public_project_administrator" WHERE (((("_be_5_public_project_administrator"."project_id") = ("_be_4_public_project"."id")) AND ('true')) AND ((((("_be_5_public_project_administrator"."administrator_id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_5_public_project_administrator"."administrator_id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR ('false'))) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."article_revision" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."article_revision" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."article_revision" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."article_revision" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views.user__insert__public__article_revision() OWNER TO postgres;

--
-- Name: user__insert__public__project(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views.user__insert__public__project() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."project"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ('true') THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."project" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."project" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."project" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."project" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views.user__insert__public__project() OWNER TO postgres;

--
-- Name: user__insert__public__project_administrator(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views.user__insert__public__project_administrator() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."project_administrator"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_0_public_project" WHERE (((("_be_0_public_project"."id") = (NEW."project_id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."user" AS "_be_1_public_user" WHERE (((("_be_1_public_user"."id") = ("_be_0_public_project"."create_by")) AND ('true')) AND ((((("_be_1_public_user"."id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_1_public_user"."id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR (((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_2_public_project" WHERE (((("_be_2_public_project"."id") = (NEW."project_id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project_administrator" AS "_be_3_public_project_administrator" WHERE (((("_be_3_public_project_administrator"."project_id") = ("_be_2_public_project"."id")) AND ('true')) AND ((((("_be_3_public_project_administrator"."administrator_id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_3_public_project_administrator"."administrator_id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR ('false'))) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."project_administrator" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."project_administrator" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."project_administrator" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."project_administrator" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views.user__insert__public__project_administrator() OWNER TO postgres;

--
-- Name: user__insert__public__project_writer(); Type: FUNCTION; Schema: hdb_views; Owner: postgres
--

CREATE FUNCTION hdb_views.user__insert__public__project_writer() RETURNS trigger
    LANGUAGE plpgsql
    AS $_$
  DECLARE r "public"."project_writer"%ROWTYPE;
  DECLARE conflict_clause jsonb;
  DECLARE action text;
  DECLARE constraint_name text;
  DECLARE set_expression text;
  BEGIN
    conflict_clause = current_setting('hasura.conflict_clause')::jsonb;
    IF ((((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_0_public_project" WHERE (((("_be_0_public_project"."id") = (NEW."project_id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."user" AS "_be_1_public_user" WHERE (((("_be_1_public_user"."id") = ("_be_0_public_project"."create_by")) AND ('true')) AND ((((("_be_1_public_user"."id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_1_public_user"."id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR (((EXISTS  (SELECT  1  FROM "public"."project" AS "_be_2_public_project" WHERE (((("_be_2_public_project"."id") = (NEW."project_id")) AND ('true')) AND ((EXISTS  (SELECT  1  FROM "public"."project_administrator" AS "_be_3_public_project_administrator" WHERE (((("_be_3_public_project_administrator"."project_id") = ("_be_2_public_project"."id")) AND ('true')) AND ((((("_be_3_public_project_administrator"."administrator_id") = (((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer)) OR ((("_be_3_public_project_administrator"."administrator_id") IS NULL) AND ((((current_setting('hasura.user')::json->>'x-hasura-user-id'))::integer) IS NULL))) AND ('true')) AND ('true')))     )) AND ('true')))     )) AND ('true')) OR ('false'))) AND ('true')) THEN
      CASE
        WHEN conflict_clause = 'null'::jsonb THEN INSERT INTO "public"."project_writer" VALUES (NEW.*) RETURNING * INTO r;
        ELSE
          action = conflict_clause ->> 'action';
          constraint_name = quote_ident(conflict_clause ->> 'constraint');
          set_expression = conflict_clause ->> 'set_expression';
          IF action is NOT NULL THEN
            CASE
              WHEN action = 'ignore'::text AND constraint_name IS NULL THEN
                INSERT INTO "public"."project_writer" VALUES (NEW.*) ON CONFLICT DO NOTHING RETURNING * INTO r;
              WHEN action = 'ignore'::text AND constraint_name is NOT NULL THEN
                EXECUTE 'INSERT INTO "public"."project_writer" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO NOTHING RETURNING *' INTO r USING NEW;
              ELSE
                EXECUTE 'INSERT INTO "public"."project_writer" VALUES ($1.*) ON CONFLICT ON CONSTRAINT ' || constraint_name ||
                           ' DO UPDATE ' || set_expression || ' RETURNING *' INTO r USING NEW;
            END CASE;
            ELSE
              RAISE internal_error using message = 'action is not found'; RETURN NULL;
          END IF;
      END CASE;
      IF r IS NULL THEN RETURN null; ELSE RETURN r; END IF;
     ELSE RAISE check_violation using message = 'insert check constraint failed'; RETURN NULL;
     END IF;
  END $_$;


ALTER FUNCTION hdb_views.user__insert__public__project_writer() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_invocation_logs (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.event_invocation_logs OWNER TO postgres;

--
-- Name: event_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_log (
    id text DEFAULT public.gen_random_uuid() NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    trigger_name text NOT NULL,
    payload jsonb NOT NULL,
    delivered boolean DEFAULT false NOT NULL,
    error boolean DEFAULT false NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    locked boolean DEFAULT false NOT NULL,
    next_retry_at timestamp without time zone,
    archived boolean DEFAULT false NOT NULL
);


ALTER TABLE hdb_catalog.event_log OWNER TO postgres;

--
-- Name: event_triggers; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_triggers (
    name text NOT NULL,
    type text NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    configuration json,
    comment text
);


ALTER TABLE hdb_catalog.event_triggers OWNER TO postgres;

--
-- Name: hdb_allowlist; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_allowlist (
    collection_name text
);


ALTER TABLE hdb_catalog.hdb_allowlist OWNER TO postgres;

--
-- Name: hdb_check_constraint; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_check_constraint AS
 SELECT (n.nspname)::text AS table_schema,
    (ct.relname)::text AS table_name,
    (r.conname)::text AS constraint_name,
    pg_get_constraintdef(r.oid, true) AS "check"
   FROM ((pg_constraint r
     JOIN pg_class ct ON ((r.conrelid = ct.oid)))
     JOIN pg_namespace n ON ((ct.relnamespace = n.oid)))
  WHERE (r.contype = 'c'::"char");


ALTER TABLE hdb_catalog.hdb_check_constraint OWNER TO postgres;

--
-- Name: hdb_foreign_key_constraint; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_foreign_key_constraint AS
 SELECT (q.table_schema)::text AS table_schema,
    (q.table_name)::text AS table_name,
    (q.constraint_name)::text AS constraint_name,
    (min(q.constraint_oid))::integer AS constraint_oid,
    min((q.ref_table_table_schema)::text) AS ref_table_table_schema,
    min((q.ref_table)::text) AS ref_table,
    json_object_agg(ac.attname, afc.attname) AS column_mapping,
    min((q.confupdtype)::text) AS on_update,
    min((q.confdeltype)::text) AS on_delete,
    json_agg(ac.attname) AS columns,
    json_agg(afc.attname) AS ref_columns
   FROM ((( SELECT ctn.nspname AS table_schema,
            ct.relname AS table_name,
            r.conrelid AS table_id,
            r.conname AS constraint_name,
            r.oid AS constraint_oid,
            cftn.nspname AS ref_table_table_schema,
            cft.relname AS ref_table,
            r.confrelid AS ref_table_id,
            r.confupdtype,
            r.confdeltype,
            unnest(r.conkey) AS column_id,
            unnest(r.confkey) AS ref_column_id
           FROM ((((pg_constraint r
             JOIN pg_class ct ON ((r.conrelid = ct.oid)))
             JOIN pg_namespace ctn ON ((ct.relnamespace = ctn.oid)))
             JOIN pg_class cft ON ((r.confrelid = cft.oid)))
             JOIN pg_namespace cftn ON ((cft.relnamespace = cftn.oid)))
          WHERE (r.contype = 'f'::"char")) q
     JOIN pg_attribute ac ON (((q.column_id = ac.attnum) AND (q.table_id = ac.attrelid))))
     JOIN pg_attribute afc ON (((q.ref_column_id = afc.attnum) AND (q.ref_table_id = afc.attrelid))))
  GROUP BY q.table_schema, q.table_name, q.constraint_name;


ALTER TABLE hdb_catalog.hdb_foreign_key_constraint OWNER TO postgres;

--
-- Name: hdb_primary_key; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_primary_key AS
 SELECT tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    json_agg(constraint_column_usage.column_name) AS columns
   FROM (information_schema.table_constraints tc
     JOIN ( SELECT x.tblschema AS table_schema,
            x.tblname AS table_name,
            x.colname AS column_name,
            x.cstrname AS constraint_name
           FROM ( SELECT DISTINCT nr.nspname,
                    r.relname,
                    a.attname,
                    c.conname
                   FROM pg_namespace nr,
                    pg_class r,
                    pg_attribute a,
                    pg_depend d,
                    pg_namespace nc,
                    pg_constraint c
                  WHERE ((nr.oid = r.relnamespace) AND (r.oid = a.attrelid) AND (d.refclassid = ('pg_class'::regclass)::oid) AND (d.refobjid = r.oid) AND (d.refobjsubid = a.attnum) AND (d.classid = ('pg_constraint'::regclass)::oid) AND (d.objid = c.oid) AND (c.connamespace = nc.oid) AND (c.contype = 'c'::"char") AND (r.relkind = ANY (ARRAY['r'::"char", 'p'::"char"])) AND (NOT a.attisdropped))
                UNION ALL
                 SELECT nr.nspname,
                    r.relname,
                    a.attname,
                    c.conname
                   FROM pg_namespace nr,
                    pg_class r,
                    pg_attribute a,
                    pg_namespace nc,
                    pg_constraint c
                  WHERE ((nr.oid = r.relnamespace) AND (r.oid = a.attrelid) AND (nc.oid = c.connamespace) AND (r.oid =
                        CASE c.contype
                            WHEN 'f'::"char" THEN c.confrelid
                            ELSE c.conrelid
                        END) AND (a.attnum = ANY (
                        CASE c.contype
                            WHEN 'f'::"char" THEN c.confkey
                            ELSE c.conkey
                        END)) AND (NOT a.attisdropped) AND (c.contype = ANY (ARRAY['p'::"char", 'u'::"char", 'f'::"char"])) AND (r.relkind = ANY (ARRAY['r'::"char", 'p'::"char"])))) x(tblschema, tblname, colname, cstrname)) constraint_column_usage ON ((((tc.constraint_name)::text = (constraint_column_usage.constraint_name)::text) AND ((tc.table_schema)::text = (constraint_column_usage.table_schema)::text) AND ((tc.table_name)::text = (constraint_column_usage.table_name)::text))))
  WHERE ((tc.constraint_type)::text = 'PRIMARY KEY'::text)
  GROUP BY tc.table_schema, tc.table_name, tc.constraint_name;


ALTER TABLE hdb_catalog.hdb_primary_key OWNER TO postgres;

--
-- Name: hdb_column; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_column AS
 WITH primary_key_references AS (
         SELECT fkey.table_schema AS src_table_schema,
            fkey.table_name AS src_table_name,
            (fkey.columns ->> 0) AS src_column_name,
            json_agg(json_build_object('schema', fkey.ref_table_table_schema, 'name', fkey.ref_table)) AS ref_tables
           FROM (hdb_catalog.hdb_foreign_key_constraint fkey
             JOIN hdb_catalog.hdb_primary_key pkey ON ((((pkey.table_schema)::name = fkey.ref_table_table_schema) AND ((pkey.table_name)::name = fkey.ref_table) AND ((pkey.columns)::jsonb = (fkey.ref_columns)::jsonb))))
          WHERE (json_array_length(fkey.columns) = 1)
          GROUP BY fkey.table_schema, fkey.table_name, (fkey.columns ->> 0)
        )
 SELECT columns.table_schema,
    columns.table_name,
    columns.column_name AS name,
    columns.udt_name AS type,
    columns.is_nullable,
    columns.ordinal_position,
    COALESCE(pkey_refs.ref_tables, '[]'::json) AS primary_key_references,
    col_description(pg_class.oid, (columns.ordinal_position)::integer) AS description
   FROM (((information_schema.columns
     JOIN pg_class ON ((pg_class.relname = (columns.table_name)::name)))
     JOIN pg_namespace ON (((pg_namespace.oid = pg_class.relnamespace) AND (pg_namespace.nspname = (columns.table_schema)::name))))
     LEFT JOIN primary_key_references pkey_refs ON ((((columns.table_schema)::name = pkey_refs.src_table_schema) AND ((columns.table_name)::name = pkey_refs.src_table_name) AND ((columns.column_name)::name = pkey_refs.src_column_name))));


ALTER TABLE hdb_catalog.hdb_column OWNER TO postgres;

--
-- Name: hdb_computed_field; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_computed_field (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    computed_field_name text NOT NULL,
    definition jsonb NOT NULL,
    comment text
);


ALTER TABLE hdb_catalog.hdb_computed_field OWNER TO postgres;

--
-- Name: hdb_computed_field_function; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_computed_field_function AS
 SELECT hdb_computed_field.table_schema,
    hdb_computed_field.table_name,
    hdb_computed_field.computed_field_name,
        CASE
            WHEN (((hdb_computed_field.definition -> 'function'::text) ->> 'name'::text) IS NULL) THEN (hdb_computed_field.definition ->> 'function'::text)
            ELSE ((hdb_computed_field.definition -> 'function'::text) ->> 'name'::text)
        END AS function_name,
        CASE
            WHEN (((hdb_computed_field.definition -> 'function'::text) ->> 'schema'::text) IS NULL) THEN 'public'::text
            ELSE ((hdb_computed_field.definition -> 'function'::text) ->> 'schema'::text)
        END AS function_schema
   FROM hdb_catalog.hdb_computed_field;


ALTER TABLE hdb_catalog.hdb_computed_field_function OWNER TO postgres;

--
-- Name: hdb_function; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_function (
    function_schema text NOT NULL,
    function_name text NOT NULL,
    is_system_defined boolean DEFAULT false,
    configuration jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE hdb_catalog.hdb_function OWNER TO postgres;

--
-- Name: hdb_function_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_function_agg AS
 SELECT (p.proname)::text AS function_name,
    (pn.nspname)::text AS function_schema,
    pd.description,
        CASE
            WHEN (p.provariadic = (0)::oid) THEN false
            ELSE true
        END AS has_variadic,
        CASE
            WHEN ((p.provolatile)::text = ('i'::character(1))::text) THEN 'IMMUTABLE'::text
            WHEN ((p.provolatile)::text = ('s'::character(1))::text) THEN 'STABLE'::text
            WHEN ((p.provolatile)::text = ('v'::character(1))::text) THEN 'VOLATILE'::text
            ELSE NULL::text
        END AS function_type,
    pg_get_functiondef(p.oid) AS function_definition,
    (rtn.nspname)::text AS return_type_schema,
    (rt.typname)::text AS return_type_name,
    (rt.typtype)::text AS return_type_type,
    p.proretset AS returns_set,
    ( SELECT COALESCE(json_agg(json_build_object('schema', q.schema, 'name', q.name, 'type', q.type)), '[]'::json) AS "coalesce"
           FROM ( SELECT pt.typname AS name,
                    pns.nspname AS schema,
                    pt.typtype AS type,
                    pat.ordinality
                   FROM ((unnest(COALESCE(p.proallargtypes, (p.proargtypes)::oid[])) WITH ORDINALITY pat(oid, ordinality)
                     LEFT JOIN pg_type pt ON ((pt.oid = pat.oid)))
                     LEFT JOIN pg_namespace pns ON ((pt.typnamespace = pns.oid)))
                  ORDER BY pat.ordinality) q) AS input_arg_types,
    to_json(COALESCE(p.proargnames, ARRAY[]::text[])) AS input_arg_names,
    p.pronargdefaults AS default_args,
    (p.oid)::integer AS function_oid
   FROM ((((pg_proc p
     JOIN pg_namespace pn ON ((pn.oid = p.pronamespace)))
     JOIN pg_type rt ON ((rt.oid = p.prorettype)))
     JOIN pg_namespace rtn ON ((rtn.oid = rt.typnamespace)))
     LEFT JOIN pg_description pd ON ((p.oid = pd.objoid)))
  WHERE (((pn.nspname)::text !~~ 'pg_%'::text) AND ((pn.nspname)::text <> ALL (ARRAY['information_schema'::text, 'hdb_catalog'::text, 'hdb_views'::text])) AND (NOT (EXISTS ( SELECT 1
           FROM pg_aggregate
          WHERE ((pg_aggregate.aggfnoid)::oid = p.oid)))));


ALTER TABLE hdb_catalog.hdb_function_agg OWNER TO postgres;

--
-- Name: hdb_function_info_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_function_info_agg AS
 SELECT hdb_function_agg.function_name,
    hdb_function_agg.function_schema,
    row_to_json(( SELECT e.*::record AS e
           FROM ( SELECT hdb_function_agg.description,
                    hdb_function_agg.has_variadic,
                    hdb_function_agg.function_type,
                    hdb_function_agg.return_type_schema,
                    hdb_function_agg.return_type_name,
                    hdb_function_agg.return_type_type,
                    hdb_function_agg.returns_set,
                    hdb_function_agg.input_arg_types,
                    hdb_function_agg.input_arg_names,
                    hdb_function_agg.default_args,
                    (EXISTS ( SELECT 1
                           FROM information_schema.tables
                          WHERE (((tables.table_schema)::name = hdb_function_agg.return_type_schema) AND ((tables.table_name)::name = hdb_function_agg.return_type_name)))) AS returns_table) e)) AS function_info
   FROM hdb_catalog.hdb_function_agg;


ALTER TABLE hdb_catalog.hdb_function_info_agg OWNER TO postgres;

--
-- Name: hdb_permission; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_permission (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    role_name text NOT NULL,
    perm_type text NOT NULL,
    perm_def jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false,
    CONSTRAINT hdb_permission_perm_type_check CHECK ((perm_type = ANY (ARRAY['insert'::text, 'select'::text, 'update'::text, 'delete'::text])))
);


ALTER TABLE hdb_catalog.hdb_permission OWNER TO postgres;

--
-- Name: hdb_permission_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_permission_agg AS
 SELECT hdb_permission.table_schema,
    hdb_permission.table_name,
    hdb_permission.role_name,
    json_object_agg(hdb_permission.perm_type, hdb_permission.perm_def) AS permissions
   FROM hdb_catalog.hdb_permission
  GROUP BY hdb_permission.table_schema, hdb_permission.table_name, hdb_permission.role_name;


ALTER TABLE hdb_catalog.hdb_permission_agg OWNER TO postgres;

--
-- Name: hdb_query_collection; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_query_collection (
    collection_name text NOT NULL,
    collection_defn jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false
);


ALTER TABLE hdb_catalog.hdb_query_collection OWNER TO postgres;

--
-- Name: hdb_relationship; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_relationship (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    rel_name text NOT NULL,
    rel_type text,
    rel_def jsonb NOT NULL,
    comment text,
    is_system_defined boolean DEFAULT false,
    CONSTRAINT hdb_relationship_rel_type_check CHECK ((rel_type = ANY (ARRAY['object'::text, 'array'::text])))
);


ALTER TABLE hdb_catalog.hdb_relationship OWNER TO postgres;

--
-- Name: hdb_schema_update_event; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_schema_update_event (
    instance_id uuid NOT NULL,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE hdb_catalog.hdb_schema_update_event OWNER TO postgres;

--
-- Name: hdb_table; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_table (
    table_schema text NOT NULL,
    table_name text NOT NULL,
    is_system_defined boolean DEFAULT false,
    is_enum boolean DEFAULT false NOT NULL,
    configuration jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE hdb_catalog.hdb_table OWNER TO postgres;

--
-- Name: hdb_table_info_agg; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_table_info_agg AS
 SELECT tables.table_name,
    tables.table_schema,
    descriptions.description,
    COALESCE(columns.columns, '[]'::json) AS columns,
    COALESCE(pk.columns, '[]'::json) AS primary_key_columns,
    COALESCE(constraints.constraints, '[]'::json) AS constraints,
    COALESCE(views.view_info, 'null'::json) AS view_info
   FROM (((((information_schema.tables tables
     LEFT JOIN ( SELECT c.table_name,
            c.table_schema,
            json_agg(json_build_object('name', c.name, 'type', c.type, 'is_nullable', (c.is_nullable)::boolean, 'references', c.primary_key_references, 'description', c.description)) AS columns
           FROM hdb_catalog.hdb_column c
          GROUP BY c.table_schema, c.table_name) columns ON ((((tables.table_schema)::name = (columns.table_schema)::name) AND ((tables.table_name)::name = (columns.table_name)::name))))
     LEFT JOIN ( SELECT hdb_primary_key.table_schema,
            hdb_primary_key.table_name,
            hdb_primary_key.constraint_name,
            hdb_primary_key.columns
           FROM hdb_catalog.hdb_primary_key) pk ON ((((tables.table_schema)::name = (pk.table_schema)::name) AND ((tables.table_name)::name = (pk.table_name)::name))))
     LEFT JOIN ( SELECT c.table_schema,
            c.table_name,
            json_agg(c.constraint_name) AS constraints
           FROM information_schema.table_constraints c
          WHERE (((c.constraint_type)::text = 'UNIQUE'::text) OR ((c.constraint_type)::text = 'PRIMARY KEY'::text))
          GROUP BY c.table_schema, c.table_name) constraints ON ((((tables.table_schema)::name = (constraints.table_schema)::name) AND ((tables.table_name)::name = (constraints.table_name)::name))))
     LEFT JOIN ( SELECT v.table_schema,
            v.table_name,
            json_build_object('is_updatable', ((v.is_updatable)::boolean OR (v.is_trigger_updatable)::boolean), 'is_deletable', ((v.is_updatable)::boolean OR (v.is_trigger_deletable)::boolean), 'is_insertable', ((v.is_insertable_into)::boolean OR (v.is_trigger_insertable_into)::boolean)) AS view_info
           FROM information_schema.views v) views ON ((((tables.table_schema)::name = (views.table_schema)::name) AND ((tables.table_name)::name = (views.table_name)::name))))
     LEFT JOIN ( SELECT pc.relname AS table_name,
            pn.nspname AS table_schema,
            pd.description
           FROM ((pg_class pc
             LEFT JOIN pg_namespace pn ON ((pn.oid = pc.relnamespace)))
             LEFT JOIN pg_description pd ON ((pd.objoid = pc.oid)))
          WHERE (pd.objsubid = 0)) descriptions ON ((((tables.table_schema)::name = descriptions.table_schema) AND ((tables.table_name)::name = descriptions.table_name))));


ALTER TABLE hdb_catalog.hdb_table_info_agg OWNER TO postgres;

--
-- Name: hdb_unique_constraint; Type: VIEW; Schema: hdb_catalog; Owner: postgres
--

CREATE VIEW hdb_catalog.hdb_unique_constraint AS
 SELECT tc.table_name,
    tc.constraint_schema AS table_schema,
    tc.constraint_name,
    json_agg(kcu.column_name) AS columns
   FROM (information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu USING (constraint_schema, constraint_name))
  WHERE ((tc.constraint_type)::text = 'UNIQUE'::text)
  GROUP BY tc.table_name, tc.constraint_schema, tc.constraint_name;


ALTER TABLE hdb_catalog.hdb_unique_constraint OWNER TO postgres;

--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT public.gen_random_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE hdb_catalog.hdb_version OWNER TO postgres;

--
-- Name: remote_schemas; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.remote_schemas (
    id bigint NOT NULL,
    name text,
    definition json,
    comment text
);


ALTER TABLE hdb_catalog.remote_schemas OWNER TO postgres;

--
-- Name: remote_schemas_id_seq; Type: SEQUENCE; Schema: hdb_catalog; Owner: postgres
--

CREATE SEQUENCE hdb_catalog.remote_schemas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE hdb_catalog.remote_schemas_id_seq OWNER TO postgres;

--
-- Name: remote_schemas_id_seq; Type: SEQUENCE OWNED BY; Schema: hdb_catalog; Owner: postgres
--

ALTER SEQUENCE hdb_catalog.remote_schemas_id_seq OWNED BY hdb_catalog.remote_schemas.id;


--
-- Name: article; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.article (
    id integer NOT NULL,
    titre text NOT NULL,
    number text,
    article_id text NOT NULL,
    unique_article_projet text NOT NULL,
    status integer NOT NULL,
    project integer NOT NULL,
    texte text NOT NULL,
    code text
);


ALTER TABLE public.article OWNER TO postgres;

--
-- Name: user__insert__public__article; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views.user__insert__public__article AS
 SELECT article.id,
    article.titre,
    article.number,
    article.article_id,
    article.unique_article_projet,
    article.status,
    article.project,
    article.texte,
    article.code
   FROM public.article;


ALTER TABLE hdb_views.user__insert__public__article OWNER TO postgres;

--
-- Name: article_comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.article_comment (
    id integer NOT NULL,
    article_id integer NOT NULL,
    user_id integer NOT NULL,
    comment text NOT NULL,
    reply_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.article_comment OWNER TO postgres;

--
-- Name: user__insert__public__article_comment; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views.user__insert__public__article_comment AS
 SELECT article_comment.id,
    article_comment.article_id,
    article_comment.user_id,
    article_comment.comment,
    article_comment.reply_id,
    article_comment.created_at
   FROM public.article_comment;


ALTER TABLE hdb_views.user__insert__public__article_comment OWNER TO postgres;

--
-- Name: article_revision; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.article_revision (
    id integer NOT NULL,
    article integer NOT NULL,
    text text NOT NULL,
    project integer,
    name text,
    "textFormatted" text
);


ALTER TABLE public.article_revision OWNER TO postgres;

--
-- Name: user__insert__public__article_revision; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views.user__insert__public__article_revision AS
 SELECT article_revision.id,
    article_revision.article,
    article_revision.text,
    article_revision.project,
    article_revision.name,
    article_revision."textFormatted"
   FROM public.article_revision;


ALTER TABLE hdb_views.user__insert__public__article_revision OWNER TO postgres;

--
-- Name: project; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    create_at date DEFAULT now(),
    create_by integer NOT NULL
);


ALTER TABLE public.project OWNER TO postgres;

--
-- Name: user__insert__public__project; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views.user__insert__public__project AS
 SELECT project.id,
    project.name,
    project.description,
    project.create_at,
    project.create_by
   FROM public.project;


ALTER TABLE hdb_views.user__insert__public__project OWNER TO postgres;

--
-- Name: project_administrator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_administrator (
    id integer NOT NULL,
    project_id integer NOT NULL,
    administrator_id integer NOT NULL,
    unique_administrator text
);


ALTER TABLE public.project_administrator OWNER TO postgres;

--
-- Name: user__insert__public__project_administrator; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views.user__insert__public__project_administrator AS
 SELECT project_administrator.id,
    project_administrator.project_id,
    project_administrator.administrator_id,
    project_administrator.unique_administrator
   FROM public.project_administrator;


ALTER TABLE hdb_views.user__insert__public__project_administrator OWNER TO postgres;

--
-- Name: project_writer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_writer (
    id integer NOT NULL,
    project_id integer NOT NULL,
    writer_id integer NOT NULL,
    unique_writer text NOT NULL
);


ALTER TABLE public.project_writer OWNER TO postgres;

--
-- Name: user__insert__public__project_writer; Type: VIEW; Schema: hdb_views; Owner: postgres
--

CREATE VIEW hdb_views.user__insert__public__project_writer AS
 SELECT project_writer.id,
    project_writer.project_id,
    project_writer.writer_id,
    project_writer.unique_writer
   FROM public.project_writer;


ALTER TABLE hdb_views.user__insert__public__project_writer OWNER TO postgres;

--
-- Name: article_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.article_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.article_comment_id_seq OWNER TO postgres;

--
-- Name: article_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.article_comment_id_seq OWNED BY public.article_comment.id;


--
-- Name: article_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.article_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.article_id_seq OWNER TO postgres;

--
-- Name: article_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.article_id_seq OWNED BY public.article.id;


--
-- Name: article_revision_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.article_revision_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.article_revision_id_seq OWNER TO postgres;

--
-- Name: article_revision_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.article_revision_id_seq OWNED BY public.article_revision.id;


--
-- Name: project_administrator_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_administrator_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_administrator_id_seq OWNER TO postgres;

--
-- Name: project_administrator_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_administrator_id_seq OWNED BY public.project_administrator.id;


--
-- Name: project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_id_seq OWNER TO postgres;

--
-- Name: project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_id_seq OWNED BY public.project.id;


--
-- Name: project_writer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_writer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_writer_id_seq OWNER TO postgres;

--
-- Name: project_writer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_writer_id_seq OWNED BY public.project_writer.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    create_at timestamp with time zone DEFAULT now() NOT NULL,
    "firstName" text,
    "lastName" text,
    ministry text,
    management text,
    confirmed boolean DEFAULT false
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: remote_schemas id; Type: DEFAULT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.remote_schemas ALTER COLUMN id SET DEFAULT nextval('hdb_catalog.remote_schemas_id_seq'::regclass);


--
-- Name: user__insert__public__article id; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views.user__insert__public__article ALTER COLUMN id SET DEFAULT nextval('public.article_id_seq'::regclass);


--
-- Name: user__insert__public__article_comment id; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views.user__insert__public__article_comment ALTER COLUMN id SET DEFAULT nextval('public.article_comment_id_seq'::regclass);


--
-- Name: user__insert__public__article_comment created_at; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views.user__insert__public__article_comment ALTER COLUMN created_at SET DEFAULT now();


--
-- Name: user__insert__public__article_revision id; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views.user__insert__public__article_revision ALTER COLUMN id SET DEFAULT nextval('public.article_revision_id_seq'::regclass);


--
-- Name: user__insert__public__project id; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views.user__insert__public__project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: user__insert__public__project create_at; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views.user__insert__public__project ALTER COLUMN create_at SET DEFAULT now();


--
-- Name: user__insert__public__project_administrator id; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views.user__insert__public__project_administrator ALTER COLUMN id SET DEFAULT nextval('public.project_administrator_id_seq'::regclass);


--
-- Name: user__insert__public__project_writer id; Type: DEFAULT; Schema: hdb_views; Owner: postgres
--

ALTER TABLE ONLY hdb_views.user__insert__public__project_writer ALTER COLUMN id SET DEFAULT nextval('public.project_writer_id_seq'::regclass);


--
-- Name: article id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article ALTER COLUMN id SET DEFAULT nextval('public.article_id_seq'::regclass);


--
-- Name: article_comment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_comment ALTER COLUMN id SET DEFAULT nextval('public.article_comment_id_seq'::regclass);


--
-- Name: article_revision id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_revision ALTER COLUMN id SET DEFAULT nextval('public.article_revision_id_seq'::regclass);


--
-- Name: project id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project ALTER COLUMN id SET DEFAULT nextval('public.project_id_seq'::regclass);


--
-- Name: project_administrator id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_administrator ALTER COLUMN id SET DEFAULT nextval('public.project_administrator_id_seq'::regclass);


--
-- Name: project_writer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_writer ALTER COLUMN id SET DEFAULT nextval('public.project_writer_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: event_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_log (id, schema_name, table_name, trigger_name, payload, delivered, error, tries, created_at, locked, next_retry_at, archived) FROM stdin;
\.


--
-- Data for Name: event_triggers; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_triggers (name, type, schema_name, table_name, configuration, comment) FROM stdin;
\.


--
-- Data for Name: hdb_allowlist; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_allowlist (collection_name) FROM stdin;
\.


--
-- Data for Name: hdb_computed_field; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_computed_field (table_schema, table_name, computed_field_name, definition, comment) FROM stdin;
\.


--
-- Data for Name: hdb_function; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_function (function_schema, function_name, is_system_defined, configuration) FROM stdin;
\.


--
-- Data for Name: hdb_permission; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_permission (table_schema, table_name, role_name, perm_type, perm_def, comment, is_system_defined) FROM stdin;
public	project	user	delete	{"filter": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}	\N	f
public	project_administrator	user	delete	{"filter": {"_or": [{"project": {"owner": {"id": {"_eq": "X-Hasura-User-Id"}}}}, {"project": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}]}}	\N	f
public	project_writer	user	delete	{"filter": {"project": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}}	\N	f
public	project	user	insert	{"set": {}, "check": {}, "columns": ["create_by", "description", "name"]}	\N	f
public	project	user	update	{"set": {}, "filter": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}, "columns": ["create_by", "description", "name"]}	\N	f
public	article	user	insert	{"set": {}, "check": {"_or": [{"projectByProject": {"project_writers": {"writer_id": {"_eq": "X-Hasura-User-Id"}}}}, {"projectByProject": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}]}, "columns": ["article_id", "number", "project", "status", "texte", "titre", "unique_article_projet"]}	\N	f
public	article	user	update	{"set": {}, "filter": {"_or": [{"projectByProject": {"project_writers": {"writer_id": {"_eq": "X-Hasura-User-Id"}}}}, {"projectByProject": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}]}, "columns": ["status"]}	\N	f
public	article	user	select	{"filter": {"_or": [{"projectByProject": {"project_writers": {"writer_id": {"_eq": "X-Hasura-User-Id"}}}}, {"projectByProject": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}]}, "columns": ["id", "project", "status", "article_id", "number", "texte", "titre", "unique_article_projet"], "computed_fields": [], "allow_aggregations": true}	\N	f
public	project	user	select	{"filter": {"_or": [{"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}, {"project_writers": {"writer_id": {"_eq": "X-Hasura-User-Id"}}}]}, "columns": ["create_at", "create_by", "id", "description", "name"], "computed_fields": [], "allow_aggregations": true}	\N	f
public	project_administrator	user	select	{"filter": {"_or": [{"project": {"project_writers": {"writer_id": {"_eq": "X-Hasura-User-Id"}}}}, {"project": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}]}, "columns": ["id", "project_id", "administrator_id"], "computed_fields": [], "allow_aggregations": true}	\N	f
public	project_writer	user	select	{"filter": {"_or": [{"project": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}, {"project": {"project_writers": {"writer_id": {"_eq": "X-Hasura-User-Id"}}}}]}, "columns": ["id", "project_id", "writer_id"], "computed_fields": [], "allow_aggregations": true}	\N	f
public	project_administrator	user	insert	{"set": {}, "check": {"_or": [{"project": {"owner": {"id": {"_eq": "X-Hasura-User-Id"}}}}, {"project": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}]}, "columns": ["administrator_id", "project_id", "unique_administrator"]}	\N	f
public	user	user	select	{"filter": {}, "columns": ["email", "firstName", "id", "lastName", "management", "ministry", "username"], "computed_fields": [], "allow_aggregations": false}	\N	f
public	project_writer	user	insert	{"set": {}, "check": {"_or": [{"project": {"owner": {"id": {"_eq": "X-Hasura-User-Id"}}}}, {"project": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}]}, "columns": ["project_id", "unique_writer", "writer_id"]}	\N	f
public	user	user	update	{"set": {}, "filter": {"id": {"_eq": "X-Hasura-User-Id"}}, "columns": ["firstName", "lastName", "management", "ministry"]}	\N	f
public	article_comment	user	update	{"set": {}, "filter": {"_or": [{"user_id": {"_eq": "X-Hasura-User-Id"}}, {"article": {"projectByProject": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}}]}, "columns": ["comment"]}	\N	f
public	article_comment	user	delete	{"filter": {"_or": [{"user_id": {"_eq": "X-Hasura-User-Id"}}, {"article": {"projectByProject": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}}]}}	\N	f
public	article_comment	user	insert	{"set": {}, "check": {"_or": [{"article": {"projectByProject": {"project_writers": {"user": {"id": {"_eq": "X-Hasura-User-Id"}}}}}}, {"article": {"projectByProject": {"project_administrators": {"administrator": {"id": {"_eq": "X-Hasura-User-Id"}}}}}}]}, "columns": ["article_id", "comment", "reply_id", "user_id"]}	\N	f
public	article_comment	user	select	{"filter": {"_or": [{"article": {"projectByProject": {"project_writers": {"user": {"id": {"_eq": "X-Hasura-User-Id"}}}}}}, {"article": {"projectByProject": {"project_administrators": {"administrator": {"id": {"_eq": "X-Hasura-User-Id"}}}}}}]}, "columns": ["article_id", "comment", "created_at", "id", "reply_id", "user_id"], "computed_fields": [], "allow_aggregations": false}	\N	f
public	article_revision	user	insert	{"set": {}, "check": {"_or": [{"articleByArticle": {"projectByProject": {"project_writers": {"writer_id": {"_eq": "X-Hasura-User-Id"}}}}}, {"articleByArticle": {"projectByProject": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}}]}, "columns": ["article", "name", "project", "text", "textFormatted"]}	\N	f
public	article_revision	user	select	{"filter": {"_or": [{"articleByArticle": {"projectByProject": {"project_writers": {"writer_id": {"_eq": "X-Hasura-User-Id"}}}}}, {"articleByArticle": {"projectByProject": {"project_administrators": {"administrator_id": {"_eq": "X-Hasura-User-Id"}}}}}]}, "columns": ["article", "id", "name", "project", "text", "textFormatted"], "computed_fields": [], "allow_aggregations": true}	\N	f
\.


--
-- Data for Name: hdb_query_collection; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_query_collection (collection_name, collection_defn, comment, is_system_defined) FROM stdin;
\.


--
-- Data for Name: hdb_relationship; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_relationship (table_schema, table_name, rel_name, rel_type, rel_def, comment, is_system_defined) FROM stdin;
public	article	projectByProject	object	{"foreign_key_constraint_on": "project"}	\N	f
public	article	article_revisions	array	{"foreign_key_constraint_on": {"table": "article_revision", "column": "article"}}	\N	f
public	article_revision	articleByArticle	object	{"foreign_key_constraint_on": "article"}	\N	f
public	project	articles	array	{"foreign_key_constraint_on": {"table": "article", "column": "project"}}	\N	f
hdb_catalog	hdb_table	detail	object	{"manual_configuration": {"remote_table": {"name": "tables", "schema": "information_schema"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	primary_key	object	{"manual_configuration": {"remote_table": {"name": "hdb_primary_key", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	columns	array	{"manual_configuration": {"remote_table": {"name": "columns", "schema": "information_schema"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	foreign_key_constraints	array	{"manual_configuration": {"remote_table": {"name": "hdb_foreign_key_constraint", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	relationships	array	{"manual_configuration": {"remote_table": {"name": "hdb_relationship", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	permissions	array	{"manual_configuration": {"remote_table": {"name": "hdb_permission_agg", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	check_constraints	array	{"manual_configuration": {"remote_table": {"name": "hdb_check_constraint", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	hdb_table	unique_constraints	array	{"manual_configuration": {"remote_table": {"name": "hdb_unique_constraint", "schema": "hdb_catalog"}, "column_mapping": {"table_name": "table_name", "table_schema": "table_schema"}}}	\N	t
hdb_catalog	event_log	trigger	object	{"manual_configuration": {"remote_table": {"name": "event_triggers", "schema": "hdb_catalog"}, "column_mapping": {"trigger_name": "name"}}}	\N	t
hdb_catalog	event_triggers	events	array	{"manual_configuration": {"remote_table": {"name": "event_log", "schema": "hdb_catalog"}, "column_mapping": {"name": "trigger_name"}}}	\N	t
hdb_catalog	event_invocation_logs	event	object	{"foreign_key_constraint_on": "event_id"}	\N	t
hdb_catalog	event_log	logs	array	{"foreign_key_constraint_on": {"table": {"name": "event_invocation_logs", "schema": "hdb_catalog"}, "column": "event_id"}}	\N	t
hdb_catalog	hdb_function_agg	return_table_info	object	{"manual_configuration": {"remote_table": {"name": "hdb_table", "schema": "hdb_catalog"}, "column_mapping": {"return_type_name": "table_name", "return_type_schema": "table_schema"}}}	\N	t
public	project_administrator	project	object	{"foreign_key_constraint_on": "project_id"}	\N	f
public	project_administrator	administrator	object	{"foreign_key_constraint_on": "administrator_id"}	\N	f
public	project	project_administrators	array	{"foreign_key_constraint_on": {"table": "project_administrator", "column": "project_id"}}	\N	f
public	user	project_administrators	array	{"foreign_key_constraint_on": {"table": "project_administrator", "column": "administrator_id"}}	\N	f
public	project	project_writers	array	{"foreign_key_constraint_on": {"table": "project_writer", "column": "project_id"}}	\N	f
public	project	owner	object	{"foreign_key_constraint_on": "create_by"}	\N	f
public	project_writer	project	object	{"foreign_key_constraint_on": "project_id"}	\N	f
public	project_writer	user	object	{"foreign_key_constraint_on": "writer_id"}	\N	f
public	article_comment	user	object	{"foreign_key_constraint_on": "user_id"}	\N	f
public	article_comment	article	object	{"foreign_key_constraint_on": "article_id"}	\N	f
public	article_comment	responses	array	{"manual_configuration": {"remote_table": "article_comment", "column_mapping": {"id": "reply_id"}}}	\N	f
\.


--
-- Data for Name: hdb_schema_update_event; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_schema_update_event (instance_id, occurred_at) FROM stdin;
6a52af85-bbf9-4fa9-9c3c-eb44e855c143	2020-04-30 07:19:40.819721+00
\.


--
-- Data for Name: hdb_table; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_table (table_schema, table_name, is_system_defined, is_enum, configuration) FROM stdin;
public	article	f	f	{}
public	article_revision	f	f	{}
public	project	f	f	{}
hdb_catalog	hdb_table	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
information_schema	tables	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
information_schema	schemata	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
information_schema	views	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	hdb_primary_key	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
information_schema	columns	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	hdb_foreign_key_constraint	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	hdb_relationship	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	hdb_permission_agg	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	hdb_check_constraint	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	hdb_unique_constraint	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	event_triggers	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	event_log	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	event_invocation_logs	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	hdb_function_agg	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	hdb_function	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	remote_schemas	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	hdb_version	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	hdb_query_collection	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
hdb_catalog	hdb_allowlist	t	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
public	user	f	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
public	project_administrator	f	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
public	project_writer	f	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
public	article_comment	f	f	{"custom_root_fields": {"delete": null, "insert": null, "select": null, "update": null, "select_by_pk": null, "select_aggregate": null}, "custom_column_names": {}}
\.


--
-- Data for Name: hdb_version; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_version (hasura_uuid, version, upgraded_on, cli_state, console_state) FROM stdin;
63fc9416-deee-4978-ac63-45c9cf020cf1	28	2019-12-16 09:35:30.995117+00	{}	{"telemetryNotificationShown": true}
\.


--
-- Data for Name: remote_schemas; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.remote_schemas (id, name, definition, comment) FROM stdin;
\.


--
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.article (id, titre, number, article_id, unique_article_projet, status, project, texte, code) FROM stdin;
3	Décret n°2000-782 du 23 août 2000 fixant les conditions exceptionnelles d'intégration d'agents non titulaires du ministère de l'emploi et de la solidarité et de certains de ses établissements publics dans des corps de fonctionnaires de catégorie A. - Annexe	annexe	LEGIARTI000024779416	LEGIARTI000024779416-2	0	2	TABLEAU DE CORRESPONDANCEI. - Ministre chargé des affaires socialesCATÉGORIES D'AGENTS non titulairesFONCTIONS EXERCÉESCORPS DE FONCTIONNAIRESAgents non titulaires relevant du décret n° 78-457 du 17 mars 1978 ou recrutés par référence à ce décret (hors-catégorie, 1re catégorie et 2e catégorie).Fonctions administratives de conception, d'encadrement et fonctions informatiques.Attachés d'administration centrale du ministère de l'emploi et de la solidarité.Fonctions de mise en œuvre des politiques sanitaires, médico-sociales et sociales (conception, encadrement, fonctions administratives et informatiques).Inspecteurs des affaires sanitaires sociales.Fonctions de statisticien et d'économiste.Chargés de mission de l'Institut national de la statistique et des études économiques.Fonctions d'ingénieur.Ingénieurs des travaux publics de l'État.Agents non titulaires recrutés sur le fondement d'un contrat individuel du niveau de la catégorie AFonctions administratives de conception, d'encadrement, fonctions informatiques et fonctions de formation aux carrières dans le domaine sanitaire et social.Attachés d'administration centrale du ministère de l'emploi et de la solidarité.Fonctions de mise en œuvre des politiques sanitaires, médico-sociales et sociales (conception, encadrement, fonctions administratives et informatiquesInspecteurs des affaires sanitaires et sociales.Fonctions de statisticien et d'économiste.Chargés de mission de l'Institut national de la statistique et des études économiquesFonctions d'ingénieur.Ingénieurs des travaux publics de l'État.Fonctions de psychologue.Psychologues de la protection judiciaire de la jeunesse.Agents non titulaires des Instituts nationaux de jeunes sourds de Paris, Chambéry, Bordeaux et Metz et de l'Institut national des jeunes aveugles recrutés sur le fondement d'un contrat individuel du niveau de la catégorie A.Fonctions de mise en œuvre des politiques sanitaires, médico-sociales et sociales (conception, encadrement fonctions administratives et informatiques)Inspecteurs des affaires sanitaires et sociales.Fonctions d'ingénieur.Ingénieurs des travaux publics de l'ÉtatFonctions de psychologue.Psychologues de la protection judiciaire de la jeunesse.Agents non titulaires du centre de sécurité sociale pour les travailleurs migrants recrutés sur le fondement d'un contrat individuel du niveau de la catégorie A.Fonctions de mise en œuvre des politiques sanitaires, médico-sociales et sociales (conception, encadrement, fonctions administratives et informatiques).Inspecteurs des affaires sanitaires et sociales.Fonctions de traducteur.Traducteurs du ministère des affaires étrangèresAgents non titulaires de l'École nationale de la santé publique recrutés sur le fondement d'un contrat individuel du niveau de la catégorie A.Fonctions de mise en œuvre des politiques sanitaires, médico-sociales et sociales (conception, encadrement, fonctions administratives et informatiques).Inspecteurs des affaires sanitaires et socialesFonctions de formation aux carrières dans le domaine de la santé publique, de l'action et de la protection sociale.Attachés d'administration centrale du ministère de l'emploi et de la solidarité..II- - Ministre chargé du travail, de l'emploi et de la formation professionnelleCATÉGORIES D'AGENTS non titulairesFONCTIONS EXERCÉESCORPS DE FONCTIONNAIRESAgents non titulaires relevant du décret n° 78-457 du 17 mars 1978 ou recrutés par référence à ce décret (hors-catégorie, 1re catégorie et 2e catégorie).Fonctions administratives de conception, d'encadrement et fonctions informatiques.Attachés d'administration centrale du ministère de l'emploi et de la solidarité.Fonctions de statisticien et d'économiste.Chargés de mission de l'Institut national de la statistique et des études économiques.Fonctions d'ingénieur.Ingénieurs des travaux publics de l'État.Fonctions d'ingénieur de sécurité et de prévention.Ingénieurs de l'industrie et des mines.Agents non titulaires recrutés sur le fondement d'un contrat individuel du niveau de la catégorie A.Fonctions administratives de conception, d'encadrement et fonctions informatiques.Attachés d'administration centrale du ministère de l'emploi et de la solidarité.Fonctions de statisticien et d'économiste.Chargés de mission de l'Institut national de la statistique et des études économiques.Fonctions d'ingénieur.Ingénieurs des travaux publics de I' ÉtatFonctions d'ingénieur de sécurité et de prévention.Ingénieurs de l'industrie et des mines.	\N
6	Ordonnance n° 2000-219 du 8 mars 2000 relative à l'état civil à Mayotte	22	LEGIARTI000006285033	LEGIARTI000006285033-2	0	2	   L'Etat met à la disposition des communes de Mayotte le premier équipement informatique leur permettant d'assurer la tenue informatisée de l'état civil.   Les communes sont compétentes pour maintenir, remplacer et adapter à leurs frais les matériels informatiques requis pour assurer la tenue informatisée des actes de l'état civil.	\N
13	Décret n° 2016-327 du 17 mars 2016 relatif à l'organisation du transport ferroviaire de voyageurs et portant diverses dispositions relatives à la gestion financière et comptable de SNCF Mobilités - Chapitre préliminaire  Dispositions communes	1	LEGIARTI000032260729	LEGIARTI000032260729-4	1	4	L'établissement public industriel et commercial SNCF Mobilités met à disposition des voyageurs, de manière précise et accessible et dans un délai adapté, toutes les informations utiles portant sur les horaires des trains, les tarifs, les conditions générales d'exploitation des services et les prestations complémentaires qu'il fournit.Il prend toute disposition visant à la plus large diffusion de ces informations.L'acheteur est informé des conditions d'utilisation des titres de transport. Les modifications occasionnelles du service doivent être portées à la connaissance du public.	\N
5	Code de la santé publique	R3513-8	LEGIARTI000033045608	LEGIARTI000033045608-2	0	2	I.-L'établissement public mentionné à l'article L. 3513-10 peut demander aux fabricants et importateurs : 1° Des informations complémentaires s'il considère que les informations présentées au titre de l'article L. 3513-10 sont incomplètes ; 2° Des informations supplémentaires concernant les informations transmises au titre de l'article L. 3513-11, notamment les aspects touchant à la sécurité et à la qualité ou à tout effet indésirable éventuel des produits. II.-Les demandes mentionnées au 1° du I n'ont pas d'incidence sur le délai mentionné à l'article L. 3513-10.	\N
4	Code de l'action sociale et des familles - Partie réglementaire > Livre II : Différentes formes d'aide et d'action sociales > Titre Ier : Famille > Chapitre Ier : Associations familiales	R211-2-4	LEGIARTI000025841918	LEGIARTI000025841918-2	0	2	Les données relatives aux électeurs inscrits sur les listes électorales ainsi que les données relatives aux votes font l'objet de traitements informatiques distincts, dédiés et isolés, respectivement dénommés " fichier des électeurs " et " urne électronique ". En cas de recours à un même système de vote pour plusieurs scrutins, chacun de ces scrutins doit être isolé sur un système informatique indépendant. Le fichier des électeurs comporte le nombre de suffrages attribué à chaque association familiale ou à chaque union départementale en application de l'article L. 211-9 . Les données du fichier " urne électronique " font l'objet d'un chiffrement.	\N
2	Code de la sécurité sociale - Partie réglementaire - Décrets simples > Livre 1 : Généralités - Dispositions communes à tout ou partie des régimes de base > Titre 1 : Généralités > Chapitre 4 bis : Organisation comptable > Section 2 : Contrôle interne > Sous-section 1 : Dispositions propres aux organismes nationaux, organisés ou non en réseau, assurant la gestion d'un régime obligatoire de base et à l'Agence centrale des organismes de sécurité sociale > Paragraphe 3 : Contrôle interne des systèmes d'information	D114-4-11	LEGIARTI000028075563	LEGIARTI000028075563-2	0	2	Le directeur et l'agent comptable de l'organisme national assurent la maîtrise d'ouvrage des applications informatiques nationales. Toutefois, la maîtrise d'ouvrage d'une application informatique nationale peut être déléguée à une caisse ou à une union de caisses relevant d'un organisme national. Les modalités de cette délégation sont définies par une convention signée par les directeurs et les agents comptables desdits organismes. Le directeur de l'organisme national assure la maîtrise d'œuvre des applications informatiques nationales. Toutefois, la maîtrise d'œuvre d'une application informatique nationale peut être déléguée à une caisse ou à une union de caisses relevant d'un organisme national. Les modalités de cette délégation sont définies par une convention signée par les directeurs desdits organismes.	\N
8	Code de la sécurité sociale - Partie réglementaire - Décrets simples > Livre 1 : Généralités - Dispositions communes à tout ou partie des régimes de base > Titre 1 : Généralités > Chapitre 4 bis : Organisation comptable > Section 2 : Contrôle interne > Sous-section 1 : Dispositions propres aux organismes nationaux, organisés ou non en réseau, assurant la gestion d'un régime obligatoire de base et à l'Agence centrale des organismes de sécurité sociale > Paragraphe 3 : Contrôle interne des systèmes d'information	D114-4-11	LEGIARTI000028075563	LEGIARTI000028075563-3	2	3	Le directeur et l'agent comptable de l'organisme national assurent la maîtrise d'ouvrage des applications informatiques nationales. Toutefois, la maîtrise d'ouvrage d'une application informatique nationale peut être déléguée à une caisse ou à une union de caisses relevant d'un organisme national. Les modalités de cette délégation sont définies par une convention signée par les directeurs et les agents comptables desdits organismes. Le directeur de l'organisme national assure la maîtrise d'œuvre des applications informatiques nationales. Toutefois, la maîtrise d'œuvre d'une application informatique nationale peut être déléguée à une caisse ou à une union de caisses relevant d'un organisme national. Les modalités de cette délégation sont définies par une convention signée par les directeurs desdits organismes.	\N
9	Décret n°2000-782 du 23 août 2000 fixant les conditions exceptionnelles d'intégration d'agents non titulaires du ministère de l'emploi et de la solidarité et de certains de ses établissements publics dans des corps de fonctionnaires de catégorie A. - Annexe	annexe	LEGIARTI000024779416	LEGIARTI000024779416-3	0	3	TABLEAU DE CORRESPONDANCEI. - Ministre chargé des affaires socialesCATÉGORIES D'AGENTS non titulairesFONCTIONS EXERCÉESCORPS DE FONCTIONNAIRESAgents non titulaires relevant du décret n° 78-457 du 17 mars 1978 ou recrutés par référence à ce décret (hors-catégorie, 1re catégorie et 2e catégorie).Fonctions administratives de conception, d'encadrement et fonctions informatiques.Attachés d'administration centrale du ministère de l'emploi et de la solidarité.Fonctions de mise en œuvre des politiques sanitaires, médico-sociales et sociales (conception, encadrement, fonctions administratives et informatiques).Inspecteurs des affaires sanitaires sociales.Fonctions de statisticien et d'économiste.Chargés de mission de l'Institut national de la statistique et des études économiques.Fonctions d'ingénieur.Ingénieurs des travaux publics de l'État.Agents non titulaires recrutés sur le fondement d'un contrat individuel du niveau de la catégorie AFonctions administratives de conception, d'encadrement, fonctions informatiques et fonctions de formation aux carrières dans le domaine sanitaire et social.Attachés d'administration centrale du ministère de l'emploi et de la solidarité.Fonctions de mise en œuvre des politiques sanitaires, médico-sociales et sociales (conception, encadrement, fonctions administratives et informatiquesInspecteurs des affaires sanitaires et sociales.Fonctions de statisticien et d'économiste.Chargés de mission de l'Institut national de la statistique et des études économiquesFonctions d'ingénieur.Ingénieurs des travaux publics de l'État.Fonctions de psychologue.Psychologues de la protection judiciaire de la jeunesse.Agents non titulaires des Instituts nationaux de jeunes sourds de Paris, Chambéry, Bordeaux et Metz et de l'Institut national des jeunes aveugles recrutés sur le fondement d'un contrat individuel du niveau de la catégorie A.Fonctions de mise en œuvre des politiques sanitaires, médico-sociales et sociales (conception, encadrement fonctions administratives et informatiques)Inspecteurs des affaires sanitaires et sociales.Fonctions d'ingénieur.Ingénieurs des travaux publics de l'ÉtatFonctions de psychologue.Psychologues de la protection judiciaire de la jeunesse.Agents non titulaires du centre de sécurité sociale pour les travailleurs migrants recrutés sur le fondement d'un contrat individuel du niveau de la catégorie A.Fonctions de mise en œuvre des politiques sanitaires, médico-sociales et sociales (conception, encadrement, fonctions administratives et informatiques).Inspecteurs des affaires sanitaires et sociales.Fonctions de traducteur.Traducteurs du ministère des affaires étrangèresAgents non titulaires de l'École nationale de la santé publique recrutés sur le fondement d'un contrat individuel du niveau de la catégorie A.Fonctions de mise en œuvre des politiques sanitaires, médico-sociales et sociales (conception, encadrement, fonctions administratives et informatiques).Inspecteurs des affaires sanitaires et socialesFonctions de formation aux carrières dans le domaine de la santé publique, de l'action et de la protection sociale.Attachés d'administration centrale du ministère de l'emploi et de la solidarité..II- - Ministre chargé du travail, de l'emploi et de la formation professionnelleCATÉGORIES D'AGENTS non titulairesFONCTIONS EXERCÉESCORPS DE FONCTIONNAIRESAgents non titulaires relevant du décret n° 78-457 du 17 mars 1978 ou recrutés par référence à ce décret (hors-catégorie, 1re catégorie et 2e catégorie).Fonctions administratives de conception, d'encadrement et fonctions informatiques.Attachés d'administration centrale du ministère de l'emploi et de la solidarité.Fonctions de statisticien et d'économiste.Chargés de mission de l'Institut national de la statistique et des études économiques.Fonctions d'ingénieur.Ingénieurs des travaux publics de l'État.Fonctions d'ingénieur de sécurité et de prévention.Ingénieurs de l'industrie et des mines.Agents non titulaires recrutés sur le fondement d'un contrat individuel du niveau de la catégorie A.Fonctions administratives de conception, d'encadrement et fonctions informatiques.Attachés d'administration centrale du ministère de l'emploi et de la solidarité.Fonctions de statisticien et d'économiste.Chargés de mission de l'Institut national de la statistique et des études économiques.Fonctions d'ingénieur.Ingénieurs des travaux publics de I' ÉtatFonctions d'ingénieur de sécurité et de prévention.Ingénieurs de l'industrie et des mines.	\N
10	Ordonnance n° 2000-219 du 8 mars 2000 relative à l'état civil à Mayotte	22	LEGIARTI000006285033	LEGIARTI000006285033-3	1	3	   L'Etat met à la disposition des communes de Mayotte le premier équipement informatique leur permettant d'assurer la tenue informatisée de l'état civil.   Les communes sont compétentes pour maintenir, remplacer et adapter à leurs frais les matériels informatiques requis pour assurer la tenue informatisée des actes de l'état civil.	\N
11	Code de l'action sociale et des familles - Partie réglementaire > Livre II : Différentes formes d'aide et d'action sociales > Titre Ier : Famille > Chapitre Ier : Associations familiales	R211-2-4	LEGIARTI000025841918	LEGIARTI000025841918-3	1	3	Les données relatives aux électeurs inscrits sur les listes électorales ainsi que les données relatives aux votes font l'objet de traitements informatiques distincts, dédiés et isolés, respectivement dénommés " fichier des électeurs " et " urne électronique ". En cas de recours à un même système de vote pour plusieurs scrutins, chacun de ces scrutins doit être isolé sur un système informatique indépendant. Le fichier des électeurs comporte le nombre de suffrages attribué à chaque association familiale ou à chaque union départementale en application de l'article L. 211-9 . Les données du fichier " urne électronique " font l'objet d'un chiffrement.	\N
12	Ordonnance n° 2000-219 du 8 mars 2000 relative à l'état civil à Mayotte	22	LEGIARTI000006285033	LEGIARTI000006285033-4	2	4	   L'Etat met à la disposition des communes de Mayotte le premier équipement informatique leur permettant d'assurer la tenue informatisée de l'état civil.   Les communes sont compétentes pour maintenir, remplacer et adapter à leurs frais les matériels informatiques requis pour assurer la tenue informatisée des actes de l'état civil.	\N
49	L1111-8-1	L1111-8-1	LEGIARTI000037825798	LEGIARTI000037825798-2	0	2	<p>Le numéro d'inscription au répertoire national d'identification des personnes physiques est utilisé comme identifiant de santé des personnes pour leur prise en charge à des fins sanitaires et médico-sociales, dans les conditions prévues à l'article L. 1110-4.</p><p>Un décret en Conseil d'Etat, pris après avis de la Commission nationale de l'informatique et des libertés, précise les modalités d'utilisation de cet identifiant, notamment afin d'en empêcher l'utilisation à des fins autres que sanitaires et médico-sociales.</p>	\N
50	R555-2	R555-2	LEGIARTI000038607960	LEGIARTI000038607960-4	1	4	<p>Lorsque le juge administratif est saisi, sur le fondement de l'article 49 de la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, d'une demande en référé relative au prononcé de toutes mesures utiles de nature à éviter toute dissimulation ou toute disparition de données à caractère personnel par l'Etat, une collectivité territoriale, toute autre personne publique ainsi que toute personne privée chargée d'une mission de service public, il est statué suivant la procédure de référé instituée par les dispositions de l'article L. 521-3.</p><p></p>	\N
51	R555-1	R555-1	LEGIARTI000038607971	LEGIARTI000038607971-4	2	4	<p>Lorsque le juge administratif est saisi par le président de la Commission nationale de l'informatique et des libertés, sur le fondement de l'article 21 de la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, d'une demande en référé concernant la mise en oeuvre d'un traitement ou l'exploitation de données à caractère personnel par l'Etat, une collectivité territoriale, toute autre personne publique ainsi que toute personne privée chargée d'une mission de service public, il est statué suivant la procédure de référé instituée par les dispositions de l'article L. 521-2.</p>	\N
53	3	3	LEGIARTI000041765183	LEGIARTI000041765183-2	0	2	<p><br/>Seuls ont accès, à raison de leurs attributions et dans la limite du besoin d'en connaître, aux données à caractère personnel et informations enregistrées dans le présent traitement :<br/>1° Les agents du ministère de la justice affectés au service chargé des développements informatiques du secrétariat général du ministère de la justice, individuellement désignés par le secrétaire général ;<br/>2° Les agents du bureau du droit des obligations individuellement désignés par le directeur des affaires civiles et du sceau.</p>	\N
52	226-23	226-23	LEGIARTI000037825482	LEGIARTI000037825482-2	0	2	<p>Dans les cas prévus aux articles 226-16 à 226-22-2, l'effacement de tout ou partie des données à caractère personnel faisant l'objet du traitement ayant donné lieu à l'infraction peut être ordonné. Les membres et les agents de la Commission nationale de l'informatique et des libertés sont habilités à constater l'effacement de ces données.</p>	\N
7	Loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés - Titre IV : Dispositions applicables aux traitements intéressant la sûreté de l'Etat et la défense  > Titre Ier : Dispositions communes > Chapitre II : La Commission nationale de l'informatique et des libertés > Titre II : Traitements relevant du régime de protection des données à caractère personnel prévu par le règlement (UE) 2016/679 du 27 avril 2016 > Chapitre III :  Obligations incombant au responsable du traitement et au sous-traitant > Chapitre XIII : Dispositions applicables aux traitements relevant de la directive (UE 2016/680 du Parlement européen et du Conseil du 27 avril 2016 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel par les autorités compétentes à des fins de prévention et de détection des infractions pénales, d'enquêtes et de poursuites en la matière ou d'exécution de sanctions pénales, et à la libre circulation de ces données, et abrogeant la décision-cadre 2008/977/ JAI du Conseil > Titre III : Dispositions applicables aux traitements relevant de la directive (UE) 2016/680 du Parlement européen et du Conseil du 27 avril 2016 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel par les autorités compétentes à des fins de prévention et de détection des infractions pénales, d'enquêtes et de poursuites en la matière ou d'exécution de sanctions pénales, et à la libre circulation de ces données, et abrogeant la décision-cadre 2008/977/JAI du Conseil > Chapitre III : Droits de la personne concernée 	109	LEGIARTI000037817694	LEGIARTI000037817694-2	0	2	I.-Les informations mentionnées aux articles 104 à 106 sont fournies par le responsable de traitement à la personne concernée par tout moyen approprié, y compris par voie électronique et, de manière générale, sous la même forme que la demande. II.-Aucun paiement n'est exigé pour prendre les mesures et fournir ces mêmes informations, sauf en cas de demande manifestement infondée ou abusive. En cas de demande manifestement infondée ou abusive, le responsable de traitement peut également refuser de donner suite à la demande. En cas de contestation, la charge de la preuve du caractère manifestement infondé ou abusif des demandes incombe au responsable de traitement auquel elles sont adressées.	\N
58	L2353-6	L2353-6	LEGIARTI000006902248	LEGIARTI000006902248-2	2	2	<p></p>   Le dirigeant de la société européenne qui décide de lancer une offre publique d'acquisition sur une entreprise peut n'informer le comité de la société européenne qu'une fois l'offre rendue publique.<p></p><p></p>   Dans ce cas, il réunit le comité dans les huit jours suivant la publication de l'offre en vue de lui transmettre des informations écrites et précises sur le contenu de l'offre et sur les conséquences qu'elle est susceptible d'entraîner sur l'emploi.<p></p>	\N
59	R1253-23	R1253-23	LEGIARTI000018537240	LEGIARTI000018537240-2	0	2	<p><br/>Les organisations d'employeurs et de salariés représentatives dans le champ de la convention collective choisie sont informées par l'autorité administrative des agréments délivrés.</p>	\N
60	R5134-35	R5134-35	LEGIARTI000021338065	LEGIARTI000021338065-2	2	2	<p>En application de l'article L. 2323-48, les institutions représentatives du personnel des organismes employeurs, lorsqu'elles existent, sont informées des contrats d'accompagnement dans l'emploi conclus.</p><p></p><p></p>	\N
56	2	2	LEGIARTI000041765180	LEGIARTI000041765180-2	0	2	<p><br/>Les catégories de données à caractère personnel et informations enregistrées dans le traitement prévu à l'article 1er sont extraites des décisions de justice rendues en appel entre le 1er janvier 2017 et le 31 décembre 2019 par les juridictions administratives et les formations civiles des juridictions judiciaires dans les seuls contentieux portant sur l'indemnisation des préjudices corporels.<br/>Elles peuvent comporter des données mentionnées à l'article 6 de la loi du 6 janvier 1978 susvisée et sont constituées par :<br/>1° Les noms et prénoms des personnes physiques mentionnées dans les décisions de justice, à l'exception de ceux des parties. Il est interdit de sélectionner dans le traitement une catégorie particulière de personnes à partir de ces seules données ;<br/>2° Les éléments d'identification des personnes physiques suivants : la date de naissance, le genre, le lien de parenté avec les victimes et le lieu de résidence ;<br/>3° Les données et informations relatives aux préjudices subis, notamment :</p><p><br/>- la nature et l'ampleur des atteintes à l'intégrité, à la dignité et à l'intimité subies, en particulier la description et la localisation des lésions, les durées d'hospitalisation, les préjudices d'agrément, esthétique, d'établissement, d'impréparation ou sexuel, les souffrances physiques et morales endurées, le déficit fonctionnel, ainsi que le préjudice d'accompagnement et d'affection des proches de la victime directe ;<br/>- les différents types de dépenses de santé (notamment frais médicaux, paramédicaux, pharmaceutiques et d'hospitalisation) et d'aménagement (notamment frais de logement, d'équipement et de véhicule adaptés) ;<br/>- le coût et la durée d'intervention des personnes amenées à remplacer ou suppléer les victimes dans leurs activités professionnelles ou parentales durant leur période d'incapacité ;<br/>- les types et l'ampleur des besoins de la victime en assistance par tierce personne ;<br/>- les préjudices scolaires, universitaires ou de formation subis par la victime directe ;<br/>- l'état antérieur de la victime, ses prédispositions pathologiques et autres antécédents médicaux ;</p><p><br/>4° Les données relatives à la vie professionnelle et à la situation financière, notamment la profession, le statut, les perspectives d'évolution et droits à la retraite, le montant des gains et pertes de gains professionnels des victimes, ainsi que des responsables ou personnes tenues à réparation ;<br/>5° Les avis des médecins et experts ayant examiné la victime et le montant de leurs honoraires ;<br/>6° Les données relatives à des infractions et condamnations pénales ;<br/>7° Les données relatives à des fautes civiles ;<br/>8° Le numéro des décisions de justice.<br/>Ces données sont transmises par le Conseil d'Etat et la Cour de cassation au service chargé des développements informatiques du secrétariat général du ministère de la justice. Elles sont extraites des bases de données tenues, d'une part, par la Cour de cassation en application du deuxième alinéa de l'article R. 433-3 du code de l'organisation judiciaire et, d'autre part, par le Conseil d'Etat.<br/>Les noms et prénoms des personnes physiques parties aux instances concernées sont occultés préalablement à leur transmission au secrétariat général du ministère de la justice.</p>	\N
61	R8124-29	R8124-29	LEGIARTI000034423803	LEGIARTI000034423803-2	2	2	<p>L'agent de contrôle veille à informer, selon les modalités prévues par la législation en vigueur, les usagers concernés des suites données à son contrôle.</p>	\N
57	2	2	LEGIARTI000041612349	LEGIARTI000041612349-2	0	2	<p><br/>Les systèmes de vote électronique par internet comportent les mesures physiques et logiques permettant d'assurer la confidentialité des données transmises, notamment la confidentialité des fichiers constitués pour établir les listes électorales, ainsi que la sécurité de l'adressage des moyens d'authentification, de l'émargement, de l'enregistrement et du dépouillement des votes. Ces obligations de confidentialité et de sécurité s'imposent à l'ensemble des personnes intervenant sur le système de vote électronique par internet, notamment aux agents de l'administration chargés de la gestion et de la maintenance du système de vote et à ceux du prestataire, si ces opérations lui ont été confiées.<br/>Les fonctions de sécurité de ces systèmes doivent être conformes au référentiel général de sécurité prévu à l'article 9 de l'ordonnance du 8 décembre 2005 susvisée.<br/>Les données relatives aux électeurs inscrits sur les listes électorales ainsi que les données relatives aux votes font l'objet de traitements informatiques distincts, dédiés et isolés, respectivement dénommés « fichier des électeurs » et « contenu de l'urne électronique ». En cas de recours à un même système de vote pour plusieurs scrutins, chacun de ces scrutins doit être isolé sur un système informatique indépendant.<br/>Chaque système de vote électronique par internet comporte un dispositif de secours offrant les mêmes garanties et les mêmes caractéristiques que le système principal et capable d'en prendre automatiquement le relais en cas de panne n'entraînant pas d'altération des données. Il comporte également un dispositif qui procède à des tests automatiques de manière aléatoire pendant toute la durée du scrutin.</p>	\N
\.


--
-- Data for Name: article_comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.article_comment (id, article_id, user_id, comment, reply_id, created_at) FROM stdin;
3	7	3	Ceci est un nouveau commentaire	\N	2020-03-02 00:00:00
11	7	1	Je me répond a moi même	10	2020-03-02 16:54:00.417017
12	7	1	C'est très pertinent	3	2020-03-03 08:49:13.770063
13	13	1	Bonjour ceci est un commentaire	\N	2020-03-09 10:48:50.344882
14	13	1	ceci etsr une réponse	13	2020-03-09 10:49:17.246029
15	13	2	Commentaire numéro 1	\N	2020-03-09 10:49:41.616805
16	13	1	Ceci est ma réponse	15	2020-03-09 10:50:01.648859
17	13	2	Ceci est une réponse de réponse	15	2020-03-09 10:50:23.561684
18	7	1	encore une réponse	10	2020-03-10 09:28:59.478613
19	12	1	Bonjour a tous	\N	2020-03-10 16:51:32.595684
20	12	1	Bonjour en effet	19	2020-03-10 16:51:40.267573
21	5	1	Ceci est mon commentaire	\N	2020-03-10 16:55:22.089463
22	5	1	ceci est ma réponse	21	2020-03-10 16:55:29.921969
23	7	1	Encore une réponse de plus	10	2020-03-10 16:59:43.399272
24	7	1	Oui je sais bien que c'est pertinent :)	3	2020-03-11 12:15:55.246185
25	7	3	encore une réponse	3	2020-03-11 13:38:45.329822
26	7	1	‚éponse d'une réponse	3	2020-03-11 13:40:36.233492
27	7	1	encore une réponse	3	2020-03-12 13:33:57.038542
29	7	1	Bonjour je peux des répoinses a celui la	3	2020-03-12 13:37:35.428273
28	7	1	dfzezef	27	2020-03-12 13:36:44.966976
30	7	1	J vous répond au plus vite	25	2020-03-17 08:37:57.22874
31	7	1	C'est a dire maintenant	25	2020-03-17 08:39:27.567889
32	7	1	bonjour	24	2020-03-17 16:43:18.371217
33	7	1	En effet bonjour a tous	24	2020-03-17 16:43:27.503959
34	7	1	Tout en bas du commentaire	3	2020-03-17 16:44:04.224142
10	7	1	Ceci est un nouveau commentaire	\N	2020-03-02 16:53:46.200084
35	7	1	Réponse de "En effet bonjour a tous"	24	2020-03-30 10:44:02.030418
36	7	1	réponse de "Réponse de "En effet bonjour a tous""	3	2020-03-30 10:44:27.011742
37	7	1	pas de filet ?	10	2020-03-30 10:45:09.231369
38	7	1	non en effet :s	37	2020-03-30 10:45:18.427196
39	7	1	réponse à tout en bas ca	34	2020-04-07 11:48:55.000979
40	52	1	Ceci est mon premier commentaire ici	\N	2020-04-14 08:59:00.283303
41	52	1	et ca mon deuxieme	40	2020-04-14 08:59:08.729307
42	60	1	ezk,zeioeaoizejapzoikepzaokpoazke. zzefzef zeaf zea ez	\N	2020-04-15 14:56:31.131536
43	60	1	Je répond ce commentaire	42	2020-04-15 14:56:48.307826
44	60	2	Je répond a la réponse\n	43	2020-04-15 14:56:57.284286
45	60	1	Je comprends ta réponse	43	2020-04-15 14:58:36.56594
\.


--
-- Data for Name: article_revision; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.article_revision (id, article, text, project, name, "textFormatted") FROM stdin;
19	60	<p>En application de l&#39;article L. 2323-48, les institutions repr&eacute;sentatives du personnel des organismes employeurs, lorsqu&#39;elles existent, sont inform&eacute;es des contrats <ins class="ice-ins ice-cts-2" data-changedata="" data-cid="2" data-last-change-time="1588164588458" data-time="1588164584535" data-userid="1" data-username="Feldstein Hugo">d&#39;aide &agrave; l&#39;intrusion </ins><del class="ice-del ice-cts-2" data-changedata="" data-cid="2" data-last-change-time="1588164588458" data-time="1588164584535" data-userid="1" data-username="Feldstein Hugo">d&#39;accompagnement</del> dans l&#39;emploi conclus.</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>\n	2	Feldstein Hugo - mercredi 29 avril 2020 à 14:49:48	<p>En application de l'article L. 2323-48, les institutions représentatives du personnel des organismes employeurs, lorsqu'elles existent, sont informées des contrats d'aide à l'intrusion  dans l'emploi conclus.</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>\n
7	7	<p>I.-Les informations mentionn&eacute;es aux articles 104 &agrave; 106 sont fournies par le responsable de traitement &agrave; la personne concern&eacute;e par tout moyen appropri&eacute;, y compris par voie &eacute;lectronique et, de mani&egrave;re g&eacute;n&eacute;rale, sous la m&ecirc;me forme que la demande. II.-Aucun paiement n&#39;est exig&eacute; <del class="ice-del ice-cts-1" data-changedata="" data-cid="3" data-last-change-time="1583145335843" data-time="1583145335843" data-userid="2" data-username="Michelle Dupont">En cas de contestation, la charge de la preuve </del>pour prendre les mesures et fournir ces m&ecirc;mes informations, sauf en cas de demande manifestement infond&eacute;e ou abusive. En cas de demande manifestement infond&eacute;e ou abusive, le responsable de traitement peut &eacute;galement refuser de donner suite &agrave; la demande. <del class="ice-del ice-cts-1" data-changedata="" data-cid="2" data-last-change-time="1583145335843" data-time="1583145335843" data-userid="1" data-username="Feldstein Hugo">En cas de contestation, la charge de la preuve </del>du caract&egrave;re manifestement infond&eacute; ou abusif des demandes incombe au responsable de traitement auquel elles sont adress&eacute;es.</p>\n	2	Hugo - lundi 2 mars 2020 à 11:35:35	\N
9	7	<p>I.-Les informations mentionn&eacute;es aux articles 104 &agrave; 106 sont fournies par le responsable de traitement &agrave; la personne concern&eacute;e par tout moyen appropri&eacute;, y compris par voie &eacute;lectronique et, de mani&egrave;re g&eacute;n&eacute;rale, sous la m&ecirc;me forme que la demande. II.-Aucun paiement n&#39;est exig&eacute; <del class="ice-cts-2 ice-del" data-changedata="" data-cid="3" data-last-change-time="1583145335843" data-time="1583145335843" data-userid="2" data-username="Michelle Dupont">En cas de contestation, la charge de la preuve </del>pour prendre les mesures et fournir ces m&ecirc;mes informations, sauf en cas de demande manifestement infond&eacute;e ou abusive. En cas de demande manifestement infond&eacute;e ou abusive, le responsable de traitement peut &eacute;galement refuser de donner suite &agrave; la demande. <del class="ice-cts-1 ice-del" data-changedata="" data-cid="2" data-last-change-time="1583145335843" data-time="1583145335843" data-userid="1" data-username="Feldstein Hugo">En cas de contestation, la charge de la preuve </del>du caract&egrave;re manifestement infond&eacute; ou abusif des demandes incombe au responsable de traitement auquel elles sont adress&eacute;es.</p>	2	Feldstein Hugo - lundi 02 mars 2020 à 11:52:10	\N
2	2	<p>Le directeur et l&#39;agent comptable de l&#39;organisme national assurent la ma&icirc;trise d&#39;ouvrage des applications informatiques nationales. Toutefois, la ma&icirc;trise d&#39;ouvrage d&#39;une application informatique nationale peut &ecirc;tre d&eacute;l&eacute;gu&eacute;e &agrave; une caisse ou &agrave; une union de caisses relevant d&#39;un organisme national. Les modalit&eacute;s de cette d&eacute;l&eacute;gation sont d&eacute;finies par une convention sign&eacute;e par les directeurs et les agents comptables desdits organismes. Le directeur<ins class="ice-ins ice-cts-1" data-changedata="" data-cid="67" data-last-change-time="1582193492774" data-time="1582193489281" data-userid="1" data-username="Hugo"> pr&eacute;f&egrave;re manger</ins>&nbsp;de l&#39;organisme <del class="ice-del ice-cts-1" data-changedata="" data-cid="88" data-last-change-time="1582193515376" data-time="1582193515376" data-userid="1" data-username="Hugo">national assure la ma&icirc;trise d&#39;&oelig;uvre des applications informatiques nationales</del><ins class="ice-ins ice-cts-1" data-changedata="" data-cid="89" data-last-change-time="1582193525641" data-time="1582193518793" data-userid="1" data-username="Hugo"> de sant&eacute; publique qui aime les pates</ins>. Toutefois, la ma&icirc;trise d&#39;&oelig;uvre d&#39;une application <del class="ice-del ice-cts-1" data-changedata="" data-cid="126" data-last-change-time="1582193542736" data-time="1582193542736" data-userid="1" data-username="Hugo">informatique</del> nationale peut &ecirc;tre d&eacute;l&eacute;gu&eacute;e &agrave; une caisse ou &agrave; une union de caisses relevant d&#39;un organisme national. Les modalit&eacute;s de cette d&eacute;l&eacute;gation sont d&eacute;finies par une convention sign&eacute;e par les directeurs desdits organismes.</p>\n	\N	Hugo - jeudi 20 février 2020 à 11:12:22	\N
3	2	<p>Le directeur et l&#39;agent comptable de l&#39;organisme national assurent la ma&icirc;trise d&#39;ouvrage des applications informatiques nationales. Toutefois, la ma&icirc;trise d&#39;ouvrage d&#39;une application informatique nationale peut &ecirc;tre d&eacute;l&eacute;gu&eacute;e &agrave; une caisse ou &agrave; une union de caisses relevant d&#39;un organisme national. Les modalit&eacute;s de cette d&eacute;l&eacute;gation sont d&eacute;finies par une convention sign&eacute;e par les directeurs et les agents comptables desdits organismes. Le directeur pr&eacute;f&egrave;re manger&nbsp;de l&#39;organisme de sant&eacute; publique qui aime les pates. Toutefois, la ma&icirc;trise d&#39;&oelig;uvre d&#39;une application nationale peut &ecirc;tre d&eacute;l&eacute;gu&eacute;e &agrave; une caisse ou &agrave; une union de caisses relevant d&#39;un organisme national. Les modalit&eacute;s de cette d&eacute;l&eacute;gation sont d&eacute;finies par une convention sign&eacute;e par les directeurs desdits organismes.</p>\n	\N	Hugo - jeudi 20 février 2020 à 11:14:25	\N
4	12		4	Hugo - vendredi 28 février 2020 à 12:52:54	\N
5	12	<p>L&#39;Etat met &agrave; la disposition des communes de Mayotte le premier &eacute;quipement informatique leur permettant d&#39;assurer la tenue informatis&eacute;e de l&#39;&eacute;tat civil. Les communes sont comp&eacute;tentes pour maintenir, remplacer et adapter &agrave; leurs frais les mat&eacute;riels informatiques requis pour assurer la tenue informatis&eacute;e des actes de l&#39;&eacute;tat civil.<ins class="ice-ins ice-cts-1" data-changedata="" data-cid="2" data-last-change-time="1582890778604" data-time="1582890777787" data-userid="1" data-username="Hugo"> azepoazkepoazkepoaz</ins></p>\n	4	Hugo - vendredi 28 février 2020 à 12:52:58	\N
6	12	<p>L&#39;Etat met &agrave; la disposition des communes de Mayotte le premier &eacute;quipement informatique leur permettant d&#39;assurer la tenue informatis&eacute;e de l&#39;&eacute;tat civil. Les communes sont comp&eacute;tentes pour maintenir, remplacer et adapter &agrave; leurs frais les mat&eacute;riels informatiques requis pour assurer la tenue informatis&eacute;e des actes de l&#39;&eacute;tat civil.<ins class="ice-cts-1 ice-ins" data-changedata="" data-cid="2" data-last-change-time="1582890918871" data-time="1582890777787" data-userid="1" data-username="Hugo"> azepoazkepoazkepoaz</ins></p>\n\n<p><ins class="ice-cts-1 ice-ins" data-changedata="" data-cid="2" data-last-change-time="1582890918871" data-time="1582890777787" data-userid="1" data-username="Hugo">azeaijeoiazje﻿</ins></p>\n	4	Hugo - vendredi 28 février 2020 à 12:55:18	\N
8	7	<p>I.-Les informations mentionn&eacute;es aux articles 104 &agrave; 106 sont fournies par le responsable de traitement &agrave; la personne concern&eacute;e par tout moyen appropri&eacute;, y compris par voie &eacute;lectronique et, de mani&egrave;re g&eacute;n&eacute;rale, sous la m&ecirc;me forme que la demande. II.-Aucun paiement n&#39;est exig&eacute; pour prendre les mesures et fournir ces m&ecirc;mes informations, sauf en cas de demande manifestement infond&eacute;e ou abusive. En cas de demande manifestement infond&eacute;e ou abusive, le responsable de traitement peut &eacute;galement refuser de donner suite &agrave; la demande. En cas de contestation, la charge de la preuve du caract&egrave;re manifestement infond&eacute; ou abusif des demandes incombe au responsable de traitement auquel elles sont adress&eacute;es.</p>\n	2	Feldstein Hugo - lundi 2 mars 2020 à 11:37:38	\N
10	7	<p>I.-Les informations <del class="ice-del ice-cts-1" data-changedata="" data-cid="4" data-last-change-time="1583225484395" data-time="1583225484395" data-userid="1" data-username="Feldstein Hugo">mentionn&eacute;es aux articles 104 &agrave; 106 sont fournies par le responsable de traitement </del>&agrave; la personne concern&eacute;e par tout moyen appropri&eacute;, y compris par voie &eacute;lectronique et, de mani&egrave;re g&eacute;n&eacute;rale, sous la m&ecirc;me forme que la demande. II.-Aucun paiement n&#39;est exig&eacute; <del class="ice-cts-2 ice-del" data-changedata="" data-cid="3" data-last-change-time="1583145335843" data-time="1583145335843" data-userid="2" data-username="Michelle Dupont">En cas de contestation, la charge de la preuve </del>pour prendre les mesures et fournir ces m&ecirc;mes informations, sauf en cas de demande manifestement infond&eacute;e ou abusive. En cas de demande manifestement infond&eacute;e ou abusive, le responsable de traitement peut &eacute;galement refuser de donner suite &agrave; la demande. <del class="ice-cts-1 ice-del" data-changedata="" data-cid="2" data-last-change-time="1583145335843" data-time="1583145335843" data-userid="1" data-username="Feldstein Hugo">En cas de contestation, la charge de la preuve </del>du caract&egrave;re manifestement infond&eacute; ou abusif des demandes incombe au responsable de traitement auquel elles sont adress&eacute;es.</p>\n	2	Feldstein Hugo - mardi 03 mars 2020 à 09:51:33	\N
18	51	<p><ins class="ice-ins ice-cts-2" data-changedata="" data-cid="7" data-last-change-time="1587456379787" data-time="1587456366586" data-userid="1" data-username="Feldstein Hugo"> Bonjour j'ai tout suprimé et le résultat ensuite n'est pas bon</ins></p>\n	4	Feldstein Hugo - mardi 21 avril 2020 à 10:06:19	<p> Bonjour j'ai tout suprimé et le résultat ensuite n'est pas bon</p>\n
11	7	<p>I.-Les informations <del class="ice-cts-1 ice-del" data-changedata="" data-cid="4" data-last-change-time="1583225484395" data-time="1583225484395" data-userid="1" data-username="Feldstein Hugo">mentionn&eacute;es aux articles 104 &agrave; 106 sont fournies par le responsable de traitement </del>&agrave; la personne concern&eacute;e par tout moyen appropri&eacute;, y compris par voie &eacute;lectronique et, de mani&egrave;re g&eacute;n&eacute;rale, sous la m&ecirc;me forme que la demande. II.-Aucun paiement n&#39;est exig&eacute; <del class="ice-cts-2 ice-del" data-changedata="" data-cid="3" data-last-change-time="1583145335843" data-time="1583145335843" data-userid="2" data-username="Michelle Dupont">En cas de contestation, la charge de la preuve </del>pour prendre les mesures et fournir ces m&ecirc;mes informations, sauf en cas de demande manifestement infond&eacute;e ou abusive. En cas de demande manifestement infond&eacute;e ou abusive, le responsable de traitement peut &eacute;galement refuser de donner suite &agrave; la demande. <del class="ice-cts-1 ice-del" data-changedata="" data-cid="2" data-last-change-time="1583145335843" data-time="1583145335843" data-userid="1" data-username="Feldstein Hugo">En cas de contestation, la charge de la preuve </del>du caract&egrave;re manifestement infond&eacute; ou abusif des demandes incombe au responsable de traitement auquel elles sont adress&eacute;es.<ins class="ice-ins ice-cts-1" data-changedata="" data-cid="5" data-last-change-time="1586527406714" data-time="1586527099590" data-userid="1" data-username="Feldstein Hugo"> test d&#39;ajout azeaziej aziejazioe jazoi jzaiouozeiu. hfoziuen foizandfilunsd iolnsdiubisqdbviu sdvfouh qzeo&ccedil;f zeaoifh jz&ccedil;pehf p&ccedil;!zh foiza ef oizanelijnaz efonzaeoufnazieufb ziefbzeihf bzeh fizhebfizebf hzef jhzabef hzeabf ozea</ins></p>\n	2	Feldstein Hugo - vendredi 10 avril 2020 à 16:03:26	\N
12	7	<p>I.-Les informations <del class="ice-cts-1 ice-del" data-changedata="" data-cid="4" data-last-change-time="1583225484395" data-time="1583225484395" data-userid="1" data-username="Feldstein Hugo">mentionn&eacute;es aux articles 104 &agrave; 106 sont fournies par le responsable de traitement </del>&agrave; la personne concern&eacute;e par tout moyen appropri&eacute;, y compris par voie &eacute;lectronique et, de mani&egrave;re g&eacute;n&eacute;rale, sous la m&ecirc;me forme que la demande. II.-Aucun paiement n&#39;est exig&eacute; <del class="ice-cts-2 ice-del" data-changedata="" data-cid="3" data-last-change-time="1583145335843" data-time="1583145335843" data-userid="2" data-username="Michelle Dupont">En cas de contestation, la charge de la preuve </del>pour prendre les mesures et fournir ces m&ecirc;mes informations, sauf en cas de demande manifestement infond&eacute;e ou abusive. En cas de demande manifestement infond&eacute;e ou abusive, le responsable de traitement peut &eacute;galement refuser de donner suite &agrave; la demande. <del class="ice-cts-1 ice-del" data-changedata="" data-cid="2" data-last-change-time="1583145335843" data-time="1583145335843" data-userid="1" data-username="Feldstein Hugo">En cas de contestation, la charge de la preuve </del>du caract&egrave;re manifestement infond&eacute; ou abusif des demandes incombe au responsable de traitement auquel elles sont adress&eacute;es.<ins class="ice-ins ice-cts-1" data-changedata="" data-cid="5" data-last-change-time="1586527406714" data-time="1586527099590" data-userid="1" data-username="Feldstein Hugo"> test d&#39;ajout azeaziej aziejazioe jazoi jzaiouozeiu. hfoziuen foizandfilunsd iolnsdiubisqdbviu sdvfouh qzeo&ccedil;f zeaoifh jz&ccedil;pehf p&ccedil;!zh foiza ef oizanelijnaz efonzaeoufnazieufb ziefbzeihf bzeh fizhebfizebf hzef jhzabef hzeabf ozea</ins></p>\n	2	Feldstein Hugo - vendredi 10 avril 2020 à 16:03:27	\N
13	51	<p>Lorsque le juge administratif est saisi par le président de la Commission nationale de l'informatique et des libertés, sur le fondement de l'article 21 de la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, d'une demande en référé concernant la mise en oeuvre d'un traitement ou l'exploitation de données à caractère personnel par l'Etat, <ins class="ice-ins ice-cts-2" data-changedata="" data-cid="2" data-last-change-time="1587454485506" data-time="1587454470448" data-userid="1" data-username="Feldstein Hugo">une égalité collective visant a modifié une partie de la loi </ins>, toute autre personne publique ainsi que toute personne privée chargée d'une mission de service public, il est statué suivant la procédure de référé instituée par les dispositions de l'article L. 521-2.</p>\n\n<p><ins class="ice-ins ice-cts-2" data-changedata="" data-cid="63" data-last-change-time="1587454496360" data-time="1587454491154" data-userid="1" data-username="Feldstein Hugo">Bonjour a tous je suis un nouveau p</ins></p>\n	4	Feldstein Hugo - mardi 21 avril 2020 à 09:34:56	<p>Lorsque le juge administratif est saisi par le président de la Commission nationale de l'informatique et des libertés, sur le fondement de l'article 21 de la loi n° 78-17 du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés, d'une demande en référé concernant la mise en oeuvre d'un traitement ou l'exploitation de données à caractère personnel par l'Etat, une égalité collective visant a modifié une partie de la loi , toute autre personne publique ainsi que toute personne privée chargée d'une mission de service public, il est statué suivant la procédure de référé instituée par les dispositions de l'article L. 521-2.</p>\n\n<p>Bonjour a tous je suis un nouveau p</p>\n
14	51	<p></p>\n\n<p><ins class="ice-ins ice-cts-2" data-changedata="" data-cid="3" data-last-change-time="1587454761142" data-time="1587454744560" data-userid="1" data-username="Feldstein Hugo">Bonjour je ne suis pas un nouveaux paragraphe puisque j'ai été seulement ajouter a la place de l'ancien</ins></p>\n	4	Feldstein Hugo - mardi 21 avril 2020 à 09:39:21	<p></p>\n\n<p>Bonjour je ne suis pas un nouveaux paragraphe puisque j'ai été seulement ajouter a la place de l'ancien</p>\n
15	51	<p><ins class="ice-cts-2 ice-ins" data-changedata="" data-cid="3" data-last-change-time="1587454761142" data-time="1587454744560" data-userid="1" data-username="Feldstein Hugo">Bonjour je ne suis pas un nouveaux paragraphe puisque j'ai été seulement ajouter a la place de l'ancien</ins></p>\n	4	Feldstein Hugo - mardi 21 avril 2020 à 09:39:54	<p>Bonjour je ne suis pas un nouveaux paragraphe puisque j'ai été seulement ajouter a la place de l'ancien</p>\n
16	51	<p><ins class="ice-cts-2 ice-ins" data-changedata="" data-cid="3" data-last-change-time="1587454817455" data-time="1587454744560" data-userid="1" data-username="Feldstein Hugo">Bonjour je ne suis pas un nouveaux paragraphe puisque j'ai été seulement ajouter a la place de l'ancien.</ins></p>\n	4	Feldstein Hugo - mardi 21 avril 2020 à 09:40:17	<p>Bonjour je ne suis pas un nouveaux paragraphe puisque j'ai été seulement ajouter a la place de l'ancien.</p>\n
17	51	<p><ins class="ice-ins ice-cts-2" data-changedata="" data-cid="3" data-last-change-time="1587455725102" data-time="1587455710509" data-userid="1" data-username="Feldstein Hugo"> Je pense qu'en réalite ceci doit être le bout de phrase complètement modifier tu comprends ?</ins></p>\n	4	Feldstein Hugo - mardi 21 avril 2020 à 09:55:25	<p> Je pense qu'en réalite ceci doit être le bout de phrase complètement modifier tu comprends ?</p>\n
\.


--
-- Data for Name: project; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project (id, name, description, create_at, create_by) FROM stdin;
3	Projet 2	project 2	2020-02-21	1
4	Mon Projet	ceci est mon	2020-02-21	1
2	Projet de Test1	Icing biscuit tart tootsie roll topping macaroon sesame. sesame wafer lollipop dessert. lollipop chocolate bar halvah sugar plum licorice sesame tiramisu dragée candy ice cream chocolate. croissant caramels fruitcake bear claw halvah tootsie roll danish halvah donut croissant halvah croissant. croissant candy canes donut dessert jelly beans sesame caramels chupa chups chocolate powder sesame jujubes. sweet fruitcake ice cream cake cupcake powder bear claw tart toffee danish snaps. apple pie lemon drops tootsie roll gummi bears candy toffee caramels bear claw jujubes powder. gummi bears apple pie caramels toffee wafer candy. oat cake powder caramels chocolate bar powder apple pie sesame marshmallow topping marzipan. gingerbread cake candy canes bear claw chocolate sugar.	2020-02-07	1
\.


--
-- Data for Name: project_administrator; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_administrator (id, project_id, administrator_id, unique_administrator) FROM stdin;
2	2	1	Projet de Test_1
4	3	1	Projet 2_1
6	4	1	Mon Projet_1
\.


--
-- Data for Name: project_writer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.project_writer (id, project_id, writer_id, unique_writer) FROM stdin;
6	2	2	2_2
7	4	2	Mon Projet_2
8	4	3	3_4
9	2	3	3_2
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, email, password, active, create_at, "firstName", "lastName", ministry, management, confirmed) FROM stdin;
2	Florence	florence@duenas.com	$2a$10$Gsk2D9nQq/odJKaw58RYfOyEkh.xVoa2MyiSQhgIdrP/l0tGSZN3W	t	2020-01-15 16:57:02.263717+00	Florence	Duenas	Santé	DGE3	t
3	Michelle	michelle@bonjour.com	$2a$10$9W.GFVkmo2NHR8Cxd467SOgmIAlaDSzB7IZP2TdQVdqbFNz00A9MW	t	2019-12-23 18:52:51.651532+00	Michelle	Lafont	Affaires étrangère	PPE 3	t
1	Hugo	hugo.feldstein@celaneo.com	$2a$10$IlusAL1u.ZWvGfOLptd7Z.9KNcvJ9AiW4XB6zN.xw7mhD4FPl44Yu	t	2019-12-17 14:01:47.159525+00	Hugo	Feldstein	Sociale Etrange	DGEP 25788	t
\.


--
-- Name: remote_schemas_id_seq; Type: SEQUENCE SET; Schema: hdb_catalog; Owner: postgres
--

SELECT pg_catalog.setval('hdb_catalog.remote_schemas_id_seq', 1, false);


--
-- Name: article_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.article_comment_id_seq', 45, true);


--
-- Name: article_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.article_id_seq', 61, true);


--
-- Name: article_revision_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.article_revision_id_seq', 19, true);


--
-- Name: project_administrator_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_administrator_id_seq', 6, true);


--
-- Name: project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_id_seq', 4, true);


--
-- Name: project_writer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_writer_id_seq', 9, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 3, true);


--
-- Name: event_invocation_logs event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: event_log event_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_log
    ADD CONSTRAINT event_log_pkey PRIMARY KEY (id);


--
-- Name: event_triggers event_triggers_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_triggers
    ADD CONSTRAINT event_triggers_pkey PRIMARY KEY (name);


--
-- Name: hdb_allowlist hdb_allowlist_collection_name_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_allowlist
    ADD CONSTRAINT hdb_allowlist_collection_name_key UNIQUE (collection_name);


--
-- Name: hdb_computed_field hdb_computed_field_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_computed_field
    ADD CONSTRAINT hdb_computed_field_pkey PRIMARY KEY (table_schema, table_name, computed_field_name);


--
-- Name: hdb_function hdb_function_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_function
    ADD CONSTRAINT hdb_function_pkey PRIMARY KEY (function_schema, function_name);


--
-- Name: hdb_permission hdb_permission_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_permission
    ADD CONSTRAINT hdb_permission_pkey PRIMARY KEY (table_schema, table_name, role_name, perm_type);


--
-- Name: hdb_query_collection hdb_query_collection_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_query_collection
    ADD CONSTRAINT hdb_query_collection_pkey PRIMARY KEY (collection_name);


--
-- Name: hdb_relationship hdb_relationship_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_relationship
    ADD CONSTRAINT hdb_relationship_pkey PRIMARY KEY (table_schema, table_name, rel_name);


--
-- Name: hdb_table hdb_table_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_table
    ADD CONSTRAINT hdb_table_pkey PRIMARY KEY (table_schema, table_name);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: remote_schemas remote_schemas_name_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.remote_schemas
    ADD CONSTRAINT remote_schemas_name_key UNIQUE (name);


--
-- Name: remote_schemas remote_schemas_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.remote_schemas
    ADD CONSTRAINT remote_schemas_pkey PRIMARY KEY (id);


--
-- Name: article_comment article_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_comment
    ADD CONSTRAINT article_comment_pkey PRIMARY KEY (id);


--
-- Name: article article_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_pkey PRIMARY KEY (id);


--
-- Name: article_revision article_revision_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_revision
    ADD CONSTRAINT article_revision_pkey PRIMARY KEY (id);


--
-- Name: article article_unique_article_projet_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_unique_article_projet_key UNIQUE (unique_article_projet);


--
-- Name: project_administrator project_administrator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_administrator
    ADD CONSTRAINT project_administrator_pkey PRIMARY KEY (id);


--
-- Name: project_administrator project_administrator_unique_administrator_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_administrator
    ADD CONSTRAINT project_administrator_unique_administrator_key UNIQUE (unique_administrator);


--
-- Name: project project_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_id_key UNIQUE (id);


--
-- Name: project project_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_pkey PRIMARY KEY (id);


--
-- Name: project_writer project_writer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_writer
    ADD CONSTRAINT project_writer_pkey PRIMARY KEY (id);


--
-- Name: project_writer project_writer_unique_writer_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_writer
    ADD CONSTRAINT project_writer_unique_writer_key UNIQUE (unique_writer);


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: event_invocation_logs_event_id_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_invocation_logs_event_id_idx ON hdb_catalog.event_invocation_logs USING btree (event_id);


--
-- Name: event_log_delivered_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_delivered_idx ON hdb_catalog.event_log USING btree (delivered);


--
-- Name: event_log_locked_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_locked_idx ON hdb_catalog.event_log USING btree (locked);


--
-- Name: event_log_trigger_name_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_trigger_name_idx ON hdb_catalog.event_log USING btree (trigger_name);


--
-- Name: hdb_schema_update_event_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_schema_update_event_one_row ON hdb_catalog.hdb_schema_update_event USING btree (((occurred_at IS NOT NULL)));


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: hdb_schema_update_event hdb_schema_update_event_notifier; Type: TRIGGER; Schema: hdb_catalog; Owner: postgres
--

CREATE TRIGGER hdb_schema_update_event_notifier AFTER INSERT OR UPDATE ON hdb_catalog.hdb_schema_update_event FOR EACH ROW EXECUTE FUNCTION hdb_catalog.hdb_schema_update_event_notifier();


--
-- Name: user__insert__public__article user__insert__public__article; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER user__insert__public__article INSTEAD OF INSERT ON hdb_views.user__insert__public__article FOR EACH ROW EXECUTE FUNCTION hdb_views.user__insert__public__article();


--
-- Name: user__insert__public__article_comment user__insert__public__article_comment; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER user__insert__public__article_comment INSTEAD OF INSERT ON hdb_views.user__insert__public__article_comment FOR EACH ROW EXECUTE FUNCTION hdb_views.user__insert__public__article_comment();


--
-- Name: user__insert__public__article_revision user__insert__public__article_revision; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER user__insert__public__article_revision INSTEAD OF INSERT ON hdb_views.user__insert__public__article_revision FOR EACH ROW EXECUTE FUNCTION hdb_views.user__insert__public__article_revision();


--
-- Name: user__insert__public__project user__insert__public__project; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER user__insert__public__project INSTEAD OF INSERT ON hdb_views.user__insert__public__project FOR EACH ROW EXECUTE FUNCTION hdb_views.user__insert__public__project();


--
-- Name: user__insert__public__project_administrator user__insert__public__project_administrator; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER user__insert__public__project_administrator INSTEAD OF INSERT ON hdb_views.user__insert__public__project_administrator FOR EACH ROW EXECUTE FUNCTION hdb_views.user__insert__public__project_administrator();


--
-- Name: user__insert__public__project_writer user__insert__public__project_writer; Type: TRIGGER; Schema: hdb_views; Owner: postgres
--

CREATE TRIGGER user__insert__public__project_writer INSTEAD OF INSERT ON hdb_views.user__insert__public__project_writer FOR EACH ROW EXECUTE FUNCTION hdb_views.user__insert__public__project_writer();


--
-- Name: event_invocation_logs event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.event_log(id);


--
-- Name: event_triggers event_triggers_schema_name_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_triggers
    ADD CONSTRAINT event_triggers_schema_name_table_name_fkey FOREIGN KEY (schema_name, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: hdb_allowlist hdb_allowlist_collection_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_allowlist
    ADD CONSTRAINT hdb_allowlist_collection_name_fkey FOREIGN KEY (collection_name) REFERENCES hdb_catalog.hdb_query_collection(collection_name);


--
-- Name: hdb_computed_field hdb_computed_field_table_schema_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_computed_field
    ADD CONSTRAINT hdb_computed_field_table_schema_table_name_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: hdb_permission hdb_permission_table_schema_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_permission
    ADD CONSTRAINT hdb_permission_table_schema_table_name_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: hdb_relationship hdb_relationship_table_schema_table_name_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_relationship
    ADD CONSTRAINT hdb_relationship_table_schema_table_name_fkey FOREIGN KEY (table_schema, table_name) REFERENCES hdb_catalog.hdb_table(table_schema, table_name) ON UPDATE CASCADE;


--
-- Name: article_comment article_comment_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_comment
    ADD CONSTRAINT article_comment_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.article(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: article_comment article_comment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_comment
    ADD CONSTRAINT article_comment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: article article_project_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_project_fkey FOREIGN KEY (project) REFERENCES public.project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: article_revision article_revision_article_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.article_revision
    ADD CONSTRAINT article_revision_article_fkey FOREIGN KEY (article) REFERENCES public.article(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_administrator project_administrator_administrator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_administrator
    ADD CONSTRAINT project_administrator_administrator_id_fkey FOREIGN KEY (administrator_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_administrator project_administrator_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_administrator
    ADD CONSTRAINT project_administrator_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project project_create_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project
    ADD CONSTRAINT project_create_by_fkey FOREIGN KEY (create_by) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: project_writer project_writer_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_writer
    ADD CONSTRAINT project_writer_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.project(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: project_writer project_writer_writer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_writer
    ADD CONSTRAINT project_writer_writer_id_fkey FOREIGN KEY (writer_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--

