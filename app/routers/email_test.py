import smtplib
email = {
    "user": {
        "name": "John",
        "surname": "Doe"
    },
    "receiver": "john.doe@example.com"
}

sender = "noreply@onlybuns.com"
receiver = email["receiver"]

message = f"""\
Subject: Activate Your OnlyBuns Account
To: {email["user"]["name"]} {email["user"]["surname"]} <{receiver}>
From: OnlyBuns <{sender}>

Hi {email["user"]["name"]},

An account has been created for you on OnlyBuns.
Please visit http://localhost:8000/users/activate/{receiver} to activate your account."""

with smtplib.SMTP("sandbox.smtp.mailtrap.io", 2525) as server:
    server.starttls()
    server.login("c8da8dbb3c4378", "ee7a4680cbcfb1")
    server.sendmail(sender, receiver, message)
