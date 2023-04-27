# Improving Cereal Seed Systems in Rural Mali

The app is deployed on [voxeo](evolution.voxeo.com) (voice browser) and [fly.io](fly.io) (backend).

The Voice URL in voxeo config should be https://ict4d-app.fly.dev/greeting.xml .

![illustration](sample.png)

## Setup

The deployment includes a Postgres database, whose configuration file is not in this repo since it is an [out-of-the-box database](https://fly.io/docs/postgres/) provided by fly.io.

To connect with the database locally for testing purpose with [flycli](https://fly.io/docs/flyctl/) (assume the database is named as `ict4d-db`):

```shell
fly postgres connect -a ict4d-db
```

## Structure

The application flow:

![image](https://user-images.githubusercontent.com/56589633/232572733-6bd63a1a-7f06-4a26-be56-9392d498aec0.png)
