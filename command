docker compose restart api

SELECT * FROM "USER";

SELECT * FROM "USER_TRUST";



psql -h 167.172.66.102 -p 5432 -U postgres -d postgres

\l

\c aikon

\dt


USER_TRUST: 
(User1 -> User2 direction)

    user1 | user2 | status
    ------+-------+-------
    1     | 2     | trusts
    1     | 3     | trusts
    1     | 4     | blocked
    1     | 7     | ignored 




up_users:
    id | username | email | provider | password | reset_password_token | confirmation_token | confirmed | blocked | phone | first_loggedin | last_loggedin |                                                                          otp_token                                                                           |      name       |       created_at        |       updated_at        | created_by_id | updated_by_id |  city   | company_name |  bio   |       document_id        | locale | published_at

