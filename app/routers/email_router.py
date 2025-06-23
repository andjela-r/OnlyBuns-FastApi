from fastapi import APIRouter
from starlette.responses import JSONResponse
from pydantic import EmailStr, BaseModel
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

class EmailUser(BaseModel):
    name: str
    surname: str

class EmailSchema(BaseModel):
    receiver_mail: EmailStr
    user: EmailUser

router = APIRouter()

@router.post("/send_mail")
def send_mail(email: EmailSchema) -> JSONResponse:
    sender = "noreply@onlybuns.com"
    receiver = email.receiver_mail
    full_name = f"{email.user.name} {email.user.surname}"
    activation_link = f"http://localhost:8000/users/activate/{receiver}"

    # Create the multipart email
    message = MIMEMultipart("alternative")
    message["Subject"] = "Activate Your OnlyBuns Account"
    message["From"] = f"OnlyBuns <{sender}>"
    message["To"] = f"{full_name} <{receiver}>"

    # Plain text version
    text = f"""\
Hi {email.user.name},

An account has been created for you on OnlyBuns.
Please visit the following link to activate your account:
{activation_link}
"""

    # HTML version with a proper <a href>
    html = f"""\
<html>
  <body style="font-family: sans-serif;">
    <p>Hi {email.user.name},</p>
    <p>An account has been created for you on <strong>OnlyBuns</strong>.</p>
    <p>Please click the button below to activate your account:</p>
    <br>
    <p><a href="{activation_link}" style="padding: 10px 20px; background-color: #ff69b4; color: white; text-decoration: none; border-radius: 4px;">Activate Account</a></p>
    <br>
    <p>Lots of love,</p>
    <p>OnlyBuns Team</p>
  </body>
</html>
"""

    # Attach both versions
    message.attach(MIMEText(text, "plain", "utf-8"))
    message.attach(MIMEText(html, "html", "utf-8"))

    # Send email
    with smtplib.SMTP("sandbox.smtp.mailtrap.io", 2525) as server:
        server.starttls()
        server.login("c8da8dbb3c4378", "ee7a4680cbcfb1")
        server.sendmail(sender, [receiver], message.as_string())

    return JSONResponse(content={"message": f"Email sent to {full_name} at {receiver}"})