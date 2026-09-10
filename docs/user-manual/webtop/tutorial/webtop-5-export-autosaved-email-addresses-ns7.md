---
title: "WebTop-5: Export automatically saved email addresses from NS7 and import them on NS8"
sidebar_position: 99
---
# WebTop-5: Export automatically saved email addresses from NS7 and import them on NS8

WebTop automatically saves email addresses used when sending messages. These addresses are not exposed in address books, but are saved in the database. For this reason, you cannot easily export them from the web interface.

If you do not migrate WebTop from NS7 to NS8 with the migration tool, you may need to export this list of addresses and then import it as a CSV file into the new WebTop installation on NS8.

To export the addresses, access the shell of the NS7 server and run this query for each user from which you want to export the list. Replace both occurrences of `userx` with the target user:

```bash
su - postgres -c "psql webtop5 -c \"copy (select value as email from core.servicestore_entries where user_id ='userx' and context='recipients') to '/tmp/recipients_userx.csv' delimiter ',' csv header;\""
```

The CSV file created at `/tmp/recipients_userx.csv` can be imported from the web interface into a new address book on the new WebTop installation on NS8. See [Import contacts](../contacts.md#import-contacts).
