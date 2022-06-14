# SignUp UseCase

> ## Data

- Name
- Gender
- Email
- Password
- Password Confirmation

> ## Main Flow

1. API receives data and check if it was provided;
2. Check if email is valid and check passwords match;
3. Check if the email address already exists;
4. Criptography the password;
5. Add a new account;
6. Return API response status code 201 and body with new account data.

> ## Alternative Flow: Missing data

6. Return statusCode: 400
   Return body: Missing field: (field name)

> ## Alternative Flow: Invalid data

6. Return statusCode: 422
   Return body: Invalid field: (field name)

> ## Alternative Flow: Library or External API throws

6. Return statusCode: 500
   Return body: Unexpected Internal Error 500
