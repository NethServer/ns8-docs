.. _os_updates-section:

========================
Operating system updates
========================

NethServer 8 is installed on top of GNU/Linux distributions and tries to preserve default configuration as much as possible.
It's up to the system administrator to choose how the operating system updates are applied.

Usually, it's a good practice to apply security updates as soon as possible.
But, even if NethServer depends on few packages, not all system administrators feel confident about automatic updates.

Please, take a look to your distribution documentation:

* `Rocky Linux/AlmaLinux <https://docs.rockylinux.org/guides/security/dnf_automatic/>`_
* `Debian <https://wiki.debian.org/UnattendedUpgrades>`_

.. note::

   It's not recommended to enable automatic updates on CentOS Stream, since it is considered a preview of next RHEL stable release.
   Updates could bring major releases of podman and SELinux policies introducing unexpected bugs.

If your looking for core and modules see :ref:`updates-section`.
