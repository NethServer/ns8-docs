===============================
FAQ: Frequently Asked Questions
===============================


What is NethServer 8 (NS8)?
===========================

NethServer 8, aka NS8, is a simple-to-use container orchestrator.
It's aimed for Linux sysadmins who need the flexibility of containers,
but do not want to mess around with a complex tools like Kubernetes.

Like NethServer 7, NS8 hides the system complexity behind a ready-to-use
beautiful Web User Interface.

Do you want to easily manage applications without worrying about installation details?
NS8 is for you.

What is the status of NS8?
==========================

NethServer 8 has reached the :ref:`stable <releases-glossary>` status:
read the :ref:`release notes <release-notes-section>`.

What is the difference between NethServer 7 (NS7) and NethServer 8?
===================================================================

NethServer 7 is an operating system built on top of CentOS 7.
It is heavily-coupled with the underlying OS. It installs applications
using RPMs package and configure them with a configuration management
system called e-smith.

NethServer 8 can run on different :ref:`Linux distributions <supported-distros-section>`.
It installs applications using containers and configures them using
a multi-node architecture.

As NS7, NS8 is perfectly suited for small offices and medium enterprises.

What can I do with NethServer 8?
================================

You can serve an Active Directory domain with Samba 4, or just a simple OpenLDAP server.
You can host multiple instances of the same application connected to different local or
remote user domain.

If you need a new user domain, just create a new node and join it to the existing cluster:
you can spread the workload across multiple machines.
Of course, everything is under your control just from the UI of the main node.
No matter if nodes are local or remotes, they are securely connected with an encrypted VPN.

If you like an all-in-one server. you can do it too.

Can I migrate from NethServer 7 to NethServer 8?
================================================

Migrating to the next major release is a primary goal, as always has been.
The migration procedure is documented :ref:`here <migration-section>`.
We are working hard to make it *safe* and *painless*.

How can I install NethServer 8?
===============================

See the :ref:`install chapter <install-section>`.

Where can I download it?
========================

You can download a :ref:`pre-built image <install_image-section>` or 
just :ref:`install <install_linux-section>` on a supported distribution.

Can I install NethServer on a virtual machine?
==============================================

Yes. You can choose any hypervisor or cloud provider supporting
:ref:`these distributions <supported-distros-section>` or 
:ref:`pre-built images <install_image-section>`. 

Can I install it on bare metal?
===============================

Sure. See the question below.

What hardware is supported?
===========================

Anything supported by your chosen distribution.
Make sure to take a look to the :ref:`system-requirements-section`.

Does NethServer 8 have Cockpit?
===============================

No, NethServer 8 has a brand new User Interface.
You can still `install Cockpit <https://cockpit-project.org/running.html>`_ to manage the underlying system,
like changing the network configuration.

Can I use NethServer 8 as UTM firewall?
=======================================

No. NethServer 8 has a limited built-in firewall used to protect only
local running services.

If you are looking for a nice firewall project, NethSecurity_ is the
successor of NethServer 7 firewall capabilities.

.. _NethSecurity: https://docs.nethsecurity.org
