---
title: Cloud
sidebar_position: 7
---
# Cloud

Use this section to manage Nextcloud resources, personal cloud links, chat, and launcher integrations in WebTop.

## Nextcloud integration

Before proceeding, verify that the **Nextcloud** module has been installed from the [Software center](../../administrator-manual/installation/software_center.md).

By default, Nextcloud integration is disabled for all users. To enable it, use the administration panel which can be accessed using the webtop admin password

If you want to enable the service for all users, proceed as follows:

1.  access the administrative panel and select **Groups**:

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_groups.png)

2.  modify the properties of the "users" group by double-clicking and selecting the button related to the Authorizations:

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_permission.png)

3.  add to existing authorizations those related to both the `STORE_CLOUD` and `STORE_OTHER` resources by selecting the items as shown below:

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_nextcloud_auth_1.png)

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_nextcloud_auth_2.png)

to get this:

![image](/_static/user-manual/webtop/screenshots/webtop-admin_panel_nextcloud_auth_3.png)

4.  save and close.

From now on, any user will be able to insert the Nextcloud resource (local or remote) in the personal Cloud.

To do this, simply select the Cloud button and add a new Nextcloud resource by right-clicking on **My resources** and then **Add resource** in this way:

![image](/_static/user-manual/webtop/screenshots/webtop-nextcloud_1.png)

A pre-filled wizard will open:

![image](/_static/user-manual/webtop/screenshots/webtop-nextcloud_2.png)

:::note

Remember to fill in the User name and Password fields related to access to the Nextcloud resource, otherwise it will not be possible to use the public link to the shared files

:::

:::note

The **Path** must be changed from `/nextcloud/remote.php/webdav` to `/remote.php/webdav`. Also make sure to enter the Nextcloud FQDN inside the **Host** (eg. `nextcloud.mydomain.com`).

:::

Proceed with the Next button until the Wizard is complete.

## Personal Cloud

The personal Cloud module allows you to send and receive documents via web links.

### How to create a link to send a document

To create the link, select the button at the top right:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud1.png)

Follow the wizard to generate the link, use the field **date** to set the deadline.

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud2.png)

you can create a **password** to protect it:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud3.png)

The link will be generated and will be inserted in the new mail:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud4.png)

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud5.png)

Downloading the file generates a notification to the sender:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud6.png)

### Request for a document

To create the request, insert the subject of the email then select the button at the top right:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud7.png)

Follow the wizard. You can set both an expiration date and a password. The link will be automatically inserted into the message:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud8.png)

A request email will be sent to upload the document to the Cloud:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud9.png)

The sender will receive a notification for each file that will be uploaded:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud10.png)

To download the files just access your personal `Cloud --> Uploads --> Folder` with date and name:

![image](/_static/user-manual/webtop/screenshots/webtop-doc_cloud11.png)

## Chat integration {#webtop-chat}

Web chat integration installation is disabled by default for all users.

To enable chat integration:

1.  Install the "Ejabberd" application from the `Software center` page See [Install applications](../../administrator-manual/installation/software_center.md#install-applications) and [Ejabberd](../../administrator-manual/applications/ejabberd.md).
2.  In Ejabberd `Settings` page, the field `Ejabberd domain (FQDN)` must match the value of `Mail domain` in WebTop's settings.
3.  Access WebTop as admin user then enable the web chat authorization:
    - Access the **Administration** menu, then `Domains --> NethServer --> Groups --> Users --> Authorizations`
    - `Add (+) --> Services --> com.sonicle.webtop.core (WebTop) --> Resource --> WEBCHAT --> Action --> ACCESS`
    - Click **OK** then save and close

## Launcher customization

The launcher is the icon-based menu on the left of the page. You can add custom buttons to the launcher.

To configure the buttons, access the WebTop administration panel and select -\> **Domains** -\> **NethServer** -\> **Launcher** :

![image](/_static/user-manual/webtop/screenshots/webtop_launchers.png)

For each button, enter these three values

- `Name` : tab descriptive text that appears with mouse-over
- `Link URL` : URL to be opened in a new browser
- `Icon URL` : icon image URL, it should always be a publicly reachable address. To avoid scaling problems, use vector images

If you can't find a public URL for the icon image, you can upload the icon on WebTop public cloud. WebTop public cloud already hosts mailcards images. Access the administrator panel and click on **Cloud** -\> **Public Images**, then insert a URL like `https://<public_name_server>/webtop/resources/156c0407/images/<icon.svg>`.

The configured custom link buttons will be shown to all users at the next login.
