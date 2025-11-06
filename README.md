# Task Manager

Simppeli tehtävienhallintasovellus, joka käyttää Django Rest Frameworkia backendinä ja Reactia frontendinä.

## Asennusohjeet

### Backend

1. Siirry backend-kansioon:

```bash
cd backend
```

2. Luo virtuaaliympäristö:

```bash
python3 -m venv venv
```

3. Aktivoi virtuaaliympäristö:

```bash
source venv/bin/activate
```

4. Asenna riippuvuudet:

```bash
pip install -r requirements.txt
```

5. Suorita migraatiot:

```bash
python manage.py migrate
```

### Frontend

1. Siirry frontend-kansioon:

```bash
cd frontend
```

2. Asenna riippuvuudet:

```bash
npm i
```

## Käynnistys

### Backend

1. Siirry backend-kansioon ja aktivoi virtuaaliympäristö:

```bash
cd backend
source venv/bin/activate
```

2. Käynnistä Django-palvelin:

```bash
python manage.py runserver
```

Backend käynnistyy osoitteessa: `http://localhost:8000`

### Frontend

1. Siirry frontend-kansioon:

```bash
cd frontend
```

2. Käynnistä Vite-serveri:

```bash
npm run dev
```

Frontend käynnistyy osoitteessa: `http://localhost:5173`

## Testikäyttöön kirjautumistunnukset

Testikäyttäjän luominen:

```bash
cd backend
source venv/bin/activate
python manage.py createsuperuser
```

Esimerkkitunnukset:

- **Käyttäjänimi:** testuser
- **Salasana:** test1234 (vähintään 8 merkkiä pitkä salasana)

JWT-tokenin hankkiminen:

```bash
POST http://localhost:8000/api/token/
{
  "username": "testuser",
  "password": "test1234"
}
```

## API-endpointit

### JWT-token

- **POST** `/api/token/` - Hae access ja refresh token
- **POST** `/api/token/refresh/` - Päivitä access token jos se on vanhentunut

### Tehtävät

- **GET** `/api/tasks/` - Hae kaikki tehtävät
- **POST** `/api/tasks/` - Luo uusi tehtävä
- **GET** `/api/tasks/{id}/` - Hae yksittäinen tehtävä
- **PUT** `/api/tasks/{id}/` - Päivitä tehtävä
- **DELETE** `/api/tasks/{id}/` - Poista tehtävä

Esimerkki Body-parametrit:

```json
{
  "title": "testitehtävä",
  "description": "testataan tehtävienhallintaa",
  "status": "TODO",
  "priority": "HIGH",
  "deadline": "2025-11-10"
}
```

Kaikki API-kutsut vaativat Authorization-headerin: `Bearer <access_token>`

## Admin-paneeli

Admin-paneeli löytyy osoitteesta: `http://localhost:8000/admin/`, jonne voi kirjautua luomallasi testikäyttäjän tunnuksilla.
