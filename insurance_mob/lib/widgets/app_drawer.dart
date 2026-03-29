import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:insurance_mob/models/user.dart';
import 'package:insurance_mob/providers/auth_provider.dart';
import 'package:provider/provider.dart';

class PortalDrawer extends StatelessWidget {
  final User user;

  const PortalDrawer({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          UserAccountsDrawerHeader(
            decoration: const BoxDecoration(color: Color(0xFF4F46E5)),
            accountName: Text(user.displayName),
            accountEmail: Text(user.email),
            currentAccountPicture: CircleAvatar(
              child: Text(user.firstName.isNotEmpty
                  ? user.firstName[0].toUpperCase()
                  : '?'),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard_outlined),
            title: const Text('Dashboard'),
            onTap: () {
              Navigator.pop(context);
              context.go('/portal');
            },
          ),
          ListTile(
            leading: const Icon(Icons.storefront_outlined),
            title: const Text('Browse policies'),
            onTap: () {
              Navigator.pop(context);
              context.go('/portal/browse');
            },
          ),
          ListTile(
            leading: const Icon(Icons.folder_outlined),
            title: const Text('My policies'),
            onTap: () {
              Navigator.pop(context);
              context.go('/portal/policies');
            },
          ),
          ListTile(
            leading: const Icon(Icons.add_moderator_outlined),
            title: const Text('File a claim'),
            onTap: () {
              Navigator.pop(context);
              context.go('/portal/fnol');
            },
          ),
          ListTile(
            leading: const Icon(Icons.receipt_long_outlined),
            title: const Text('My claims'),
            onTap: () {
              Navigator.pop(context);
              context.go('/portal/claims');
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Sign out'),
            onTap: () async {
              await context.read<AuthProvider>().logout();
              if (context.mounted) context.go('/login');
            },
          ),
        ],
      ),
    );
  }
}

class AdminDrawer extends StatelessWidget {
  final User user;

  const AdminDrawer({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          UserAccountsDrawerHeader(
            decoration: const BoxDecoration(color: Color(0xFF4F46E5)),
            accountName: Text(user.displayName),
            accountEmail: Text('${user.role} · ${user.email}'),
            currentAccountPicture: CircleAvatar(
              child: Text(user.firstName.isNotEmpty
                  ? user.firstName[0].toUpperCase()
                  : '?'),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard_outlined),
            title: const Text('Dashboard'),
            onTap: () {
              Navigator.pop(context);
              context.go('/admin');
            },
          ),
          ListTile(
            leading: const Icon(Icons.list_alt_outlined),
            title: const Text('All claims'),
            onTap: () {
              Navigator.pop(context);
              context.go('/admin/claims');
            },
          ),
          ListTile(
            leading: const Icon(Icons.fact_check_outlined),
            title: const Text('Surveyor panel'),
            onTap: () {
              Navigator.pop(context);
              context.go('/admin/surveyor');
            },
          ),
          ListTile(
            leading: const Icon(Icons.policy_outlined),
            title: const Text('Policies'),
            onTap: () {
              Navigator.pop(context);
              context.go('/admin/policies');
            },
          ),
          ListTile(
            leading: const Icon(Icons.people_outline),
            title: const Text('Users'),
            onTap: () {
              Navigator.pop(context);
              context.go('/admin/users');
            },
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout),
            title: const Text('Sign out'),
            onTap: () async {
              await context.read<AuthProvider>().logout();
              if (context.mounted) context.go('/login');
            },
          ),
        ],
      ),
    );
  }
}
