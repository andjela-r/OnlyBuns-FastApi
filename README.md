# OnlyBuns-FastApi
Web aplikacija razvijena kao projektni zadatak na predmetu Internet softverske arhitekture.

## Requirements
* Anaconda  <br>
* PostgreSql verzija 16

## Instalacija i podešavanje okruženja za projekat  

### 1. Preuzimanje Anaconde  
Preuzmite najnoviju verziju [Anaconde](https://www.anaconda.com/products/distribution) i instalirajte je.

---

### 2. Kreiranje novog okruženja  
Kada pokrenete Anacondu, idite na **"Environments"**, zatim kliknite na **"Create"** u donjem levom uglu i unesite sledeće:  
- **Name:** `isa`  
- **Python version:** `3.11.11`  
- Kliknite na **"Create"**.

---

### 3. Podešavanje okruženja za VSCode  
Vratite se na početnu stranicu Anaconde.  
U delu gde piše **"All applications on `<ime env-a>`"** (verovatno trenutno stoji `root` ili `base`), promenite da ime okruženja bude `isa`.  
Nakon toga pokrenite **VSCode**.  

---

### 4. Provera verzije Pythona  
Otvorite terminal u VSCode-u i proverite verziju Pythona sa:  
```bash
python --version
```
Trebalo bi da prikaže: ```3.11.11```

### 5. Instalacija paketa
U terminalu možete instalirati pakete sa:

```bash
pip install <ime-paketa>
```

### 6. Instalacija iz requirements.txt
Ako imate fajl requirements.txt i već ste navigirali terminal do foldera gde se nalazi taj fajl, pokrenite:

```bash
pip install -r requirements.txt
```

### 7. Ažuriranje requirements.txt
Kada dodate nove pakete, potrebno ih je dodati i u requirements.txt. Najlakše to možete uraditi sa:

```bash
pip freeze > requirements.txt
```

## Uputstvo za pokretanje projekta
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