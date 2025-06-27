# OnlyBuns-FastApi
Web aplikacija razvijena kao projektni zadatak na predmetu Internet softverske arhitekture.

## Pokretanje projekta na Windows-u
### Requirements 
* Anaconda  <br>
* PostgreSql verzija 16

### Instalacija i podešavanje okruženja za projekat  

#### 1. Preuzimanje Anaconde  
Preuzmite najnoviju verziju [Anaconde](https://www.anaconda.com/products/distribution) i instalirajte je.

---

#### 2. Kreiranje novog okruženja  
Kada pokrenete Anacondu, idite na **"Environments"**, zatim kliknite na **"Create"** u donjem levom uglu i unesite sledeće:  
- **Name:** `isa`  
- **Python version:** `3.11.11`  
- Kliknite na **"Create"**.

---

#### 3. Podešavanje okruženja za VSCode  
Vratite se na početnu stranicu Anaconde.  
U delu gde piše **"All applications on `<ime env-a>`"** (verovatno trenutno stoji `root` ili `base`), promenite da ime okruženja bude `isa`.  
Nakon toga pokrenite **VSCode**.  

---

#### 4. Provera verzije Pythona  
Otvorite terminal u VSCode-u i proverite verziju Pythona sa:  
```bash
python --version
```
Trebalo bi da prikaže: ```3.11.11```

#### 5. Instalacija paketa
U terminalu možete instalirati pakete sa:

```bash
pip install <ime-paketa>
```

#### 6. Instalacija iz requirements.txt
Ako imate fajl requirements.txt i već ste navigirali terminal do foldera gde se nalazi taj fajl, pokrenite:

```bash
pip install -r requirements.txt
```

#### 7. Ažuriranje requirements.txt
Kada dodate nove pakete, potrebno ih je dodati i u requirements.txt. Najlakše to možete uraditi sa:

```bash
pip freeze > requirements.txt
```

### Uputstvo za pokretanje projekta
***Baza*** <br>
* Postaviti svoj username i password (prilagoditi 'DATABASE_URL u .env-u') <br>
* Napraviti bazu pod imenom ‘onlybunsdb’ <br>
* Pokrenuti pgAdmin, sa postavljenom bazom

***Backend*** <br>
```bash
cd putanja/do/onlybunsfastapi
uvicorn app.main:app --reload #ovaj flag ako zelite da vam se automatski rebuild-uje
```
* Ako se uspesno pokrenula aplikacija, radi na portu 8000

***Frontend*** <br>
* Pozicionirati se putem terminala u folder ‘ui-onlybuns’ 
```bash
cd putanja/do/ui-onlybuns
```
i kucati komandu: 
```bash
npm run dev
```
* Ako je uspesno pokrenuta aplikacija, projekat radi na portu 3000


## Pokretanje projekta na MacOS-u sa Docker-om

Za pokretanje dela projekta koristeći Docker, potrebno je da imate instaliran [Docker Desktop](https://www.docker.com/products/docker-desktop/).
> **Napomena:** Backend se pokreće na isti način kao i bez Docker-a.

### 1. Klonirajte repozitorijum i pozicionirajte se u root folder projekta

```bash
git clone andjela-r/OnlyBuns-FastApi.git
cd OnlyBuns-FastApi
```

### 2. Podesite Python okruženje pomoću pyenv i virtualnog okruženja

Pre instalacije paketa, preporučuje se korišćenje [pyenv](https://github.com/pyenv/pyenv) za upravljanje verzijama Pythona i kreiranje izolovanog virtualnog okruženja:

1. Instalirajte pyenv (ako već nije instaliran):

    ```bash
    brew install pyenv
    ```

2. Instalirajte odgovarajuću verziju Pythona:

    ```bash
    pyenv install 3.11.11
    ```

3. Postavite lokalnu verziju Pythona za projekat:

    ```bash
    pyenv local 3.11.11
    ```

4. Kreirajte i aktivirajte virtualno okruženje:

    ```bash
    python -m venv .venv
    source .venv/bin/activate
    ```

### 3. Instaliranje iz requirements.txt

Nakon što je virtualno okruženje aktivirano, instalirajte sve potrebne pakete:

```bash
pip install -r requirements.txt
```

### 4. Pokrenite Docker servise

U root folderu projekta pokrenite:

```bash
docker-compose up --build -d
```

Ova komanda će pokrenuti sve servise definisane u `docker-compose.yml` fajlu (baza i frontend).

- Frontend na portu **3000**
- PostgreSQL na portu **5432** 

### 5. Zaustavljanje servisa

Za zaustavljanje svih servisa koristite:

```bash
docker compose down
```

Za brisanje trajnih podataka baze, možete koristiti:

```bash
docker compose down -v
```

> **Napomena:** Pre pokretanja proverite i podesite promenljive u `.env`

## Koriscene biblioteke
- **FastAPI** - za backend aplikaciju
- **PostgreSQL** - kao baza podataka
- **SQLAlchemy** - ORM za rad sa bazom podataka
- **Pydantic** - za validaciju podataka
- **smtplib** - za slanje emailova
- **passlib** - za hash-ovanje lozinki
- **pybloom_live** - za rad sa Bloom filterom
- **jose** - za rad sa JWT tokenima
- **Docker** - za kontejnerizaciju aplikacije
- **Next.js (React)** - za frontend aplikaciju
- **Tailwind CSS** - za stilizaciju frontend aplikacije
